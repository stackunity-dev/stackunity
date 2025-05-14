const ENCRYPTION_KEY = 'stackunity-secret-key-123';

export function encryptData(data: string): string {
  if (!data) return '';

  try {
    const encodedData = btoa(
      encodeURIComponent(data)
        .replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))
    );

    return `encrypted:${encodedData}:${Date.now()}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export function decryptData(encryptedData: string): string {
  if (!encryptedData || !encryptedData.startsWith('encrypted:')) return '';

  try {
    const parts = encryptedData.split(':');
    if (parts.length < 2) return '';

    const encodedData = parts[1];

    return decodeURIComponent(
      Array.from(atob(encodedData), c => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

export function maskText(text: string, visibleStart = 2, visibleEnd = 2): string {
  if (!text) return '';
  if (text.length <= visibleStart + visibleEnd) return '*'.repeat(text.length);

  const start = text.substring(0, visibleStart);
  const end = text.substring(text.length - visibleEnd);
  const masked = '*'.repeat(Math.min(text.length - visibleStart - visibleEnd, 5));

  return `${start}${masked}${end}`;
} 