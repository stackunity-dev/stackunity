import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENCRYPTION_KEY = 'stackunity-secure-local-encryption-key';

function encryptFile(content) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (err) {
    console.error('Erreur lors du chiffrement du fichier:', err);
    return content;
  }
}

function decryptFile(encryptedContent) {
  try {
    if (!encryptedContent.includes(':')) {
      return encryptedContent;
    }

    const textParts = encryptedContent.split(':');
    
    if (textParts.length !== 2) {
      return encryptedContent;
    }
    
    try {
      const iv = Buffer.from(textParts[0], 'hex');
      const encryptedData = textParts[1];
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (cryptoErr) {
      console.error('Erreur de déchiffrement cryptographique:', cryptoErr.message);
      return encryptedContent;
    }
  } catch (err) {
    console.error('Erreur lors du déchiffrement du fichier:', err);
    return encryptedContent;
  }
}

const filesToPreserve = [
  {
    path: 'server/api/db.ts',
    sanitize: (content) => {
      return `import * as mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "default_db"
});
`;
    }
  },
  {
    path: 'server/utils/auth-config.ts',
    sanitize: (content) => {
      const sanitizedContent = content
        .replace(/ACCESS_TOKEN_SECRET\s*=\s*process\.env\.ACCESS_TOKEN_SECRET\s*\|\|\s*['"].*?['"]/g, 
                'ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret"')
        .replace(/REFRESH_TOKEN_SECRET\s*=\s*process\.env\.REFRESH_TOKEN_SECRET\s*\|\|\s*['"].*?['"]/g, 
                'REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "secret"');
      return sanitizedContent;
    }
  },
  {
    path: 'server/utils/EmailService.ts',
    sanitize: (content) => {
      const sanitizedContent = content
        .replace(/resend\s*=\s*new\s*Resend\(process\.env\.RESEND_API_KEY\s*as\s*string\s*\|\|\s*['"].*?['"]\)/g, 
                'resend = new Resend(process.env.RESEND_API_KEY as string || "your_api_key_here")');
      return sanitizedContent;
    }
  },
  {
    path: 'server/api/payment-webhook/index.ts',
    sanitize: (content) => {
      const sanitizedContent = content
        .replace(/stripe\s*=\s*new\s*Stripe\(process\.env\.STRIPE_SECRET_KEY\s*as\s*string\s*\|\|\s*['"].*?['"]/g, 
                'stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string || "sk_test_example")');
      return sanitizedContent;
    }
  }
];

const backupDir = path.join(__dirname, '../.config-backup');

const action = process.argv[2] || 'save';

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

function saveConfigs() {
  console.log('Sauvegarde des fichiers de configuration...');
  
  filesToPreserve.forEach(file => {
    const fullPath = path.join(__dirname, '..', file.path);
    const backupPath = path.join(backupDir, path.basename(file.path) + '.enc');
    
    try {
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        if (!content || content.trim() === '') {
          console.log(`⚠️ Le fichier ${file.path} est vide, ignoré`);
          return;
        }
        
        const encryptedContent = encryptFile(content);
        
        if (encryptedContent && encryptedContent.includes(':')) {
          fs.writeFileSync(backupPath, encryptedContent);
          console.log(`✅ Sauvegarde chiffrée de ${file.path} réussie`);
          
          if (file.sanitize && typeof file.sanitize === 'function') {
            const sanitizedContent = file.sanitize(content);
            fs.writeFileSync(fullPath, sanitizedContent);
            console.log(`✅ Version sanitisée créée pour ${file.path}`);
          }
        } else {
          console.error(`❌ Échec du chiffrement pour ${file.path}, sauvegarde non effectuée`);
        }
      } else {
        console.log(`⚠️ Le fichier ${file.path} n'existe pas`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la sauvegarde de ${file.path}:`, error.message);
    }
  });
}

function restoreConfigs() {
  console.log('Restauration des fichiers de configuration...');
  
  filesToPreserve.forEach(file => {
    const fullPath = path.join(__dirname, '..', file.path);
    const backupPath = path.join(backupDir, path.basename(file.path) + '.enc');
    const legacyBackupPath = path.join(backupDir, path.basename(file.path)); // Pour compatibilité avec les anciennes sauvegardes
    
    try {
      // Essayer d'abord le nouveau chemin avec .enc
      if (fs.existsSync(backupPath)) {
        // Lire le contenu chiffré
        const encryptedContent = fs.readFileSync(backupPath, 'utf8');
        
        if (!encryptedContent || encryptedContent.trim() === '') {
          console.log(`⚠️ Le fichier de sauvegarde chiffré ${backupPath} est vide, ignoré`);
          return;
        }
        
        // Déchiffrer le contenu
        const originalContent = decryptFile(encryptedContent);
        
        if (!originalContent || originalContent.trim() === '') {
          console.log(`⚠️ Le contenu déchiffré de ${file.path} est vide, restauration annulée`);
          return;
        }
        
        // S'assurer que le répertoire du fichier de destination existe
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, originalContent);
        console.log(`✅ Restauration de ${file.path} réussie`);
      } 
      // Essayer l'ancien chemin sans .enc pour compatibilité
      else if (fs.existsSync(legacyBackupPath)) {
        const legacyContent = fs.readFileSync(legacyBackupPath, 'utf8');
        
        // S'assurer que le répertoire du fichier de destination existe
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, legacyContent);
        console.log(`✅ Restauration de ${file.path} réussie (à partir de l'ancien format)`);
      }
      else {
        console.log(`⚠️ Sauvegarde chiffrée de ${file.path} non trouvée`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la restauration de ${file.path}:`, error.message);
    }
  });
}

if (action === 'save') {
  saveConfigs();
} else if (action === 'restore') {
  restoreConfigs();
} else {
  console.error('Action non reconnue. Utilisez "save" ou "restore"');
} 