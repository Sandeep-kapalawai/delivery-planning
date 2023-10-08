export const NAMESPACE = 'pagination';

export enum PaginationActionEnum {
    INITIALIZE = 'INITIALIZE',
    SET_LIMIT = 'SET_LIMIT',
    SET_PAGE = 'SET_PAGE',
}

export enum PaginationMutationEnum {
    SET_PAGE_SIZE_OPTIONS = 'SET_PAGE_SIZE_OPTIONS',
    SET_LIMIT = 'SET_LIMIT',
    SET_PAGE = 'SET_PAGE',
}

export enum PaginationGetterEnum {
    GET_PAGE_SIZE_OPTIONS = 'GET_PAGE_SIZE_OPTIONS',
    GET_LIMIT = 'GET_LIMIT',
    GET_PAGE = 'GET_PAGE',
    GET_PAGINATION = 'GET_PAGINATION',
}
