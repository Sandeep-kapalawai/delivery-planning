//@ts-nocheck
import commentsModule from '.';
import { IState } from './interfaces';
import { CommentsGetterEnum, CommentsMutationEnum, CommentsActionEnum } from './static';
import api from '@/data/api';
import { ICommentAppliedFilters } from '@/components/comments/interfaces';
import { ICommentList } from '@/interfaces';

const createState = (overrides?: Partial<IState>): IState => ({
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
    ...overrides,
});

describe('state', () => {
    it('returns a default state', () => {
        expect(commentsModule.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_COMMENTS returns comments from state', () => {
        const { comments } = createState();

        expect(commentsModule.getters[CommentsGetterEnum.GET_COMMENTS]({ comments })).toEqual(comments);
    });

    it('GET_ADD_COMMENT returns addComment from state', () => {
        const { addComment } = createState();

        expect(commentsModule.getters[CommentsGetterEnum.GET_ADD_COMMENT]({ addComment })).toEqual(addComment);
    });

    it('GET_APPLIED_FILTERS returns appliedFilters from state', () => {
        const { appliedFilters } = createState();

        expect(commentsModule.getters[CommentsGetterEnum.GET_APPLIED_FILTERS]({ appliedFilters })).toEqual(appliedFilters);
    });
});

describe('mutations', () => {
    it('RESET_STATE resets to default state', () => {
        const state = createState({
            comments: {
                isFetching: false,
                cancelToken: null,
                result: { commentId: 1000 },
                resultTotalCount: 0,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.RESET_STATE](state);

        expect(state).toEqual(createState());
    });

    it('FETCH_COMMENTS.STARTED sets comments.isFetching and pagination.page in state', () => {
        const state = createState({
            pagination: {
                limit: 10,
                page: 2,
            },
            comments: {
                isFetching: false,
                result: [],
                resultTotalCount: 0,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.FETCH_COMMENTS.STARTED](state);

        expect(state).toEqual(
            createState({
                pagination: {
                    limit: 10,
                    page: 1,
                },
                comments: {
                    isFetching: true,
                    result: [],
                    resultTotalCount: 0,
                },
            }),
        );
    });

    it('FETCH_COMMENTS.SUCCEEDED sets comments in state only when event type is USER_COMMENT', () => {
        const state = createState({
            comments: {
                isFetching: true,
                result: [],
                resultTotalCount: 0,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.FETCH_COMMENTS.SUCCEEDED](state, <ICommentList>{
            result: [{ commentId: 1000, eventType:'USER_COMMENT'}],
            resultTotalCount: 1,
        });

        expect(state).toEqual(
            createState({
                comments: {
                    isFetching: false,
                    result: [{ commentId: 1000, eventType:'USER_COMMENT'}],
                    resultTotalCount: 1,
                },
            }),
        );
    });

    it('FETCH_COMMENTS.SUCCEEDED doesnt set comments in state when  event type is not USER_COMMENT ', () => {
        const state = createState({
            comments: {
                isFetching: true,
                result: [],
                resultTotalCount: 0,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.FETCH_COMMENTS.SUCCEEDED](state, <ICommentList>{
            result: [{ commentId: 1000, eventType:'TEST'}],
            resultTotalCount: 1,
        });

        expect(state).toEqual(
            createState({
                comments: {
                    isFetching: false,
                    result: [],
                    resultTotalCount: 1,
                },
            }),
        );
    });

    it('FETCH_COMMENTS.FAILED sets comments.isFetching and comments.errors in state', () => {
        const state = createState({
            comments: {
                isFetching: true,
                result: [],
                resultTotalCount: 0,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.FETCH_COMMENTS.FAILED](state, ['TEST_ERROR']);

        expect(state).toEqual(
            createState({
                comments: {
                    isFetching: false,
                    result: [],
                    resultTotalCount: 0,
                },
            }),
        );
    });

    it('LOAD_MORE_COMMENTS.STARTED sets comments.isFetching and pagination.page in state', () => {
        const state = createState({
            pagination: {
                limit: 10,
                page: 1,
            },
            comments: {
                isFetching: false,
                result: [{ commentId: 1000 }],
                resultTotalCount: 2,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.LOAD_MORE_COMMENTS.STARTED](state);

        expect(state).toEqual(
            createState({
                pagination: {
                    limit: 10,
                    page: 2,
                },
                comments: {
                    isFetching: true,
                    result: [{ commentId: 1000 }],
                    resultTotalCount: 2,
                },
            }),
        );
    });

    it('LOAD_MORE_COMMENTS.SUCCEEDED sets comments in state', () => {
        const state = createState({
            comments: {
                isFetching: true,
                result: [{ commentId: 1000 }],
                resultTotalCount: 2,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.LOAD_MORE_COMMENTS.SUCCEEDED](state, <ICommentList>{
            result: [{ commentId: 2000 }],
            resultTotalCount: 2,
        });

        expect(state).toEqual(
            createState({
                comments: {
                    isFetching: false,
                    result: [{ commentId: 1000 }, { commentId: 2000 }],
                    resultTotalCount: 2,
                },
            }),
        );
    });

    it('LOAD_MORE_COMMENTS.FAILED sets comments.isFetching and comments.errors in state', () => {
        const state = createState({
            pagination: {
                limit: 10,
                page: 2,
            },
            comments: {
                isFetching: true,
                result: [{ commentId: 1000 }],
                resultTotalCount: 2,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.LOAD_MORE_COMMENTS.FAILED](state, ['TEST_ERROR']);

        expect(state).toEqual(
            createState({
                pagination: {
                    limit: 10,
                    page: 1,
                },
                comments: {
                    isFetching: false,
                    result: [{ commentId: 1000 }],
                    resultTotalCount: 2,
                },
            }),
        );
    });

    it('ADD_COMMENT.STARTED sets addComment.isRequestInProgress in state', () => {
        const state = createState({
            addComment: {
                isRequestInProgress: false,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.ADD_COMMENT.STARTED](state);

        expect(state).toEqual(
            createState({
                addComment: {
                    isRequestInProgress: true,
                },
            }),
        );
    });

    it('ADD_COMMENT.SUCCEEDED sets comments in state', () => {
        const state = createState({
            addComment: {
                isRequestInProgress: true,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.ADD_COMMENT.SUCCEEDED](state);

        expect(state).toEqual(
            createState({
                addComment: {
                    isRequestInProgress: false,
                },
            }),
        );
    });

    it('ADD_COMMENT.FAILED sets addComment.isRequestInProgress and addComment.errors in state', () => {
        const state = createState({
            addComment: {
                isRequestInProgress: true,
            },
        });

        commentsModule.mutations[CommentsMutationEnum.ADD_COMMENT.FAILED](state, ['TEST_ERROR']);

        expect(state).toEqual(
            createState({
                addComment: {
                    isRequestInProgress: false,
                },
            }),
        );
    });

    it('SET_APPLIED_FILTERS sets appliedFilters in state', () => {
        const state = createState({
            appliedFilters: {},
        });

        commentsModule.mutations[CommentsMutationEnum.SET_APPLIED_FILTERS](state, { appliedFilters: { TEST_ID: 'TEST_VALUE' } });

        expect(state).toEqual(
            createState({
                appliedFilters: { TEST_ID: 'TEST_VALUE' },
            }),
        );
    });

    it('SET_RESOLVED_APPLIED_FILTERS sets appliedFilters in state', () => {
        const state = createState({
            resolvedAppliedFilters: {},
        });

        commentsModule.mutations[CommentsMutationEnum.SET_RESOLVED_APPLIED_FILTERS](state, { resolvedAppliedFilters: { TEST_ID: 'TEST_VALUE' } });

        expect(state).toEqual(
            createState({
                resolvedAppliedFilters: { TEST_ID: 'TEST_VALUE' },
            }),
        );
    });
});

describe('actions', () => {
    it('RESET_STATE commits RESET_STATE mutation', async () => {
        const commit = jest.fn();

        await commentsModule.actions[CommentsActionEnum.RESET_STATE]({ commit });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.RESET_STATE);
    });

    it('FETCH_COMMENTS commits SUCCEEDED mutation on request success', async () => {
        const data = [];
        jest.spyOn(api.comments, 'getComments').mockResolvedValue(data);

        const state = createState();
        const commit = jest.fn();

        await commentsModule.actions[CommentsActionEnum.FETCH_COMMENTS]({ state, commit }, { deliveryPlanId: 1000, objectType: 'TransportDocument' });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.FETCH_COMMENTS.STARTED);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.FETCH_COMMENTS.SUCCEEDED, data);
    });

    it('FETCH_COMMENTS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.comments, 'getComments').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();

        await commentsModule.actions[CommentsActionEnum.FETCH_COMMENTS]({ state, commit }, { deliveryPlanId: 1000, objectType: 'TransportDocument' }).catch(
            () => {},
        );

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.FETCH_COMMENTS.STARTED);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.FETCH_COMMENTS.FAILED);
    });

    it('LOAD_MORE_COMMENTS commits SUCCEEDED mutation on request success', async () => {
        const data = [];
        jest.spyOn(api.comments, 'getComments').mockResolvedValue(data);

        const state = createState();
        const commit = jest.fn();

        await commentsModule.actions[CommentsActionEnum.LOAD_MORE_COMMENTS]({ state, commit }, { deliveryPlanId: 1000, objectType: 'TransportDocument' });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.LOAD_MORE_COMMENTS.STARTED);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.LOAD_MORE_COMMENTS.SUCCEEDED, data);
    });

    it('LOAD_MORE_COMMENTS commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.comments, 'getComments').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();

        await commentsModule.actions[CommentsActionEnum.LOAD_MORE_COMMENTS]({ state, commit }, { deliveryPlanId: 1000, objectType: 'TransportDocument' }).catch(
            () => {},
        );

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.LOAD_MORE_COMMENTS.STARTED);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.LOAD_MORE_COMMENTS.FAILED);
    });

    it('ADD_COMMENT commits SUCCEEDED mutation on request success', async () => {
        const data = [];
        jest.spyOn(api.comments, 'addComment').mockResolvedValue(data);

        const state = createState();
        const commit = jest.fn();

        await commentsModule.actions[CommentsActionEnum.ADD_COMMENT](
            { state, commit },
            { objectId: 1000, objectType: 'TransportDocument', comment: 'TEST_COMMENT' },
        );

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.ADD_COMMENT.STARTED);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.ADD_COMMENT.SUCCEEDED);
    });

    it('ADD_COMMENT commits FAILED mutation on request failure', async () => {
        const error = { message: 'error' };
        jest.spyOn(api.comments, 'addComment').mockRejectedValue(error);

        const state = createState();
        const commit = jest.fn();

        await commentsModule.actions[CommentsActionEnum.ADD_COMMENT](
            { state, commit },
            { objectId: 1000, objectType: 'TransportDocument', comment: 'TEST_COMMENT' },
        ).catch(() => {});

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.ADD_COMMENT.STARTED);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.ADD_COMMENT.FAILED);
    });

    it('SET_APPLIED_FILTERS commits SET_APPLIED_FILTERS and SET_RESOLVED_APPLIED_FILTERS mutation', async () => {
        const appliedFilters: ICommentAppliedFilters = { TEST_ID: [{ value: 'TEST_VALUE' }] };
        const commit = jest.fn();

        await commentsModule.actions[CommentsActionEnum.SET_APPLIED_FILTERS]({ commit }, { appliedFilters });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.SET_APPLIED_FILTERS, { appliedFilters });
        expect(commit).toHaveBeenCalledWith(CommentsMutationEnum.SET_RESOLVED_APPLIED_FILTERS, { resolvedAppliedFilters: { TEST_ID: ['TEST_VALUE'] } });
    });
});
