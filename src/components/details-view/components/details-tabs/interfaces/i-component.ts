import { NotificationComponentEnum, ListViewTypeEnum, RelatedObjectTypeEnum } from '@/static';
import { ICargoStuffingDetails, ICommentAppliedFilters, ICommentFilterField, ICommentListItem } from '@/interfaces';

export interface IData {
    NotificationComponentEnum: typeof NotificationComponentEnum;
    activeTab: any;
    isAddCommentEnabled: boolean;
}

export interface IMethods {
    handleActivated(tab: any): void;
    fetchComments(): Promise<void>;
    onLoadMoreComments(): Promise<void>;
    onAddComment(comment: string): Promise<void>;
    onFilterChange(appliedFilters: ICommentAppliedFilters): void;
}

export interface IComputed {
    tabs: Array<any>;
    objectType: RelatedObjectTypeEnum;
    filterFields: Array<ICommentFilterField>;
    appliedFilters: ICommentAppliedFilters;
    comments: {
        isFetching: boolean;
        result: Array<ICommentListItem>;
        resultTotalCount: number;
    };
    addComment: {
        isRequestInProgress: boolean;
    };
}

export interface IProps {
    id: number | string;
    viewType: ListViewTypeEnum;
    viewModule: string;
    details: {
        result: ICargoStuffingDetails;
    };
}
