import { RowDataPacket } from 'mysql2/promise';
import PDFDocument from 'pdfkit';
import { EmailService } from '../../utils/EmailService';
import { pool } from '../db';

export interface InvoiceData {
  paymentId: string;
  customerName: string;
  customerEmail: string;
  baseAmount: number;
  currency: string;
  status: string;
  selectedPlan: string;
  date: string;
}

export async function generateInvoice(invoiceData: InvoiceData, userId?: string) {
  try {
    if (typeof invoiceData.baseAmount !== 'number' || isNaN(invoiceData.baseAmount)) {
      invoiceData.baseAmount = Number(invoiceData.baseAmount);
      if (isNaN(invoiceData.baseAmount)) {
        return {
          success: false,
          error: 'Invalid amount value'
        };
      }
    }

    if (userId) {
      try {
        const [rows] = await pool.execute<RowDataPacket[]>(
          'SELECT email, username FROM users WHERE id = ?',
          [userId]
        );

        if (rows.length > 0) {
          if (!invoiceData.customerName || invoiceData.customerName.trim() === '') {
            invoiceData.customerName = rows[0].username || 'StackUnity client';
          }

          if (!invoiceData.customerEmail || invoiceData.customerEmail.trim() === '') {
            invoiceData.customerEmail = rows[0].email;
          }
        }
      } catch (dbError) {
        console.error('Error retrieving user information:', dbError);
      }
    }

    if (!invoiceData.customerEmail || !invoiceData.customerName) {
      return {
        success: false,
        error: 'Customer data is incomplete'
      };
    }

    const pdfBuffer = await generateInvoicePDF(invoiceData);
    const emailResult = await sendInvoiceEmail(invoiceData, pdfBuffer);

    if (!emailResult.success) {
      return {
        success: false,
        error: 'Error while sending the invoice email'
      };
    }

    return {
      success: true,
      message: 'Invoice generated and sent successfully',
      emailSent: true,
      emailRecipient: invoiceData.customerEmail
    };
  } catch (error) {
    console.error('Error while generating/sending the invoice:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error while generating the invoice'
    };
  }
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ margin: 50 });

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).font('Helvetica-Bold').text('FACTURE', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).font('Helvetica-Bold').text('StackUnity SAS', { align: 'left' });
      doc.text('86000 Poitiers, France');
      doc.text('Email: support@stackunity.tech');
      doc.text('SIRET: 93872035600014 ');
      doc.text('VAT Intracommunautaire: FR44938720356');
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold').text('Factured to:', { align: 'left' });
      doc.fontSize(10).font('Helvetica').text(invoiceData.customerName);
      doc.text(`Email: ${invoiceData.customerEmail}`);
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold').text('Invoice details:', { align: 'left' });
      doc.fontSize(10).font('Helvetica').text(`Invoice number: INV-${Date.now()}`);
      doc.text(`Date: ${invoiceData.date || new Date().toLocaleDateString('fr-FR')}`);
      doc.text(`Payment ID: ${invoiceData.paymentId}`);
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold');
      const tableTop = doc.y;
      const tableHeaders = ['Description', 'Amount'];
      const tableWidths = [350, 150];
      const tableX = 50;
      let currentY = tableTop;

      doc.font('Helvetica-Bold');
      tableHeaders.forEach((header, i) => {
        doc.text(header, tableX + tableWidths.slice(0, i).reduce((a, b) => a + b, 0), currentY, {
          width: tableWidths[i],
          align: 'left'
        });
      });
      currentY += 20;
      doc.moveTo(tableX, currentY).lineTo(tableX + tableWidths.reduce((a, b) => a + b, 0), currentY).stroke();
      currentY += 10;

      doc.font('Helvetica');
      doc.text(`${invoiceData.selectedPlan} StackUnity subscription`, tableX, currentY, {
        width: tableWidths[0],
        align: 'left'
      });
      doc.text(`${invoiceData.baseAmount.toFixed(2)} ${invoiceData.currency}`, tableX + tableWidths[0], currentY, {
        width: tableWidths[1],
        align: 'left'
      });

      currentY += 30;
      doc.moveTo(tableX, currentY).lineTo(tableX + tableWidths.reduce((a, b) => a + b, 0), currentY).stroke();
      currentY += 10;

      doc.font('Helvetica-Bold');
      doc.text('Total:', tableX + tableWidths[0], currentY, {
        width: tableWidths[1],
        align: 'right'
      });
      doc.text(`${invoiceData.baseAmount.toFixed(2)} ${invoiceData.currency}`, tableX + tableWidths[0], currentY, {
        width: tableWidths[1],
        align: 'left'
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function sendInvoiceEmail(invoiceData: InvoiceData, pdfBuffer: Buffer): Promise<{ success: boolean }> {
  try {
    await EmailService.sendPaymentConfirmationEmail(
      invoiceData.customerEmail,
      invoiceData.customerName,
      invoiceData.selectedPlan,
      invoiceData.baseAmount.toFixed(2)
    );

    return {
      success: true
    };
  } catch (error) {
    console.error('Error in sendInvoiceEmail:', error);
    return {
      success: false
    };
  }
}
