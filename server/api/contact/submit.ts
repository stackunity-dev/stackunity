import { Resend } from 'resend';
import { readBody, defineEventHandler } from 'h3';

const resend = new Resend(process.env.RESEND_API_KEY || 're_55555555555555555555555555555555');

export default defineEventHandler(async (event) => {
  const { name, email, subject, message } = await readBody(event);

  if (!name || !email || !subject || !message) {
    return { success: false, error: 'Tous les champs sont requis' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Devunity Support <support@devunity.tech>',
      to: 'support@devunity.tech',
      subject: subject,
      html: `
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
      `
    });

    if (error) {
      console.error('Erreur lors de l\'envoi du message de contact:', error);
      return { success: false, error: 'Erreur lors de l\'envoi du message de contact' };
    }

    return { success: true, message: 'Message envoyé avec succès' };
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message de contact:', error);
    return { success: false, error: 'Erreur lors de l\'envoi du message de contact' };
  }
});


