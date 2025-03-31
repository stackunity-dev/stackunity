import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { IncomingForm } from 'formidable';
import { d as defineEventHandler } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'mysql2/promise';

const config = {
  api: {
    bodyParser: false
  }
};
const upload = defineEventHandler(async (event) => {
  const client = new S3Client({
    region: "lon1",
    endpoint: "https://lon1.digitaloceanspaces.com",
    credentials: {
      accessKeyId: "DO00WJ394ATTR7FTRZCG",
      secretAccessKey: "G9jYkuDcfry2PMKHBLrUPCjTlLSHxf+p+axMK8Ri+X4"
    }
  });
  const form = new IncomingForm();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields2, files2) => {
      if (err) return reject(err);
      resolve({ fields: fields2, files: files2 });
    });
  });
  const file = Array.isArray(files.file) ? files.file[0] : files.file;
  if (!file) {
    return { success: false, error: "Aucun fichier envoy\xE9." };
  }
  const filePath = file.filepath;
  const fileName = `${Date.now()}-${file.originalFilename}`;
  const mimetype = file.mimetype;
  async function uploadFile(filePath2, fileName2, mimetype2) {
    const fileBuffer = fs.readFileSync(filePath2);
    const command = new PutObjectCommand({
      Bucket: "devroid",
      Key: fileName2,
      Body: fileBuffer,
      ACL: "public-read",
      ContentType: mimetype2
    });
    try {
      const result = await client.send(command);
      console.log("Upload r\xE9ussi :", result);
      return `https://devroid.lon1.digitaloceanspaces.com/${fileName2}`;
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      return { success: false, error: error.message };
    }
  }
  const uploadResult = await uploadFile(filePath, fileName, mimetype);
  if (typeof uploadResult === "string") {
    return { success: true, url: uploadResult };
  } else {
    return uploadResult;
  }
});

export { config, upload as default };
//# sourceMappingURL=upload.mjs.map
