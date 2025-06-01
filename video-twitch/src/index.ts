import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// Declare a global type for the Turso client to avoid multiple instances
declare global {
  var tursoClient: ReturnType<typeof createClient> | undefined;
}

// Create the Turso client, reusing it in development to prevent multiple connections
const client = globalThis.tursoClient || createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// In non-production environments, store the client in globalThis to reuse it
if (process.env.NODE_ENV !== 'production') globalThis.tursoClient = client;

// Export the drizzle instance with the Turso client
export const db = drizzle(client);