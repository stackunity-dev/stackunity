import { defineEventHandler, H3Event, readBody } from 'h3';
import { Resend } from 'resend';
import { FeedbackEmailTemplates } from '../../utils/EmailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const { title, description, type, rating, email } = body;

  if (!title || !description || !type) {
    return {
      success: false,
      error: 'Missing required fields',
      message: 'Title, description and type are required'
    };
  }

  try {
    const sendEmail = await resend.emails.send({
      from: 'Stackunity <support@stackunity.tech>',
      to: 'support@stackunity.tech',
      subject: `Feedback: ${type} - ${title}`,
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
      error: 'Error submitting feedback',
      message: 'Failed to send feedback email'
    };
  }
});
