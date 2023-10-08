//@ts-nocheck
import lclDetails from '.';
import { IState } from './interfaces';
import { DetailsGetterEnum, DetailsMutationEnum, DetailsActionEnum } from '@/store/static';

const createState = (overrides?: Partial<IState>): IState => ({
    details: {
        isFetching: false,
        errorMessages: [],
        result: {},
    },
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(lclDetails.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_DETAILS returns object from state', () => {
        const { details } = createState({
            details: {
                isFetching: false,
                result: { transportDocumentId: 1000 },
            },
        });

        expect(lclDetails.getters[DetailsGetterEnum.GET_DETAILS]({ details })).toEqual(details);
    });
});

describe('mutations', () => {});

describe('actions', () => {});
