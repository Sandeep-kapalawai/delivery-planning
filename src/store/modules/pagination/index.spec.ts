//@ts-nocheck
import pagination from '.';
import { IState } from './interfaces';
import { PaginationGetterEnum, PaginationMutationEnum, PaginationActionEnum, getMainListPageSizeOptions } from './static';
import { PageSizeOption } from '@/interfaces';

const DEFAULT_PAGE_SIZE_OPTIONS: Array<PageSizeOption> = getMainListPageSizeOptions();

const createState = (overrides?: Partial<IState>): IState => ({
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    limit: DEFAULT_PAGE_SIZE_OPTIONS[0].value,
    page: 1,
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(pagination.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_PAGE_SIZE_OPTIONS returns pageSizeOptions from state', () => {
        const { pageSizeOptions } = createState({ pageSizeOptions: getMainListPageSizeOptions() });

        expect(pagination.getters[PaginationGetterEnum.GET_PAGE_SIZE_OPTIONS]({ pageSizeOptions })).toEqual(pageSizeOptions);
    });

    it('GET_LIMIT returns limit from state', () => {
        const { limit } = createState({ limit: 50 });

        expect(pagination.getters[PaginationGetterEnum.GET_LIMIT]({ limit })).toEqual(limit);
    });

    it('GET_PAGE returns page from state', () => {
        const { page } = createState({ page: 1 });

        expect(pagination.getters[PaginationGetterEnum.GET_PAGE]({ page })).toEqual(page);
    });

    it('GET_PAGINATION returns limit and page from state', () => {
        const { limit, page } = createState({ limit: 50, page: 1 });

        expect(pagination.getters[PaginationGetterEnum.GET_PAGINATION]({ limit, page })).toEqual({ limit, page });
    });
});

describe('mutations', () => {
    it('SET_PAGE_SIZE_OPTIONS sets pageSizeOptions in state', () => {
        const state = createState();

        pagination.mutations[PaginationMutationEnum.SET_PAGE_SIZE_OPTIONS](state, {
            pageSizeOptions: getMainListPageSizeOptions(),
        });

        expect(state).toEqual(
            createState({
                pageSizeOptions: getMainListPageSizeOptions(),
            }),
        );
    });

    it('SET_LIMIT sets limit in state', () => {
        const state = createState();

        pagination.mutations[PaginationMutationEnum.SET_LIMIT](state, {
            limit: 100,
        });

        expect(state).toEqual(
            createState({
                limit: 100,
            }),
        );
    });

    it('SET_PAGE sets limit in state', () => {
        const state = createState();

        pagination.mutations[PaginationMutationEnum.SET_PAGE](state, {
            page: 2,
        });

        expect(state).toEqual(
            createState({
                page: 2,
            }),
        );
    });
});

describe('actions', () => {
    it('INITIALIZE commits SET_PAGE_SIZE_OPTIONS and SET_LIMIT mutation', () => {
        const commit = jest.fn();
        const pageSizeOptions: Array<PageSizeOption> = getMainListPageSizeOptions();

        pagination.actions[PaginationActionEnum.INITIALIZE]({ commit }, { pageSizeOptions });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(PaginationMutationEnum.SET_PAGE_SIZE_OPTIONS, { pageSizeOptions });
        expect(commit).toHaveBeenCalledWith(PaginationMutationEnum.SET_LIMIT, { limit: pageSizeOptions[0].value });
    });

    it('SET_LIMIT commits SET_LIMIT mutation', () => {
        const commit = jest.fn();
        const payload = { limit: 100 };

        pagination.actions[PaginationActionEnum.SET_LIMIT]({ commit }, payload);

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(PaginationMutationEnum.SET_LIMIT, payload);
    });

    it('SET_PAGE commits SET_PAGE mutation', () => {
        const commit = jest.fn();
        const payload = { page: 2 };

        pagination.actions[PaginationActionEnum.SET_PAGE]({ commit }, payload);

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(PaginationMutationEnum.SET_PAGE, payload);
    });
});
