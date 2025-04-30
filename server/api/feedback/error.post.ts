import { defineEventHandler, readBody } from 'h3';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string || 're_1234567890');

export default defineEventHandler(async (event) => {
  try {
    const { errorMessage, errorStack, userEmail, userInfo, url, additionalInfo } = await readBody(event);

    if (!errorMessage) {
      return { success: false, error: 'Error message is required' };
    }

    const currentDate = new Date().toLocaleString();
    const userAgent = event.node.req.headers['user-agent'] || 'Not available';
    const userIp = event.node.req.headers['x-forwarded-for'] || event.node.req.socket.remoteAddress || 'Not available';

    const htmlContent = `
      <h2>Error Report from StackUnity</h2>
      <p><strong>Date:</strong> ${currentDate}</p>
      <p><strong>Error:</strong> ${errorMessage}</p>
      ${errorStack ? `<p><strong>Stack Trace:</strong><br><pre>${errorStack}</pre></p>` : ''}
      <p><strong>URL:</strong> ${url || 'Not provided'}</p>
      <p><strong>Browser:</strong> ${userAgent}</p>
      <p><strong>IP:</strong> ${userIp}</p>
      ${userEmail ? `<p><strong>User Email:</strong> ${userEmail}</p>` : ''}
      ${userInfo ? `<p><strong>User Info:</strong> ${userInfo}</p>` : ''}
      ${additionalInfo ? `<p><strong>Additional Info:</strong> ${additionalInfo}</p>` : ''}
    `;

    const { data, error } = await resend.emails.send({
      from: 'StackUnity Error Reporting <errors@stackunity.tech>',
      to: 'support@stackunity.tech',
      subject: `Error Report: ${errorMessage.substring(0, 50)}${errorMessage.length > 50 ? '...' : ''}`,
      html: htmlContent
    });

    if (error) {
      console.error('Error sending feedback:', error);
      return { success: false, error: 'Failed to send error report' };
    }

    if (userEmail) {
      try {
        await resend.emails.send({
          from: 'StackUnity Support <support@stackunity.tech>',
          to: userEmail,
          subject: 'We received your error report',
          html: `
            <h2>Thank you for your error report</h2>
            <p>We have received your error report and our team will investigate the issue.</p>
            <p>The error occurred at: ${url || 'Not specified'}</p>
            <p>Error: ${errorMessage.substring(0, 100)}${errorMessage.length > 100 ? '...' : ''}</p>
            <p>Thank you for helping us improve StackUnity!</p>
          `
        });
      } catch (confirmError) {
        console.error('Error sending confirmation email:', confirmError);
      }
    }

    return { success: true, message: 'Error report sent successfully' };
  } catch (error) {
    console.error('Error processing feedback:', error);
    return { success: false, error: 'Error processing feedback' };
  }
}); 