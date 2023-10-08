import { ICommentAppliedFilters } from '@/interfaces';
import { ICommentListItem } from '@/interfaces';

export interface IState {
    pagination: {
        limit: number;
        page: number;
    };
    appliedFilters: ICommentAppliedFilters;
    resolvedAppliedFilters: ICommentAppliedFilters;
    comments: {
        isFetching: boolean;
        result: Array<ICommentListItem>;
        resultTotalCount: number;
    };
    addComment: {
        isRequestInProgress: boolean;
    };
}
