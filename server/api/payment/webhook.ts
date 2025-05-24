import { defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2/promise';
import { getUserId } from '../../utils/auth-utils';
import { pool } from '../db';
import generateInvoice from './generate-invoice';

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    event.node.res.statusCode = 401;
    return { success: false, error: 'Unauthorized' };
  }

  const body = await readBody(event);
  const { type, paymentId } = body;

  if (!type || !paymentId || type !== 'generate_invoice') {
    event.node.res.statusCode = 400;
    return { success: false, error: 'Invalid request' };
  }

  // On récupère juste les colonnes existantes dans la table payments
  const [paymentRows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, customer_name, customer_email, amount, currency, status, plan_name 
     FROM payments WHERE id = ?`,
    [paymentId]
  );
  if (paymentRows.length === 0) {
    event.node.res.statusCode = 404;
    return { success: false, error: 'Payment not found' };
  }
  const payment = paymentRows[0];

  const [userRows] = await pool.execute<RowDataPacket[]>(
    'SELECT username, email FROM users WHERE id = ?',
    [userId]
  );
  const username = userRows.length > 0 ? userRows[0].username : 'StackUnity client';
  const userEmail = userRows.length > 0 ? userRows[0].email : '';

  const invoiceData = {
    paymentId: payment.id,
    customerName: payment.customer_name || username,
    customerEmail: payment.customer_email || userEmail,
    // on enlève les données non stockées
    baseAmount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    selectedPlan: payment.plan_name,
    date: new Date().toISOString(),
  };

  if (!invoiceData.customerEmail || !invoiceData.customerName) {
    return { success: false, error: 'Customer data incomplete' };
  }

  event.context.body = invoiceData;
  const result = await generateInvoice(event);

  return result;
});
