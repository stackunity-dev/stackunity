import { pool } from "../db";
import { readBody, defineEventHandler } from "h3";
import { EmailService } from "../../utils/EmailService";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  try {
    const [result] = await pool.execute('INSERT INTO newsletters_subscribers (email) VALUES (?)', [email]);

    await pool.execute('UPDATE newsletters SET subscribers = subscribers + 1');

    await EmailService.sendWelcomeNewsletterEmail(email);

    return result;
  } catch (error) {
    console.error('Erreur lors de l\'inscription à la newsletter:', error);
    return { error: 'Erreur lors de l\'inscription à la newsletter' };
  }
});
