export const NAMESPACE = 'tableConfiguration';

export enum TableConfigurationActionEnum {
    INITIALIZE = 'INITIALIZE',
    FETCH_USER_PREFERENCES = 'FETCH_USER_PREFERENCES',
    SAVE_USER_PREFERENCES = 'SAVE_USER_PREFERENCES',
    SET_COLUMN_DEFS = 'SET_COLUMN_DEFS',
    REARRANGE_COLUMN_DEFS = 'REARRANGE_COLUMN_DEFS',
    SET_THEME = 'SET_THEME',
    RESET_COLUMN_DEFS = 'RESET_COLUMN_DEFS',
}

export enum TableConfigurationMutationEnum {
    SET_INITIALIZED = 'SET_INITIALIZED',
    SET_SAVE_USER_PREFERENCES_ENABLED = 'SET_SAVE_USER_PREFERENCES_ENABLED',
    SET_TABLE_ID = 'SET_TABLE_ID',
    SET_DEFAULT_COLUMN_DEF = 'SET_DEFAULT_COLUMN_DEF',
    SET_ORIGINAL_COLUMN_DEFS = 'SET_ORIGINAL_COLUMN_DEFS',
    SET_COLUMN_DEFS = 'SET_COLUMN_DEFS',
    SET_THEME = 'SET_THEME',
    SET_ORIGINAL_THEME = 'SET_ORIGINAL_THEME',
}

export enum TableConfigurationGetterEnum {
    GET_TABLE_ID = 'GET_TABLE_ID',
    GET_DEFAULT_COLUMN_DEF = 'GET_DEFAULT_COLUMN_DEF',
    GET_COLUMN_DEFS = 'GET_COLUMN_DEFS',
    GET_THEME = 'GET_THEME',
}
