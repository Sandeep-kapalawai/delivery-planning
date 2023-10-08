import { createMutationConstants } from 'destination/store/utilities';

export enum DetailsActionEnum {
    RESET_STATE = 'RESET_STATE',
    FETCH_DETAILS = 'FETCH_DETAILS',
}

export const DetailsMutationEnum = {
    RESET_STATE: DetailsActionEnum.RESET_STATE,
    FETCH_DETAILS: createMutationConstants(DetailsActionEnum.FETCH_DETAILS),
};

export enum DetailsGetterEnum {
    GET_DETAILS = 'GET_DETAILS',
}
