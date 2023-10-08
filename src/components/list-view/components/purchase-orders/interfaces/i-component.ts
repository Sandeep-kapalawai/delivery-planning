import { SCMTableColDef, IFclListItem, ILclListItem, StockKeepingUnitDataSummary, ICargoStuffingDetails } from '@/interfaces';
import { ListViewTypeEnum, NotificationComponentEnum, NotificationPositionEnum } from '@/static';

export interface IData {
    NotificationComponentEnum: typeof NotificationComponentEnum;
    NotificationPositionEnum: typeof NotificationPositionEnum;
    rowData: Array<any>;
}

export interface IMethods {
    initializeTableConfiguration(): void;
    fetchList(): void;
}

export interface IComputed {
    tableId: string;
    columnDefs: SCMTableColDef;
    defaultColDef: SCMTableColDef;
    list: any;
    skuSummary: StockKeepingUnitDataSummary;
    totalPackages: string;
    totalQuantity: string;
    totalGrossWeight: string;
    totalVolume: string;
}

export interface IProps {
    notificationComponent: NotificationComponentEnum;
    listViewType: ListViewTypeEnum;
    listViewModule: string;
    selectedRow: ILclListItem | IFclListItem | ICargoStuffingDetails;
}
