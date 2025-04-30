import { defineEventHandler, readBody } from 'h3';
import { Resend } from 'resend';
import { ErrorEmailTemplates } from '../../utils/EmailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export default defineEventHandler(async (event) => {
  try {
    const { errorMessage, errorStack, userEmail, userInfo, url, additionalInfo } = await readBody(event);

    if (!errorMessage) {
      return { success: false, error: 'Error message is required' };
    }

    const currentDate = new Date().toLocaleString();
    const userAgent = typeof event.node.req.headers['user-agent'] === 'string'
      ? event.node.req.headers['user-agent']
      : 'Not available';

    const userIp = event.node.req.headers['x-forwarded-for'] || event.node.req.socket.remoteAddress || 'Not available';

    const sendEmail = await resend.emails.send({
      from: 'StackUnity <support@stackunity.tech>',
      to: 'support@stackunity.tech',
      subject: 'Error Report',
      html: ErrorEmailTemplates.errorEmailTemplate(errorMessage, errorStack, userEmail, userInfo, url, additionalInfo, currentDate, userAgent, userIp as string),
    });

    return { success: true, message: 'Error report sent successfully', email: sendEmail };
  } catch (error) {
    console.error('Error processing feedback:', error);
    return { success: false, error: 'Error processing feedback' };
  }
}); 