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
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        info: {
          Title: 'Facture StackUnity',
          Author: 'StackUnity SAS'
        }
      });

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // En-tête avec logo et dégradé
      doc.rect(0, 0, 595.28, 100)
        .fillColor('#1a237e')
        .fill();

      doc.fontSize(30)
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .text('FACTURE', 50, 50, { align: 'center' });

      // Informations de l'entreprise
      doc.moveDown(2);
      doc.fillColor('#1a237e')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('StackUnity', 50, 150);

      doc.fillColor('#424242')
        .fontSize(10)
        .font('Helvetica')
        .text('86000 Poitiers, France', 50, 170)
        .text('Email: support@stackunity.tech', 50, 185)
        .text('SIRET: 93872035600014', 50, 200)
        .text('TVA Intracommunautaire: FR44938720356', 50, 215);

      // Informations du client
      doc.moveDown(2);
      doc.fillColor('#1a237e')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Billed to:', 50, 270);

      doc.fillColor('#424242')
        .fontSize(10)
        .font('Helvetica')
        .text(invoiceData.customerName, 50, 290);

      if (invoiceData.isBusinessCustomer && invoiceData.vatNumber) {
        doc.text(`TVA: ${invoiceData.vatNumber}`, 50, 305);
      }
      doc.text(`Country: ${getCountryName(invoiceData.country)}`, 50, 320)
        .text(`Email: ${invoiceData.customerEmail}`, 50, 335);

      // Détails de la facture
      doc.moveDown(2);
      doc.fillColor('#1a237e')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Facture details:', 50, 380);

      doc.fillColor('#424242')
        .fontSize(10)
        .font('Helvetica')
        .text(`Invoice number: INV-${Date.now()}`, 50, 400)
        .text(`Date: ${invoiceData.date || new Date().toLocaleDateString('fr-FR')}`, 50, 415)
        .text(`Payment ID: ${invoiceData.paymentId}`, 50, 430);

      // Tableau des produits
      doc.moveDown(2);
      const tableTop = 480;
      const tableHeaders = ['Description', 'Prix HT', 'TVA', 'Total'];
      const tableWidths = [250, 100, 100, 100];
      const tableX = 25;
      let currentY = tableTop;

      // En-tête du tableau
      doc.fillColor('#1a237e')
        .font('Helvetica-Bold')
        .fontSize(10);

      // Dessiner les en-têtes avec alignement
      doc.text('Description', tableX, currentY, { width: tableWidths[0] });
      doc.text('Prix HT', tableX + tableWidths[0], currentY, { width: tableWidths[1], align: 'right' });
      doc.text('TVA', tableX + tableWidths[0] + tableWidths[1], currentY, { width: tableWidths[2], align: 'right' });
      doc.text('Total', tableX + tableWidths[0] + tableWidths[1] + tableWidths[2], currentY, { width: tableWidths[3], align: 'right' });

      currentY += 20;
      doc.strokeColor('#1a237e')
        .lineWidth(1)
        .moveTo(tableX, currentY)
        .lineTo(tableX + tableWidths.reduce((a, b) => a + b, 0), currentY)
        .stroke();

      // Contenu du tableau
      currentY += 10;
      doc.fillColor('#424242')
        .font('Helvetica')
        .fontSize(10);

      // Description
      doc.text(`${invoiceData.selectedPlan} StackUnity subscription (lifetime)`, tableX, currentY, {
        width: tableWidths[0]
      });

      // Prix HT
      doc.text(`${invoiceData.baseAmount.toFixed(2)}€`, tableX + tableWidths[0], currentY, {
        width: tableWidths[1],
        align: 'right'
      });

      // TVA
      if (invoiceData.isVatExempt) {
        doc.text('Exempté', tableX + tableWidths[0] + tableWidths[1], currentY, {
          width: tableWidths[2],
          align: 'right'
        });
      } else {
        doc.text(`${invoiceData.taxAmount.toFixed(2)}€ (${invoiceData.taxPercentage}%)`,
          tableX + tableWidths[0] + tableWidths[1], currentY, {
          width: tableWidths[2],
          align: 'right'
        });
      }

      // Total
      doc.text(`${invoiceData.totalAmount.toFixed(2)}€`,
        tableX + tableWidths[0] + tableWidths[1] + tableWidths[2], currentY, {
        width: tableWidths[3],
        align: 'right'
      });

      // Ligne de séparation
      currentY += 30;
      doc.strokeColor('#1a237e')
        .lineWidth(1)
        .moveTo(tableX, currentY)
        .lineTo(tableX + tableWidths.reduce((a, b) => a + b, 0), currentY)
        .stroke();

      // Totaux
      currentY += 20;
      const totalX = tableX + tableWidths[0];
      const totalWidth = tableWidths[1] + tableWidths[2] + tableWidths[3];
      const totalLabelWidth = 150;
      const totalAmountWidth = 100;

      // Total HT
      doc.fillColor('#1a237e')
        .font('Helvetica-Bold')
        .text('Total HT:', totalX, currentY, {
          width: totalWidth - totalAmountWidth,
          align: 'right'
        });
      doc.text(`${invoiceData.baseAmount.toFixed(2)}€`, totalX + totalWidth - totalAmountWidth, currentY, {
        width: totalAmountWidth,
        align: 'right'
      });

      // TVA
      if (!invoiceData.isVatExempt) {
        currentY += 20;
        doc.text(`TVA (${invoiceData.taxPercentage}%):`, totalX, currentY, {
          width: totalWidth - totalAmountWidth,
          align: 'right'
        });
        doc.text(`${invoiceData.taxAmount.toFixed(2)}€`, totalX + totalWidth - totalAmountWidth, currentY, {
          width: totalAmountWidth,
          align: 'right'
        });
      }

      // Total TTC
      currentY += 20;
      doc.fillColor('#1a237e')
        .font('Helvetica-Bold')
        .text('Total TTC:', totalX, currentY, {
          width: totalWidth - totalAmountWidth,
          align: 'right'
        });
      doc.text(`${invoiceData.totalAmount.toFixed(2)}€`, totalX + totalWidth - totalAmountWidth, currentY, {
        width: totalAmountWidth,
        align: 'right'
      });

      // Pied de page
      currentY += 60;
      const footerX = 50;
      const footerWidth = 495.28; // Largeur A4 - marges

      doc.fillColor('#424242')
        .fontSize(8)
        .font('Helvetica');

      if (invoiceData.isVatExempt && invoiceData.isBusinessCustomer) {
        doc.text('VAT not applicable, Art. 283-2 du CGI - Autoliquidation of VAT', footerX, currentY, {
          width: footerWidth,
          align: 'center'
        });
      } else if (!isInEU(invoiceData.country)) {
        doc.text('Exportation outside EU - VAT not applicable', footerX, currentY, {
          width: footerWidth,
          align: 'center'
        });
      }

      currentY += 15;
      doc.text('StackUnity - SIRET: 93872035600014 - RCS Poitiers', footerX, currentY, {
        width: footerWidth,
        align: 'center'
      });

      currentY += 15;
      doc.text('Payment made by credit card via Stripe', footerX, currentY, {
        width: footerWidth,
        align: 'center'
      });

      currentY += 15;
      doc.text(`Invoice generated on ${new Date().toLocaleDateString('fr-FR')} at ${new Date().toLocaleTimeString('fr-FR')}`, footerX, currentY, {
        width: footerWidth,
        align: 'center'
      });

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