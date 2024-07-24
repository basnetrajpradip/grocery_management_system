declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_URL: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
      NEXT_PUBLIC_API_URL: string;
      ENCRYPTION_ALGORITHM: string;
      ENCRYPTION_KEY: string;
      INIT_VECTOR: string;
    }
  }
}

export {};
