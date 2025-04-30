import { defineEventHandler, H3Event, readBody } from 'h3';
import { FeedbackEmailTemplates } from '../../utils/EmailTemplates';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export default defineEventHandler(async (event: H3Event) => {
  const { feedback } = await readBody(event);
  const { title, description, type, rating, email } = feedback;

  try {
    const sendEmail = await resend.emails.send({
      from: 'Stackunity <support@stackunity.tech>',
      to: 'support@stackunity.tech',
      subject: 'Feedback',
      html: FeedbackEmailTemplates.feedbackEmailTemplate(title, description, type, rating, email || 'N/A'),
    });

    return {
      success: true,
      message: 'Feedback submitted successfully',
      email: sendEmail,
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      success: false,
      message: 'Error submitting feedback',
    };
  }
});
