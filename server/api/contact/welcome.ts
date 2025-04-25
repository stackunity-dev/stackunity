import { readBody, defineEventHandler } from 'h3';
import { createError } from 'nuxt/app';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, name } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Stackunity <hello@stackunity.tech>',
      to: email,
      subject: 'Welcome to Stackunity',
      text: `Welcome to Stackunity, ${name}! We are glad to have you on board.
      free trial is available for 7 days, during this time you can use all our features.`,
    });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send welcome email',
        data: error
      });
    }

    return {
      success: true,
      message: 'Welcome email sent successfully'
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send welcome email',
      data: error
    });
  }
});
