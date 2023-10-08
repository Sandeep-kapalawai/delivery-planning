//@ts-nocheck
import fclDetails from '.';
import { IState } from './interfaces';
import { DetailsActionEnum, DetailsGetterEnum, DetailsMutationEnum } from '@/store/static';
import { NAMESPACE as COMMENTS_NAMESPACE, CommentsActionEnum } from '@/store/modules/comments/static';
import api from '@/data/api';
import { ICargoStuffingDetails } from '@/interfaces';

const createState = (overrides?: Partial<IState>): IState => ({
    details: {
        isFetching: false,
        result: {},
    },
    ...overrides,
});

describe('fclDetails store', () => {
    describe('state', () => {
        it('returns a default state', () => {
            expect(fclDetails.state()).toEqual(createState());
        });
    });

    describe('getters', () => {
        it('GET_DETAILS returns object from state', () => {
            const { details } = createState({
                details: {
                    isFetching: false,
                    result: { cargoStuffingId: 1000 },
                },
            });

            expect(fclDetails.getters[DetailsGetterEnum.GET_DETAILS]({ details })).toEqual(details);
        });
    });

    describe('mutations', () => {
        it('RESET_STATE resets to default state', () => {
            const state = createState({
                details: {
                    isFetching: false,
                    result: { cargoStuffingId: 1000 },
                },
            });

            fclDetails.mutations[DetailsMutationEnum.RESET_STATE](state);

            expect(state).toEqual(createState());
        });

        it('FETCH_DETAILS.STARTED sets details.isFetching in state', () => {
            const state = createState({
                details: {
                    isFetching: false,
                    result: {},
                },
            });

            fclDetails.mutations[DetailsMutationEnum.FETCH_DETAILS.STARTED](state);

            expect(state).toEqual(
                createState({
                    details: {
                        isFetching: true,
                        result: {},
                    },
                }),
            );
        });

        it('FETCH_DETAILS.SUCCEEDED sets details in state', () => {
            const state = createState({
                details: {
                    isFetching: true,
                    result: {},
                },
            });

            fclDetails.mutations[DetailsMutationEnum.FETCH_DETAILS.SUCCEEDED](state, { cargoStuffingId: 1000 });

            expect(state).toEqual(
                createState({
                    details: {
                        isFetching: false,
                        result: { cargoStuffingId: 1000 },
                    },
                }),
            );
        });

        it('FETCH_DETAILS.FAILED sets details.isFetching in state', () => {
            const state = createState({
                details: {
                    isFetching: true,
                    result: {},
                },
            });

            fclDetails.mutations[DetailsMutationEnum.FETCH_DETAILS.FAILED](state);

            expect(state).toEqual(
                createState({
                    details: {
                        isFetching: false,
                        result: {},
                    },
                }),
            );
        });
    });

    describe('actions', () => {
        it('RESET_STATE commits RESET_STATE mutation', async () => {
            const commit = jest.fn();
            const dispatch = jest.fn();

            await fclDetails.actions[DetailsActionEnum.RESET_STATE]({ commit, dispatch });
            expect(commit).toHaveBeenCalledTimes(1);
            expect(commit).toHaveBeenCalledWith(DetailsMutationEnum.RESET_STATE);

            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(`${COMMENTS_NAMESPACE}/${CommentsActionEnum.RESET_STATE}`);
        });

        it('FETCH_DETAILS commits SUCCEEDED mutation on request success', async () => {
            const data: ICargoStuffingDetails = {};
            jest.spyOn(api.fcl, 'getCargoStuffingDetails').mockResolvedValue(data);

            const state = createState();
            const commit = jest.fn();

            await fclDetails.actions[DetailsActionEnum.FETCH_DETAILS]({ commit }, 1000);

            expect(commit).toHaveBeenCalledTimes(2);
            expect(commit).toHaveBeenCalledWith(DetailsMutationEnum.FETCH_DETAILS.STARTED);
            expect(commit).toHaveBeenCalledWith(DetailsMutationEnum.FETCH_DETAILS.SUCCEEDED, data);
        });

        it('FETCH_DETAILS commits FAILED mutation on request failure', async () => {
            const error = { message: 'error' };
            jest.spyOn(api.fcl, 'getCargoStuffingDetails').mockRejectedValue(error);

            const state = createState();
            const commit = jest.fn();

            await fclDetails.actions[DetailsActionEnum.FETCH_DETAILS]({ commit }, 1000).catch(() => {});

            expect(commit).toHaveBeenCalledTimes(2);
            expect(commit).toHaveBeenCalledWith(DetailsMutationEnum.FETCH_DETAILS.STARTED);
            expect(commit).toHaveBeenCalledWith(DetailsMutationEnum.FETCH_DETAILS.FAILED);
        });
    });
});
