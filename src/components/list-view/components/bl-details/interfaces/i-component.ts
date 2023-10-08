import { ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, NotificationComponentEnum, NotificationPositionEnum } from '@/static';
import { SCMTableColDef, IFclListItem, ILclListItem, CargoStuffingDocument } from '@/interfaces';

export interface IData {
    pageSizeOptions: Array<any>;
    isFetching: boolean;
    orignalRowData: Array<CargoStuffingDocument>;
    rowData: Array<CargoStuffingDocument>;
    searchQuery: any;
    NotificationPositionEnum: typeof NotificationPositionEnum;
    NotificationComponentEnum: typeof NotificationComponentEnum;
}

export interface IMethods {
    fetchList(): void;
    triggerSearch(): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    defaultColDef: SCMTableColDef;
    columnDefs: Array<SCMTableColDef>;
}

export interface IProps {
    listViewType: ListViewTypeEnum;
    listViewModule: string;
    selectedRow: ILclListItem | IFclListItem;
}
