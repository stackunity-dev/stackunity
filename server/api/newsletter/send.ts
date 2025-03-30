// @ts-ignore
import { Resend } from 'resend';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log('Données reçues:', body);

    if (!body.subject || !body.html || !body.text) {
      console.error('Données manquantes:', body);
      return {
        success: false,
        message: 'Données manquantes pour l\'envoi de l\'email'
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: 'noreply@portfolionurdjedd.com',
      to: 'djedidinur@gmail.com',
      subject: body.subject,
      html: body.html,
      text: body.text
    });

    const emailData = {
      body: {
        subject: body.subject,
        html: body.html,
        text: body.text
      }
    }

    await pool.execute('INSERT INTO newsletters_emails (subject, content) VALUES (?, ?)', [emailData.body.subject, emailData.body.html]);
    await pool.execute('UPDATE newsletters SET emails_sent = emails_sent + 1');

    return {
      success: true,
      message: 'Email envoyé avec succès',
      data: result
    };
  } catch (error: any) {
    console.error('Erreur détaillée:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    return {
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email',
      error: error.message,
      details: error.response?.data
    };
  }
});
