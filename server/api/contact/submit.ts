import { defineEventHandler, readBody } from 'h3';
import { resend } from '../../utils/EmailService';


export default defineEventHandler(async (event) => {
  const { name, email, subject, message } = await readBody(event);

  if (!name || !email || !subject || !message) {
    return { success: false, error: 'All fields are required' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'StackUnity Support <support@stackunity.tech>',
      to: 'support@stackunity.tech',
      subject: subject,
      html: `
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
      `
    });

    const sendConfirmation = await resend.emails.send({
      from: 'StackUnity Support <support@stackunity.tech>',
      to: email,
      subject: 'Contact message received',
      html: `Thank you for contacting StackUnity. We will get back to you as soon as possible.`
    });

    if (error) {
      console.error('Error sending contact message:', error);
      return { success: false, error: 'Error sending contact message' };
    }

    return { success: true, message: 'Message sent successfully' };
  } catch (error) {
    console.error('Error sending contact message:', error);
    return { success: false, error: 'Error sending contact message' };
  }
});