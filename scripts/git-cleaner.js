import { execSync } from 'child_process';

const sensitiveFiles = [
  'server/utils',
  'server/api/payment',
  'server/api/auth',
  'server/api/user',
  'server/api/analyze',
  'stores',
  'scripts',
  'pages/user-analytics.vue',
];

try {
  execSync('npm run save-config', { stdio: 'inherit' });
  
  const gitRmCommand = `git rm -r --cached ${sensitiveFiles.join(' ')}`;
  execSync(gitRmCommand, { stdio: 'inherit' });
  
  execSync('git commit -m "Remove sensitive files"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  
  execSync('npm run restore-config', { stdio: 'inherit' });
} catch (error) {
  try {
    execSync('npm run restore-config', { stdio: 'inherit' });
  } catch (restoreError) {
  }
  process.exit(1);
} 