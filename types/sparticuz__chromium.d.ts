declare module '@sparticuz/chromium' {
  const chromium: {
    args: string[];
    defaultViewport: { width: number; height: number };
    executablePath: () => Promise<string>;
    headless: boolean;
  };
  export default chromium;
} 