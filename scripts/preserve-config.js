import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEncryptionKey() {
  try {
    return crypto.createHash('sha256').update('stackunity-secure-local-encryption-key').digest();
  } catch (err) {
    return Buffer.from('stackunity-secure-local-encryption-k');
  }
}

function encryptFile(content) {
  try {
    const iv = crypto.randomBytes(16);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (err) {
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
      const key = getEncryptionKey();
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (cryptoErr) {
      return encryptedContent;
    }
  } catch (err) {
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
      return content
        .replace(/const\s+stripe\s*=\s*new\s*Stripe\(.*?\)(\s*),\s*\{/g, 
                'const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string || "sk_test_example"$1, {');
    }
  }
];

const backupDir = path.join(__dirname, '../.config-backup');
const action = process.argv[2] || 'save';

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

function saveConfigs() {
  filesToPreserve.forEach(file => {
    const fullPath = path.join(__dirname, '..', file.path);
    const backupPath = path.join(backupDir, path.basename(file.path) + '.enc');
    
    try {
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        if (!content || content.trim() === '') {
          return;
        }
        
        const encryptedContent = encryptFile(content);
        
        if (encryptedContent && encryptedContent.includes(':')) {
          fs.writeFileSync(backupPath, encryptedContent);
          
          if (file.sanitize && typeof file.sanitize === 'function') {
            const sanitizedContent = file.sanitize(content);
            fs.writeFileSync(fullPath, sanitizedContent);
          }
        }
      }
    } catch (error) {
      // Silently handle error
    }
  });
}

function restoreConfigs() {
  filesToPreserve.forEach(file => {
    const fullPath = path.join(__dirname, '..', file.path);
    const backupPath = path.join(backupDir, path.basename(file.path) + '.enc');
    const legacyBackupPath = path.join(backupDir, path.basename(file.path));
    
    try {
      if (fs.existsSync(backupPath)) {
        const encryptedContent = fs.readFileSync(backupPath, 'utf8');
        
        if (!encryptedContent || encryptedContent.trim() === '') {
          return;
        }
        
        const originalContent = decryptFile(encryptedContent);
        
        if (!originalContent || originalContent.trim() === '') {
          return;
        }
        
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, originalContent);
      } 
      else if (fs.existsSync(legacyBackupPath)) {
        const legacyContent = fs.readFileSync(legacyBackupPath, 'utf8');
        
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, legacyContent);
      }
    } catch (error) {
      // Silently handle error
    }
  });
}

if (action === 'save') {
  saveConfigs();
} else if (action === 'restore') {
  restoreConfigs();
} 