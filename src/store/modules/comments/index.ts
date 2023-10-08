import { Module } from 'vuex';
import { cloneDeep } from 'lodash';
import { IRootState } from '../../interfaces';
import { IState } from './interfaces';
import { CommentsGetterEnum, CommentsMutationEnum, CommentsActionEnum } from './static';
import api from '@/data/api';
import { ICommentList, ICommentPayload, ICommentAppliedFilters, ICommentListItem } from '@/interfaces';
import { mapAppliedFiltersToResolvedAppliedFilters } from './logic';

const getDefaultState = (): IState => ({
    pagination: {
        limit: 10,
        page: 1,
    },
    appliedFilters: {},
    resolvedAppliedFilters: {},
    comments: {
        isFetching: false,
        result: [],
        resultTotalCount: 0,
    },
    addComment: {
        isRequestInProgress: false,
    },
});

const comments: Module<IState, IRootState> = {
    namespaced: true,

    state: getDefaultState,

    getters: {
        [CommentsGetterEnum.GET_COMMENTS](state) {
            return state.comments;
        },
        [CommentsGetterEnum.GET_ADD_COMMENT](state) {
            return state.addComment;
        },
        [CommentsGetterEnum.GET_APPLIED_FILTERS](state) {
            return state.appliedFilters;
        },
    },

    mutations: {
        [CommentsMutationEnum.RESET_STATE](state) {
            Object.assign(state, getDefaultState());
        },
        [CommentsMutationEnum.FETCH_COMMENTS.STARTED](state) {
            state.pagination.page = 1;
            state.comments = {
                isFetching: true,
                result: [],
                resultTotalCount: 0,
            };
        },
        [CommentsMutationEnum.FETCH_COMMENTS.SUCCEEDED](state, response: ICommentList) {
         
            state.comments = {
                isFetching: false,
                //This is a temporary change to filter only user level comments from BE response as there is an issue with BE to display outbound and system events -ISCMLP-35227
                result: response.result?.filter((res:ICommentListItem) => res.eventType === 'USER_COMMENT').map((res: ICommentListItem) => ({
                   ...res,
                    createdDateTimeUTC: res.createdAtTimestampUtc,
                    author: res.createdBy,
                  })),
                
                resultTotalCount: response.resultTotalCount,
            };
        },
        [CommentsMutationEnum.FETCH_COMMENTS.FAILED](state) {
            state.comments.isFetching = false;
        },
        [CommentsMutationEnum.LOAD_MORE_COMMENTS.STARTED](state) {
            state.pagination.page = state.pagination.page + 1;
            state.comments.isFetching = true;
        },
        [CommentsMutationEnum.LOAD_MORE_COMMENTS.SUCCEEDED](state, response: ICommentList) {
            state.comments = {
                isFetching: false,
                result: [...state.comments.result, ...response.result],
                resultTotalCount: response.resultTotalCount,
            };
        },
        [CommentsMutationEnum.LOAD_MORE_COMMENTS.FAILED](state) {
            state.pagination.page = state.pagination.page - 1;
            state.comments.isFetching = false;
        },
        [CommentsMutationEnum.ADD_COMMENT.STARTED](state) {
            state.addComment = {
                isRequestInProgress: true,
            };
        },
        [CommentsMutationEnum.ADD_COMMENT.SUCCEEDED](state) {
            state.addComment = {
                isRequestInProgress: false,
            };
        },
        [CommentsMutationEnum.ADD_COMMENT.FAILED](state) {
            state.addComment = {
                isRequestInProgress: false,
            };
        },
        [CommentsMutationEnum.SET_APPLIED_FILTERS](state, { appliedFilters }: { appliedFilters: ICommentAppliedFilters }) {
            state.appliedFilters = cloneDeep(appliedFilters);
        },
        [CommentsMutationEnum.SET_RESOLVED_APPLIED_FILTERS](state, { resolvedAppliedFilters }: { resolvedAppliedFilters: ICommentAppliedFilters }) {
            state.resolvedAppliedFilters = cloneDeep(resolvedAppliedFilters);
        },
    },

    actions: {
        [CommentsActionEnum.RESET_STATE]({ commit }) {
            commit(CommentsMutationEnum.RESET_STATE);
        },
        async [CommentsActionEnum.FETCH_COMMENTS]({ state, commit }, { deliveryPlanId }: { deliveryPlanId: number | string }) {
            try {
                commit(CommentsMutationEnum.FETCH_COMMENTS.STARTED);
                const filterParams = state.resolvedAppliedFilters;
                const data = await api.comments.getComments(deliveryPlanId, {
                    params: {
                        ...state.pagination,
                        ...filterParams,
                    },
                });
                commit(CommentsMutationEnum.FETCH_COMMENTS.SUCCEEDED, data);
            } catch (error: any) {
                commit(CommentsMutationEnum.FETCH_COMMENTS.FAILED);
                throw error;
            }
        },
        async [CommentsActionEnum.LOAD_MORE_COMMENTS]({ state, commit }, { deliveryPlanId }: { deliveryPlanId: number | string }) {
            try {
                commit(CommentsMutationEnum.LOAD_MORE_COMMENTS.STARTED);
                const filterParams = state.resolvedAppliedFilters;
                const data = await api.comments.getComments(deliveryPlanId, {
                    params: {
                        ...state.pagination,
                        ...filterParams,
                    },
                });
                commit(CommentsMutationEnum.LOAD_MORE_COMMENTS.SUCCEEDED, data);
            } catch (error: any) {
                commit(CommentsMutationEnum.LOAD_MORE_COMMENTS.FAILED);
                throw error;
            }
        },
        async [CommentsActionEnum.ADD_COMMENT]({ commit }, { deliveryPlanId, comment }: { deliveryPlanId: number | string; comment: string }) {
            try {
                commit(CommentsMutationEnum.ADD_COMMENT.STARTED);
                const payload: ICommentPayload = {
                    deliveryPlanId,
                    content: comment,
                };
                await api.comments.addComment(payload);
                commit(CommentsMutationEnum.ADD_COMMENT.SUCCEEDED);
            } catch (error: any) {
                commit(CommentsMutationEnum.ADD_COMMENT.FAILED);
                throw error;
            }
        },
        async [CommentsActionEnum.SET_APPLIED_FILTERS]({ commit }, { appliedFilters }: { appliedFilters: ICommentAppliedFilters }) {
            const resolvedAppliedFilters = mapAppliedFiltersToResolvedAppliedFilters({ appliedFilters });
            commit(CommentsMutationEnum.SET_APPLIED_FILTERS, { appliedFilters });
            commit(CommentsMutationEnum.SET_RESOLVED_APPLIED_FILTERS, { resolvedAppliedFilters });
        },
    },
};

export default comments;
