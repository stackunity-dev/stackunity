import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadChromiumPack() {
  const version = '121.0.0';
  const url = `https://github.com/Sparticuz/chromium/releases/download/v${version}/chromium-v${version}-pack.tar`;
  const outputPath = path.join(__dirname, '../chromium-pack.tar');

  console.log('Téléchargement de Chromium depuis GitHub...');
  console.log('URL:', url);
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      maxRedirects: 5,
      validateStatus: (status) => status === 200
    });

    if (response.status !== 200) {
      throw new Error(`Erreur lors du téléchargement. Status: ${response.status}`);
    }

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('Téléchargement terminé');
        resolve(outputPath);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error.message);
    throw error;
  }
}

async function uploadChromium() {
  const client = new S3Client({
    region: 'lon1',
    endpoint: 'https://lon1.digitaloceanspaces.com',
    credentials: {
      accessKeyId: 'DO00WJ394ATTR7FTRZCG',
      secretAccessKey: 'G9jYkuDcfry2PMKHBLrUPCjTlLSHxf+p+axMK8Ri+X4'
    },
  });

  let chromiumPath = path.join(__dirname, '../chromium-pack.tar');
  
  // Si le fichier n'existe pas localement, on le télécharge
  if (!fs.existsSync(chromiumPath)) {
    console.log('Le fichier chromium-pack.tar n\'existe pas localement, téléchargement...');
    chromiumPath = await downloadChromiumPack();
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
  } catch (error) {
    console.error('Erreur lors de l\'upload de Chromium:', error);
    process.exit(1);
  }
}

uploadChromium(); 