import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function downloadChromiumPack() {
  const version = '133';
  const url = `https://github.com/Sparticuz/chromium/releases/download/v${version}/chromium-v${version}-pack.tar`;
  const outputPath = path.join(__dirname, '../chromium-pack.tar');

  console.log('Téléchargement de Chromium depuis GitHub...');
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(outputPath));
    writer.on('error', reject);
  });
}

async function checkIfExists(client: S3Client, key: string) {
  try {
    await client.send(new GetObjectCommand({
      Bucket: 'devroid',
      Key: key
    }));
    return true;
  } catch (error) {
    return false;
  }
}

async function uploadChromium() {
  if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
    console.error('Les variables d\'environnement S3_ACCESS_KEY_ID et S3_SECRET_ACCESS_KEY sont requises');
    process.exit(1);
  }

  const client = new S3Client({
    region: 'lon1',
    endpoint: 'https://lon1.digitaloceanspaces.com',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    },
  });

  // Vérifie si le fichier existe déjà sur DigitalOcean
  const exists = await checkIfExists(client, 'chromium-pack.tar');
  if (exists) {
    console.log('Le fichier chromium-pack.tar existe déjà sur DigitalOcean Spaces');
    console.log('URL:', 'https://devroid.lon1.digitaloceanspaces.com/chromium-pack.tar');
    return;
  }

  let chromiumPath = path.join(__dirname, '../chromium-pack.tar');

  // Si le fichier n'existe pas localement, on le télécharge
  if (!fs.existsSync(chromiumPath)) {
    console.log('Le fichier chromium-pack.tar n\'existe pas localement, téléchargement...');
    chromiumPath = await downloadChromiumPack() as string;
  }

  console.log('Upload du fichier vers DigitalOcean Spaces...');
  const fileBuffer = fs.readFileSync(chromiumPath);

  const command = new PutObjectCommand({
    Bucket: 'devroid',
    Key: 'chromium-pack.tar',
    Body: fileBuffer,
    ACL: 'public-read',
    ContentType: 'application/x-tar'
  });

  try {
    const result = await client.send(command);
    console.log('Upload de Chromium réussi:', result);
    console.log('URL:', 'https://devroid.lon1.digitaloceanspaces.com/chromium-pack.tar');

    // Nettoyage du fichier local
    fs.unlinkSync(chromiumPath);
    console.log('Fichier local supprimé');
  } catch (error: any) {
    console.error('Erreur lors de l\'upload de Chromium:', error);
    process.exit(1);
  }
}

uploadChromium(); 