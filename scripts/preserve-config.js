import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir l'équivalent de __dirname pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fichiers à préserver
const filesToPreserve = [
  {
    path: 'server/api/db.ts',
    sanitize: (content) => {
      // Remplacer les informations sensibles par des placeholders
      return content
        .replace(/(host:\s*['"]).*?(['"])/g, '$1process.env.DB_HOST || "localhost"$2')
        .replace(/(port:\s*)parseInt\(process\.env\.DB_PORT\s*\|\|\s*['"].*?['"]\)/g, '$1parseInt(process.env.DB_PORT || "3306")')
        .replace(/(user:\s*['"]).*?(['"])/g, '$1process.env.DB_USER || "root"$2')
        .replace(/(password:\s*['"]).*?(['"])/g, '$1process.env.DB_PASSWORD || ""$2')
        .replace(/(database:\s*)process\.env\.DB_NAME\s*\|\|\s*['"].*?['"]/g, '$1process.env.DB_NAME || "default_db"');
    }
  },
  {
    path: 'server/utils/auth-config.ts',
    sanitize: (content) => {
      // Remplacer les clés d'authentification par des placeholders
      return content
        .replace(/(ACCESS_TOKEN_SECRET\s*=\s*process\.env\.ACCESS_TOKEN_SECRET\s*\|\|\s*['"]).*?(['"])/g, 
                '$1process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret"$2')
        .replace(/(REFRESH_TOKEN_SECRET\s*=\s*process\.env\.REFRESH_TOKEN_SECRET\s*\|\|\s*['"]).*?(['"])/g, 
                '$1process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret"$2');
    }
  },
  {
    path: 'server/utils/EmailService.ts',
    sanitize: (content) => {
      // Remplacer la clé RESEND par un placeholder
      return content
        .replace(/(resend\s*=\s*new\s*Resend\(process\.env\.RESEND_API_KEY\s*as\s*string\s*\|\|\s*['"]).*?(['"])/g, 
                '$1process.env.RESEND_API_KEY || "your_resend_api_key"$2');
    }
  },
  {
    path: 'server/api/payment-webhook/index.ts',
    sanitize: (content) => {
      // Remplacer la clé STRIPE par un placeholder
      return content
        .replace(/(stripe\s*=\s*new\s*Stripe\(process\.env\.STRIPE_SECRET_KEY\s*as\s*string\s*\|\|\s*['"]).*?(['"])/g, 
                '$1process.env.STRIPE_SECRET_KEY || "your_stripe_secret_key"$2');
    }
  }
  // Ajoutez d'autres fichiers de configuration à préserver ici
];

// Fonction pour extraire les variables d'environnement
function extractEnvVarsFromFiles(filePath, content) {
  const envVars = {};
  
  switch(filePath) {
    case 'server/api/db.ts':
      // Extraire l'hôte
      const hostMatch = content.match(/host:\s*['"](.+?)['"]/);
      if (hostMatch && hostMatch[1]) {
        envVars.DB_HOST = hostMatch[1];
      }
      
      // Extraire le port
      const portMatch = content.match(/port:\s*parseInt\(process\.env\.DB_PORT\s*\|\|\s*['"](.+?)['"]\)/);
      if (portMatch && portMatch[1]) {
        envVars.DB_PORT = portMatch[1];
      }
      
      // Extraire l'utilisateur
      const userMatch = content.match(/user:\s*['"](.+?)['"]/);
      if (userMatch && userMatch[1]) {
        envVars.DB_USER = userMatch[1];
      }
      
      // Extraire le mot de passe
      const passwordMatch = content.match(/password:\s*['"](.+?)['"]/);
      if (passwordMatch && passwordMatch[1]) {
        envVars.DB_PASSWORD = passwordMatch[1];
      }
      
      // Extraire le nom de la base de données
      const dbNameMatch = content.match(/database:\s*process\.env\.DB_NAME\s*\|\|\s*['"](.+?)['"]/);
      if (dbNameMatch && dbNameMatch[1]) {
        envVars.DB_NAME = dbNameMatch[1];
      }
      break;
      
    case 'server/utils/auth-config.ts':
      // Extraire les secrets d'authentification
      const accessTokenMatch = content.match(/ACCESS_TOKEN_SECRET\s*=\s*process\.env\.ACCESS_TOKEN_SECRET\s*\|\|\s*['"](.+?)['"]/);
      if (accessTokenMatch && accessTokenMatch[1] && accessTokenMatch[1] !== 'secret') {
        envVars.ACCESS_TOKEN_SECRET = accessTokenMatch[1];
      }
      
      const refreshTokenMatch = content.match(/REFRESH_TOKEN_SECRET\s*=\s*process\.env\.REFRESH_TOKEN_SECRET\s*\|\|\s*['"](.+?)['"]/);
      if (refreshTokenMatch && refreshTokenMatch[1] && refreshTokenMatch[1] !== 'secret') {
        envVars.REFRESH_TOKEN_SECRET = refreshTokenMatch[1];
      }
      break;
      
    case 'server/utils/EmailService.ts':
      // Extraire la clé de l'API Resend
      const resendKeyMatch = content.match(/resend\s*=\s*new\s*Resend\(process\.env\.RESEND_API_KEY\s*as\s*string\s*\|\|\s*['"](.+?)['"]/);
      if (resendKeyMatch && resendKeyMatch[1] && !resendKeyMatch[1].startsWith('re_2222')) {
        envVars.RESEND_API_KEY = resendKeyMatch[1];
      }
      break;
      
    case 'server/api/payment-webhook/index.ts':
      // Extraire la clé secrète Stripe
      const stripeKeyMatch = content.match(/stripe\s*=\s*new\s*Stripe\(process\.env\.STRIPE_SECRET_KEY\s*as\s*string\s*\|\|\s*['"](.+?)['"]/);
      if (stripeKeyMatch && stripeKeyMatch[1] && !stripeKeyMatch[1].startsWith('sk_test_510000')) {
        envVars.STRIPE_SECRET_KEY = stripeKeyMatch[1];
      }
      
      // Webhook secret est déjà dans les variables d'environnement, pas besoin de l'extraire
      break;
  }
  
  return envVars;
}

// Dossier pour stocker les sauvegardes
const backupDir = path.join(__dirname, '../.config-backup');

// Action à effectuer (save ou restore)
const action = process.argv[2] || 'save';

// Crée le dossier de sauvegarde s'il n'existe pas
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Fichier pour stocker les variables d'environnement
const envFilePath = path.join(backupDir, '.env.local');

// Fonction pour sauvegarder le fichier .env
function saveEnvFile(envVars) {
  let envContent = '';
  
  Object.entries(envVars).forEach(([key, value]) => {
    envContent += `${key}=${value}\n`;
  });
  
  fs.writeFileSync(envFilePath, envContent);
  console.log(`✅ Variables d'environnement sauvegardées dans ${envFilePath}`);
}

// Fonction pour charger le fichier .env
function loadEnvFile() {
  if (!fs.existsSync(envFilePath)) {
    return {};
  }
  
  const content = fs.readFileSync(envFilePath, 'utf8');
  const envVars = {};
  
  content.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  return envVars;
}

// Fonction pour sauvegarder les fichiers
function saveConfigs() {
  console.log('Sauvegarde des fichiers de configuration...');
  
  let allEnvVars = {};
  
  filesToPreserve.forEach(file => {
    const fullPath = path.join(__dirname, '..', file.path);
    const backupPath = path.join(backupDir, path.basename(file.path));
    
    try {
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Sauvegarder la version originale
        fs.writeFileSync(backupPath, content);
        console.log(`✅ Sauvegarde de ${file.path} réussie`);
        
        // Extraire les variables d'environnement
        const fileEnvVars = extractEnvVarsFromFiles(file.path, content);
        allEnvVars = { ...allEnvVars, ...fileEnvVars };
        
        // Si une fonction de sanitization est définie, appliquer
        // la version sanitisée au fichier source
        if (file.sanitize && typeof file.sanitize === 'function') {
          const sanitizedContent = file.sanitize(content);
          fs.writeFileSync(fullPath, sanitizedContent);
          console.log(`✅ Version sanitisée créée pour ${file.path}`);
        }
      } else {
        console.log(`⚠️ Le fichier ${file.path} n'existe pas`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la sauvegarde de ${file.path}:`, error.message);
    }
  });
  
  // Sauvegarder les variables d'environnement
  if (Object.keys(allEnvVars).length > 0) {
    saveEnvFile(allEnvVars);
  }
}

// Fonction pour restaurer les fichiers
function restoreConfigs() {
  console.log('Restauration des fichiers de configuration...');
  
  filesToPreserve.forEach(file => {
    const fullPath = path.join(__dirname, '..', file.path);
    const backupPath = path.join(backupDir, path.basename(file.path));
    
    try {
      if (fs.existsSync(backupPath)) {
        const content = fs.readFileSync(backupPath, 'utf8');
        
        // S'assurer que le répertoire du fichier de destination existe
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Restauration de ${file.path} réussie`);
      } else {
        console.log(`⚠️ Sauvegarde de ${file.path} non trouvée`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la restauration de ${file.path}:`, error.message);
    }
  });
}

// Exécuter l'action appropriée
if (action === 'save') {
  saveConfigs();
} else if (action === 'restore') {
  restoreConfigs();
} else {
  console.error('Action non reconnue. Utilisez "save" ou "restore"');
} 