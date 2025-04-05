import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { IncomingForm } from 'formidable';
import { defineEventHandler } from 'h3';

export const config = {
  api: {
    bodyParser: false
  }
};

export default defineEventHandler(async (event) => {
  const client = new S3Client({
    region: 'lon1',
    endpoint: 'https://lon1.digitaloceanspaces.com',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
    },
  });

  const form = new IncomingForm();
  const { fields, files }: any = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err: any, fields: any, files: any) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const file = Array.isArray(files.file) ? files.file[0] : files.file;

  if (!file) {
    return { success: false, error: 'Aucun fichier envoyé.' };
  }

  const filePath = file.filepath;
  const fileName = `${Date.now()}-${file.originalFilename}`;
  const mimetype = file.mimetype;

  async function uploadFile(filePath: string, fileName: string, mimetype: any) {
    const fileBuffer = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: 'devroid',
      Key: fileName,
      Body: fileBuffer,
      ACL: 'public-read',
      ContentType: mimetype,
    });

    try {
      const result = await client.send(command);
      console.log('Upload réussi :', result);
      return `https://devroid.lon1.digitaloceanspaces.com/${fileName}`;
    } catch (error: any) {
      console.error('Erreur lors de l\'upload :', error);
      return { success: false, error: error.message };
    }
  }

  const uploadResult = await uploadFile(filePath, fileName, mimetype);

  if (typeof uploadResult === 'string') {
    return { success: true, url: uploadResult };
  } else {
    return uploadResult;
  }
});


