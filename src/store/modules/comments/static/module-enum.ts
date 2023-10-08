import { createMutationConstants } from 'destination/store/utilities';

export const NAMESPACE = 'comments';

export enum CommentsActionEnum {
    RESET_STATE = 'RESET_STATE',
    FETCH_COMMENTS = 'FETCH_COMMENTS',
    LOAD_MORE_COMMENTS = 'LOAD_MORE_COMMENTS',
    ADD_COMMENT = 'ADD_COMMENT',
    SET_APPLIED_FILTERS = 'SET_APPLIED_FILTERS',
}

export const CommentsMutationEnum = {
    RESET_STATE: CommentsActionEnum.RESET_STATE,
    FETCH_COMMENTS: createMutationConstants(CommentsActionEnum.FETCH_COMMENTS),
    LOAD_MORE_COMMENTS: createMutationConstants(CommentsActionEnum.LOAD_MORE_COMMENTS),
    ADD_COMMENT: createMutationConstants(CommentsActionEnum.ADD_COMMENT),
    SET_APPLIED_FILTERS: CommentsActionEnum.SET_APPLIED_FILTERS,
    SET_RESOLVED_APPLIED_FILTERS: 'SET_RESOLVED_APPLIED_FILTERS',
};

export enum CommentsGetterEnum {
    GET_COMMENTS = 'GET_COMMENTS',
    GET_ADD_COMMENT = 'GET_ADD_COMMENT',
    GET_APPLIED_FILTERS = 'GET_APPLIED_FILTERS',
}
