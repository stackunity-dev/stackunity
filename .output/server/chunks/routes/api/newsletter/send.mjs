import { c as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
import { Resend } from 'resend';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';

const send = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const body = await readBody(event);
    console.log("Donn\xE9es re\xE7ues:", body);
    if (!body.subject || !body.html || !body.text) {
      console.error("Donn\xE9es manquantes:", body);
      return {
        success: false,
        message: "Donn\xE9es manquantes pour l'envoi de l'email"
      };
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: "noreply@portfolionurdjedd.com",
      to: "djedidinur@gmail.com",
      subject: body.subject,
      html: body.html,
      text: body.text
    });
    const emailData = {
      body: {
        subject: body.subject,
        html: body.html,
        text: body.text
      }
    };
    await pool.execute("INSERT INTO newsletters_emails (subject, content) VALUES (?, ?)", [emailData.body.subject, emailData.body.html]);
    await pool.execute("UPDATE newsletters SET emails_sent = emails_sent + 1");
    return {
      success: true,
      message: "Email envoy\xE9 avec succ\xE8s",
      data: result
    };
  } catch (error) {
    console.error("Erreur d\xE9taill\xE9e:", {
      message: error.message,
      stack: error.stack,
      response: (_a = error.response) == null ? void 0 : _a.data
    });
    return {
      success: false,
      message: "Erreur lors de l'envoi de l'email",
      error: error.message,
      details: (_b = error.response) == null ? void 0 : _b.data
    };
  }
});

export { send as default };
//# sourceMappingURL=send.mjs.map
