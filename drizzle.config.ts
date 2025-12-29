import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';


// https://orm.drizzle.team/docs/drizzle-kit/configuration
export default defineConfig({

    schema: './configs/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!, 
    },
});
