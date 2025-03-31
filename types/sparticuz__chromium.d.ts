declare module '@sparticuz/chromium' {
  export const args: string[];
  export const defaultViewport: { width: number; height: number };
  export function executablePath(): Promise<string>;
} 