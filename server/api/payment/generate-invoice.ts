import { defineEventHandler, readBody } from 'h3';
import PDFDocument from 'pdfkit';
import { Resend } from 'resend';

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
    if (!user || !user.userId) {
      return {
        success: false,
        error: 'Utilisateur non authentifié'
      };
    }

    const body = await readBody(event);
    const invoiceData: InvoiceData = body;

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
      doc.fontSize(10).font('Helvetica').text('123 Avenue de la Tech');
      doc.text('75001 Paris, France');
      doc.text('Email: contact@devunity.com');
      doc.text('SIRET: 123 456 789 00012');
      doc.text('TVA: FR12345678900');
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold').text('Facturé à:', { align: 'left' });
      doc.fontSize(10).font('Helvetica').text(invoiceData.customerName);
      if (invoiceData.isBusinessCustomer && invoiceData.vatNumber) {
        doc.text(`TVA: ${invoiceData.vatNumber}`);
      }
      doc.text(`Pays: ${getCountryName(invoiceData.country)}`);
      doc.text(`Email: ${invoiceData.customerEmail}`);
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold').text('Détails de la facture:', { align: 'left' });
      doc.fontSize(10).font('Helvetica').text(`Numéro de facture: INV-${Date.now()}`);
      doc.text(`Date: ${invoiceData.date || new Date().toLocaleDateString('fr-FR')}`);
      doc.text(`ID de paiement: ${invoiceData.paymentId}`);
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold');
      const tableTop = doc.y;
      const tableHeaders = ['Description', 'Prix HT', 'TVA', 'Total'];
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
      doc.text('Abonnement Premium DevUnity (à vie)', tableX, currentY, {
        width: tableWidths[0],
        align: 'left'
      });
      doc.text(`${invoiceData.baseAmount.toFixed(2)}€`, tableX + tableWidths[0], currentY, {
        width: tableWidths[1],
        align: 'left'
      });

      if (invoiceData.isVatExempt) {
        doc.text('Exonérée', tableX + tableWidths[0] + tableWidths[1], currentY, {
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
        doc.text('TVA non applicable, Art. 283-2 du CGI - Autoliquidation de la TVA', { align: 'center' });
      } else if (!isInEU(invoiceData.country)) {
        doc.text('Exportation hors UE - TVA non applicable', { align: 'center' });
      }

      doc.moveDown(2);
      doc.fontSize(8).text('DevUnity SAS - Capital social: 1 000€ - SIRET: 123 456 789 00012 - RCS Paris - TVA: FR12345678900', { align: 'center' });
      doc.text('Paiement effectué par carte bancaire via Stripe', { align: 'center' });
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
      console.error('Clé API Resend manquante');
      return false;
    }

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'DevUnity <factures@devunity.tech>',
      to: invoiceData.customerEmail,
      subject: 'Votre facture DevUnity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://devunity.com/logo/devunity.png" alt="DevUnity Logo" style="max-width: 200px;" />
          </div>
          
          <h2 style="color: #333;">Merci pour votre achat!</h2>
          
          <p>Bonjour ${invoiceData.customerName},</p>
          
          <p>Nous vous remercions pour votre achat de l'abonnement Premium à vie de DevUnity. Vous trouverez ci-joint votre facture.</p>
          
          <div style="background-color: #f5f5f5; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p><strong>Montant total:</strong> ${invoiceData.totalAmount.toFixed(2)}€ ${!invoiceData.isVatExempt && invoiceData.taxPercentage > 0 ? 'TTC' : 'HT'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <p>Vous pouvez désormais profiter de toutes les fonctionnalités premium de DevUnity:</p>
          <ul>
            <li>Database Designer</li>
            <li>SEO Audit</li>
            <li>Robots & Schema</li>
            <li>Premium Components</li>
          </ul>
          
          <p>Si vous avez des questions concernant votre facture ou votre abonnement, n'hésitez pas à contacter notre équipe support à <a href="mailto:support@devunity.com">support@devunity.com</a>.</p>
          
          <p>Cordialement,<br />L'équipe DevUnity</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
            <p>DevUnity SAS - 123 Avenue de la Tech, 75001 Paris, France</p>
            <p>SIRET: 123 456 789 00012 - TVA: FR12345678900</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `facture-devunity-${new Date().toISOString().split('T')[0]}.pdf`,
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
  };

  return countries[countryCode] || countryCode;
}

function isInEU(countryCode: string): boolean {
  return countryCode.match(/^(AT|BE|BG|HR|CY|CZ|DK|EE|FI|FR|DE|GR|HU|IE|IT|LV|LT|LU|MT|NL|PL|PT|RO|SK|SI|ES|SE)$/) !== null;
} 