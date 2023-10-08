import { CancelTokenSource } from 'axios';

export interface IListState<IListItem> {
    list: {
        isFetching: boolean;
        cancelToken: CancelTokenSource | null;
        result: Array<IListItem>;
        resultTotalCount: number;
    };
    selectedRows: Map<number | string, IListItem>;
}
