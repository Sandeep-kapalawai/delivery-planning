import { ListViewTypeEnum } from '@/static';
import { IUserAction } from '@/components/user-actions/interfaces';
import { IFclListItem, ILclListItem } from '@/interfaces';

export interface IData {
    showUpdateDetails: boolean;
    showSendPlanConfirmation: boolean;
}
export interface IMethods {
    closeUpdateDetails(): void;
    sendDeliveryOrders(): void;
}
export interface IComputed {
    selectedRows: Map<number, IFclListItem | ILclListItem>;
    userActions: Array<IUserAction>;
    currentPage(): number;
    pageSize(): number;
    totalRows(): number;
}
export interface IProps {
    listViewModule: string;
    listViewType: ListViewTypeEnum;
}
