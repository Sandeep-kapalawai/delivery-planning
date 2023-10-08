import { RumInit } from '@maersk-global/telemetry-web-sdk';
import { PORT, MOP_API_KEY, MOP_APP_NAME } from '@/static/environment';

export const initializePensieveRUM = () => {
    RumInit({
        app: {
            name: MOP_APP_NAME,
        },
        apiKey: MOP_API_KEY,
        performanceInstrument: {
            ignoreEvents: ['msal.*'],
        },
        isolate: true, // THIS IS IMPORTANT for multiple instances on page to run properly
        ignoreUrls: [`http://localhost:${PORT}/`, 'http://localhost:8090/'],
        instrumentations: {
            documentload: true,
            fetch: true,
            xhr: true,
            webvitals: true,
            errors: true,
        },
    });
};
