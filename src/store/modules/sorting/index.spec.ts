//@ts-nocheck
import sorting from '.';
import { IState } from './interfaces';
import { SortingGetterEnum, SortingMutationEnum, SortingActionEnum } from './static';

const createState = (overrides?: Partial<IState>): IState => ({
    field: '',
    direction: null,
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(sorting.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_SORT returns sort as undefined if field or direction is empty', () => {
        const { field, direction } = createState({ field: '', direction: null });

        expect(sorting.getters[SortingGetterEnum.GET_SORT]({ field, direction })).toEqual(undefined);
    });

    it('GET_SORT returns sort if field and direction is not empty', () => {
        const { field, direction } = createState({ field: 'TEST_FIELD', direction: 'asc' });

        expect(sorting.getters[SortingGetterEnum.GET_SORT]({ field, direction })).toEqual(`${field}:${direction}`);
    });
});

describe('mutations', () => {
    it('SET_SORT sets field and direction in state', () => {
        const state = createState();

        sorting.mutations[SortingMutationEnum.SET_SORT](state, {
            field: 'TEST_FIELD',
            direction: 'asc',
        });

        expect(state).toEqual(
            createState({
                field: 'TEST_FIELD',
                direction: 'asc',
            }),
        );
    });
});

describe('actions', () => {
    it('INITIALIZE commits SET_SORT mutation', () => {
        const state = createState();
        const commit = jest.fn();
        const sortParams = { field: 'TEST_FIELD', direction: 'asc' };

        sorting.actions[SortingActionEnum.INITIALIZE]({ state, commit }, sortParams);

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(SortingMutationEnum.SET_SORT, sortParams);
    });

    it('INITIALIZE commits SET_SORT mutation with fields and directions not empty', () => {
        const state = createState({
            field: 'TEST_FIELD',
            direction: 'asc',
        });
        const commit = jest.fn();
        const sortParams = { field: 'TEST_FIELD', direction: 'asc' };
        sorting.actions[SortingActionEnum.INITIALIZE]({ state, commit }, sortParams);

        expect(commit).toHaveBeenCalledTimes(0);
        expect(commit).not.toHaveBeenCalledWith(SortingMutationEnum.SET_SORT, sortParams);
    });

    it('SET_SORT commits SET_SORT mutation', () => {
        const commit = jest.fn();
        const sortParams = { field: 'TEST_FIELD', direction: 'asc' };

        sorting.actions[SortingActionEnum.SET_SORT]({ commit }, sortParams);

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(SortingMutationEnum.SET_SORT, sortParams);
    });
});
