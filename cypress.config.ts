import { defineConfig } from 'cypress';

export default defineConfig({
    reporter: 'cypress-mochawesome-reporter',

    reporterOptions: {
        reportDir: 'cypress/reports',
        charts: true,
        reportPageTitle: 'LoanPro E2E Test Report',
        embeddedScreenshots: true,
        inlineAssets: true
    },

    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            require('cypress-mochawesome-reporter/plugin')(on);

            return config;
        }
    },

    env: {
        apiEnvironment: process.env.API_ENV || 'dev',
    },
});