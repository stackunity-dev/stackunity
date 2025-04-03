const { join } = require('path');
const puppeteer = require('puppeteer');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  experiments: {
    macArmChromiumEnabled: true
  },
  launchOptions: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process'
    ]
  },
  executablePath: process.env.NODE_ENV === 'production'
    ? '/tmp/chromium'
    : puppeteer.executablePath()
}; 