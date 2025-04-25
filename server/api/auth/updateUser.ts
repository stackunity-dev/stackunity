import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const { email, username, company, website, bio } = await readBody(event);
  const userId = event.context.user.id;

  if (!userId) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  try {
    const result = await pool.execute('UPDATE users SET email = ?, username = ?, company = ?, website = ?, bio = ? WHERE id = ?', [email, username, company, website, bio, userId]);

    return {
      success: true,
      message: 'User updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error updating user'
    };
  }
});