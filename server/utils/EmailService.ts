import { Resend } from 'resend';
import { EmailTemplates, WelcomeNewsletterEmailTemplate } from './EmailTemplates';

export const resend = new Resend(process.env.RESEND_API_KEY as string);


export class EmailService {
  static async sendWelcomeEmail(email: string, username: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from: 'StackUnity <noreply@stackunity.tech>',
        to: email,
        subject: 'Welcome to StackUnity !',
        html: EmailTemplates.welcomeEmailTemplate(username, email),
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Exception sending welcome email:', error);
      return { success: false, error: error.message || 'Unknown error sending welcome email' };
    }
  }

  static async sendTrialEndingEmail(email: string, username: string, daysLeft: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from: 'StackUnity <noreply@stackunity.tech>',
        to: email,
        subject: `Votre période d'essai se termine dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`,
        html: EmailTemplates.trialEndingEmailTemplate(username, daysLeft, email),
      });

      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email de fin de période d\'essai:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Exception lors de l\'envoi de l\'email de fin de période d\'essai:', error);
      return { success: false, error: error.message || 'Erreur inconnue lors de l\'envoi de l\'email' };
    }
  }

  static async sendPaymentConfirmationEmail(email: string, username: string, planName: string, amount: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from: 'StackUnity <noreply@stackunity.tech>',
        to: email,
        subject: 'Confirmation de votre abonnement StackUnity',
        html: EmailTemplates.paymentConfirmationEmailTemplate(username, planName, amount, email),
      });

      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation de paiement:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Exception lors de l\'envoi de l\'email de confirmation de paiement:', error);
      return { success: false, error: error.message || 'Erreur inconnue lors de l\'envoi de l\'email' };
    }
  }

  static async sendWelcomeNewsletterEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from: 'StackUnity <noreply@stackunity.tech>',
        to: email,
        subject: 'Welcome to StackUnity Newsletter',
        html: WelcomeNewsletterEmailTemplate.welcomeNewsletterEmailTemplate(email),
      });

      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email de bienvenue à la newsletter:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Exception lors de l\'envoi de l\'email de bienvenue à la newsletter:', error);
      return { success: false, error: error.message || 'Erreur inconnue lors de l\'envoi de l\'email' };
    }
  }
} 
