import { c as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'node:path';

const updateUser = defineEventHandler(async (event) => {
  const { email, username, company, website, bio } = await readBody(event);
  const userId = event.context.user.id;
  if (!userId) {
    return {
      success: false,
      message: "User not found"
    };
  }
  try {
    const result = await pool.execute("UPDATE users SET email = ?, username = ?, company = ?, website = ?, bio = ? WHERE id = ?", [email, username, company, website, bio, userId]);
    return {
      success: true,
      message: "User updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: "Error updating user"
    };
  }
});

export { updateUser as default };
//# sourceMappingURL=updateUser.mjs.map
