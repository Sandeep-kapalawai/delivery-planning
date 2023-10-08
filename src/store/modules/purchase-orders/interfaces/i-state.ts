import { CancelTokenSource } from 'axios';
import { CustomerOrderLineModel, StockKeepingUnitDataSummary } from '@/interfaces';

export interface IState {
    list: {
        isFetching: boolean;
        cancelToken: CancelTokenSource | null;
        poskUs: Array<CustomerOrderLineModel>;
        stockKeepingUnitDataSummary?: StockKeepingUnitDataSummary;
    };
}
