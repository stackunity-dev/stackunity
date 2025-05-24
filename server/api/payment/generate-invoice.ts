import { defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2/promise';
import PDFDocument from 'pdfkit';
import { EmailService } from '../../utils/EmailService';
import { pool } from '../db';

interface InvoiceData {
  paymentId: string;
  customerName: string;
  customerEmail: string;
  vatNumber?: string;
  country: string;
  isBusinessCustomer: boolean;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  taxPercentage: number;
  isVatExempt: boolean;
  selectedPlan: string;
  date: string;
}

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    let userId = user?.userId;

    const body = await readBody(event);
    let invoiceData: InvoiceData = body;

    if (userId) {
      try {
        const [rows] = await pool.execute<RowDataPacket[]>(
          'SELECT email, username FROM users WHERE id = ?',
          [userId]
        );

        if (rows.length > 0) {
          if (!invoiceData.customerName || invoiceData.customerName.trim() === '') {
            invoiceData.customerName = rows[0].username || 'Client StackUnity';
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

    if (typeof emailResult === 'boolean') {
      if (!emailResult) {
        return {
          success: false,
          error: 'Error while sending the invoice email'
        };
      }
    } else if (!emailResult.success) {
      return {
        success: false,
        error: 'Error while sending the invoice email'
      };
    }

    return {
      success: true,
      message: 'Invoice generated and sent successfully',
      emailSent: true,
      emailId: typeof emailResult === 'object' ? emailResult.emailId : undefined,
      emailRecipient: invoiceData.customerEmail
    };
  } catch (error) {
    console.error('Error while generating/sending the invoice:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error while generating the invoice'
    };
  }
});

async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
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
      doc.text('TVA Intracommunautaire: FR44938720356');
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold').text('Factured to:', { align: 'left' });
      doc.fontSize(10).font('Helvetica').text(invoiceData.customerName);
      if (invoiceData.isBusinessCustomer && invoiceData.vatNumber) {
        doc.text(`TVA: ${invoiceData.vatNumber}`);
      }
      doc.text(`Pays: ${getCountryName(invoiceData.country)}`);
      doc.text(`Email: ${invoiceData.customerEmail}`);
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold').text('Invoice details:', { align: 'left' });
      doc.fontSize(10).font('Helvetica').text(`Invoice number: INV-${Date.now()}`);
      doc.text(`Date: ${invoiceData.date || new Date().toLocaleDateString('fr-FR')}`);
      doc.text(`Payment ID: ${invoiceData.paymentId}`);
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold');
      const tableTop = doc.y;
      const tableHeaders = ['Description', 'Price HT', 'VAT', 'Total'];
      const tableWidths = [250, 100, 100, 100];
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
      doc.text(`${invoiceData.selectedPlan} StackUnity subscription (lifetime)`, tableX, currentY, {
        width: tableWidths[0],
        align: 'left'
      });
      doc.text(`${invoiceData.baseAmount.toFixed(2)}€`, tableX + tableWidths[0], currentY, {
        width: tableWidths[1],
        align: 'left'
      });

      if (invoiceData.isVatExempt) {
        doc.text('Exempted', tableX + tableWidths[0] + tableWidths[1], currentY, {
          width: tableWidths[2],
          align: 'left'
        });
      } else {
        doc.text(`${invoiceData.taxAmount.toFixed(2)}€ (${invoiceData.taxPercentage}%)`, tableX + tableWidths[0] + tableWidths[1], currentY, {
          width: tableWidths[2],
          align: 'left'
        });
      }

      doc.text(`${invoiceData.totalAmount.toFixed(2)}€`, tableX + tableWidths[0] + tableWidths[1] + tableWidths[2], currentY, {
        width: tableWidths[3],
        align: 'left'
      });

      currentY += 30;
      doc.moveTo(tableX, currentY).lineTo(tableX + tableWidths.reduce((a, b) => a + b, 0), currentY).stroke();
      currentY += 10;

      doc.font('Helvetica-Bold');
      doc.text('Total HT:', tableX + tableWidths[0], currentY, {
        width: tableWidths[1] + tableWidths[2],
        align: 'right'
      });
      doc.text(`${invoiceData.baseAmount.toFixed(2)}€`, tableX + tableWidths[0] + tableWidths[1] + tableWidths[2], currentY, {
        width: tableWidths[3],
        align: 'left'
      });
      currentY += 20;

      if (!invoiceData.isVatExempt) {
        doc.text(`TVA (${invoiceData.taxPercentage}%):`, tableX + tableWidths[0], currentY, {
          width: tableWidths[1] + tableWidths[2],
          align: 'right'
        });
        doc.text(`${invoiceData.taxAmount.toFixed(2)}€`, tableX + tableWidths[0] + tableWidths[1] + tableWidths[2], currentY, {
          width: tableWidths[3],
          align: 'left'
        });
        currentY += 20;
      }

      doc.text('Total:', tableX + tableWidths[0], currentY, {
        width: tableWidths[1] + tableWidths[2],
        align: 'right'
      });
      doc.text(`${invoiceData.totalAmount.toFixed(2)}€`, tableX + tableWidths[0] + tableWidths[1] + tableWidths[2], currentY, {
        width: tableWidths[3],
        align: 'left'
      });
      currentY += 40;

      doc.fontSize(10).font('Helvetica');
      if (invoiceData.isVatExempt && invoiceData.isBusinessCustomer) {
        doc.text('VAT not applicable, Art. 283-2 du CGI - Autoliquidation of VAT', { align: 'center' });
      } else if (!isInEU(invoiceData.country)) {
        doc.text('Exportation outside the EU - VAT not applicable', { align: 'center' });
      }

      doc.moveDown(2);
      doc.fontSize(8).text('StackUnity SAS - Capital social: 1 000€ - SIRET: 123 456 789 00012 - RCS Paris - TVA Intracommunautaire: FR12345678900', { align: 'center' });
      doc.text('Payment made by credit card via Stripe', { align: 'center' });
      doc.moveDown();
      doc.text(`Facture générée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

async function sendInvoiceEmail(invoiceData: InvoiceData, pdfBuffer: Buffer): Promise<boolean | { success: boolean, emailId?: string }> {
  try {
    console.log('Tentative d\'envoi d\'email à:', invoiceData.customerEmail);

    const emailResult = await EmailService.sendPaymentConfirmationEmail(
      invoiceData.customerEmail,
      invoiceData.customerName,
      invoiceData.selectedPlan,
      invoiceData.totalAmount.toString(),
      { filename: 'invoice.pdf', content: pdfBuffer }
    );

    console.log('Résultat de l\'envoi d\'email:', emailResult);

    if (emailResult.error) {
      console.error('Erreur Resend:', emailResult.error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false };
  }
}

function getCountryName(countryCode: string): string {
  const countries: Record<string, string> = {
    'FR': 'France',
    'DE': 'Allemagne',
    'IT': 'Italie',
    'ES': 'Espagne',
    'GB': 'Royaume-Uni',
    'US': 'États-Unis',
    'CA': 'Canada',
    'BE': 'Belgique',
    'CH': 'Suisse',
    'LU': 'Luxembourg',
    'NL': 'Pays-Bas',
    'PT': 'Portugal',
    'AT': 'Autriche',
    'DK': 'Danemark',
    'SE': 'Suède',
    'NO': 'Norvège',
    'FI': 'Finlande',
    'PL': 'Pologne',
    'RO': 'Roumanie',
    'SK': 'Slovaquie',
    'SI': 'Slovénie',
    'CZ': 'République tchèque',
    'HU': 'Hongrie',
    'IE': 'Irlande',
    'LV': 'Lettonie',
    'LT': 'Lituanie',
    'MT': 'Malte'
  };

  return countries[countryCode] || countryCode;
}

function isInEU(countryCode: string): boolean {
  return countryCode.match(/^(AT|BE|BG|HR|CY|CZ|DK|EE|FI|FR|DE|GR|HU|IE|IT|LV|LT|LU|MT|NL|PL|PT|RO|SK|SI|ES|SE|CH|GB|US|CA|BE|CH|LU|NL|PT|AT|DK|SE|NO|FI|PL|RO|SK|SI)$/) !== null;
} 