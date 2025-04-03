import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadChromiumPack() {
  const version = '121.0.0';
  const files = [
    {
      url: `https://github.com/Sparticuz/chromium/releases/download/v${version}/chromium-v${version}-pack.tar`,
      outputPath: path.join(__dirname, '../chromium-pack.tar')
    },
    {
      url: `https://github.com/Sparticuz/chromium/releases/download/v${version}/swiftshader.tar`,
      outputPath: path.join(__dirname, '../swiftshader.tar')
    }
  ];

  for (const file of files) {
    console.log(`Téléchargement depuis ${file.url}...`);
    
    try {
      const response = await axios({
        url: file.url,
        method: 'GET',
        responseType: 'stream',
        maxRedirects: 5,
        validateStatus: (status) => status === 200
      });

      if (response.status !== 200) {
        throw new Error(`Erreur lors du téléchargement. Status: ${response.status}`);
      }

      const writer = fs.createWriteStream(file.outputPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(true));
        writer.on('error', reject);
      });

      console.log(`Téléchargement terminé pour ${path.basename(file.outputPath)}`);
    } catch (error) {
      console.error(`Erreur lors du téléchargement de ${file.url}:`, error.message);
      throw error;
    }
  }

  return path.join(__dirname, '../chromium-pack.tar');
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
  let swiftshaderPath = path.join(__dirname, '../swiftshader.tar');
  
  // Si les fichiers n'existent pas localement, on les télécharge
  if (!fs.existsSync(chromiumPath) || !fs.existsSync(swiftshaderPath)) {
    console.log('Téléchargement des fichiers nécessaires...');
    chromiumPath = await downloadChromiumPack();
  }

  // Upload des fichiers vers DigitalOcean Spaces
  const files = [
    {
      path: chromiumPath,
      key: 'chromium-pack.tar',
      contentType: 'application/x-tar'
    },
    {
      path: swiftshaderPath,
      key: 'swiftshader.tar',
      contentType: 'application/x-tar'
    }
  ];

  for (const file of files) {
    console.log(`Upload de ${file.key} vers DigitalOcean Spaces...`);
    const fileBuffer = fs.readFileSync(file.path);

    const command = new PutObjectCommand({
      Bucket: 'devroid',
      Key: file.key,
      Body: fileBuffer,
      ACL: 'public-read',
      ContentType: file.contentType
    });

    try {
      const result = await client.send(command);
      console.log(`Upload de ${file.key} réussi:`, result);
      console.log('URL:', `https://devroid.lon1.digitaloceanspaces.com/${file.key}`);

      // Nettoyage du fichier local
      fs.unlinkSync(file.path);
      console.log(`Fichier local ${file.key} supprimé`);
    } catch (error) {
      console.error(`Erreur lors de l'upload de ${file.key}:`, error);
      process.exit(1);
    }
  }
}

uploadChromium(); 