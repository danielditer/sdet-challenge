import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
    },

    env: {
        apiEnvironment: process.env.API_ENV || 'dev',
    },
});