declare module 'js-cookie' {
  interface CookieAttributes {
    path?: string;
    domain?: string;
    expires?: number | Date;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }

  function get(name: string): string | undefined;
  function set(name: string, value: string, options?: CookieAttributes): string;
  function remove(name: string, options?: CookieAttributes): void;

  export { get, remove, set };
} 