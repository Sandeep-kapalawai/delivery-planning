export const MODE: string = process.env.NODE_ENV || '';
export const PORT: string = process.env.PORT || '';
export const BASE_URL: string = process.env.BASE_URL || '';
export const CONTEXT_PATH: string = process.env.CONTEXT_PATH || '';
export const API_PATH: string = process.env.API_PATH || '';
export const APP_KEY: string = process.env.APP_KEY || '';
export const USER_PERM_API_PATH: string = process.env.USER_PERM_API_PATH || '';
export const USER_PERM_APP_KEY: string = process.env.USER_PERM_APP_KEY || '';
export const MSAL_CLIENT_ID: string = process.env.MSAL_CLIENT_ID || '';
export const MSAL_TENANT_ID: string = process.env.MSAL_TENANT_ID || '';
export const APP_PREFIX_PATH: string = process.env.APP_PREFIX_PATH || '';
export const MOP_APP_NAME = process.env.MOP_APP_NAME || '';
export const MOP_API_KEY = process.env.MOP_API_KEY || '';

export default Object.freeze({
    MODE,
    PORT,
    BASE_URL,
    CONTEXT_PATH,
    API_PATH,
    APP_KEY,
    USER_PERM_API_PATH,
    USER_PERM_APP_KEY,
    MSAL_CLIENT_ID,
    MSAL_TENANT_ID,
    APP_PREFIX_PATH,
    MOP_APP_NAME,
    MOP_API_KEY,
});
