import { defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2/promise';
import PDFDocument from 'pdfkit';
import { Resend } from 'resend';
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
            invoiceData.customerName = rows[0].username || 'Client DevUnity';
          }

          if (!invoiceData.customerEmail || invoiceData.customerEmail.trim() === '') {
            invoiceData.customerEmail = rows[0].email;
          }

          console.log(`Informations utilisateur récupérées depuis la base de données: ${rows[0].username} (${rows[0].email})`);
        }
      } catch (dbError) {
        console.error('Erreur lors de la récupération des informations utilisateur:', dbError);
      }
    }

    if (!invoiceData.customerEmail || !invoiceData.customerName) {
      return {
        success: false,
        error: 'Données client incomplètes'
      };
    }

    const pdfBuffer = await generateInvoicePDF(invoiceData);

    const emailSent = await sendInvoiceEmail(invoiceData, pdfBuffer);

    return {
      success: true,
      message: 'Facture générée et envoyée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la génération/envoi de la facture:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la génération de la facture'
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

      doc.fontSize(12).font('Helvetica-Bold').text('DevUnity SAS', { align: 'left' });
      doc.text('86000 Poitiers, France');
      doc.text('Email: support@devunity.com');
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
      doc.text('Premium DevUnity subscription (lifetime)', tableX, currentY, {
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
      doc.fontSize(8).text('DevUnity SAS - Capital social: 1 000€ - SIRET: 123 456 789 00012 - RCS Paris - TVA Intracommunautaire: FR12345678900', { align: 'center' });
      doc.text('Payment made by credit card via Stripe', { align: 'center' });
      doc.moveDown();
      doc.text(`Facture générée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

async function sendInvoiceEmail(invoiceData: InvoiceData, pdfBuffer: Buffer): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('Resend API key missing');
      return false;
    }

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'StackUnity <factures@stackunity.tech>',
      to: invoiceData.customerEmail,
      subject: 'Your StackUnity invoice',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://devunity.com/logo/devunity-title.png" alt="DevUnity Logo" style="max-width: 200px;" />
          </div>
          
          <h2 style="color: #333;">Thank you for your purchase!</h2>
          
          <p>Hello ${invoiceData.customerName},</p>
          
          <p>Thank you for your purchase of the lifetime Premium StackUnity subscription. You will find attached your invoice.</p>
          
          <div style="background-color: #f5f5f5; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p><strong>Montant total:</strong> ${invoiceData.totalAmount.toFixed(2)}€ ${!invoiceData.isVatExempt && invoiceData.taxPercentage > 0 ? 'TTC' : 'HT'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <p>You can now enjoy all the premium features of DevUnity:</p>
          <ul>
            <li>Database Designer</li>
            <li>SEO Audit</li>
            <li>Robots & Schema</li>
            <li>Premium Components</li>
          </ul>
          
          <p>If you have any questions regarding your invoice or your subscription, please contact our support team at <a href="mailto:support@devunity.com">support@devunity.com</a>.</p>
          
          <p>Best regards,<br />The DevUnity team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
            <p>StackUnity SAS - 86000 Poitiers, France</p>
            <p>SIRET: 93872035600014 - TVA Intracommunautaire: FR44938720356</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `facture-stackunity-${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBuffer.toString('base64')
        }
      ]
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return false;
    }

    console.log('Email envoyé avec Resend, ID:', data?.id);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
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