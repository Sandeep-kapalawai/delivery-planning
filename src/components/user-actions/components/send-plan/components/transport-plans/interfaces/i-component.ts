import { ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';
import { IDeliveryOrders, IDeliveryPlan, IReasonCodes, ITransportplanItems, SCMTableColDef } from '@/interfaces';

export interface IData {
    isPreviewPanelOpen: boolean;
    previewPanelLinks: Array<{ value: string }>;
    selectedColumn: string;
}

export interface IMethods {
    initializeTableConfiguration(): void;
    fetchReasonCodes(): void;
    mapRow(row: IDeliveryPlan, index: number): void;
    mappedReasonCodes(row: IReasonCodes): void;
    onCommentChange(data: any): void;
    onReasonCodeChange(data: any): void;
    handleSeeMoreClick(data: any, field: string): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    newOrders: Array<any>;
    tableId: string;
    defaultColDef: Array<SCMTableColDef>;
    columnDefs: Array<SCMTableColDef>;
    renderColumnDefs: Array<SCMTableColDef>;
    toggleAccordianitems: boolean;
    isLoading: boolean;
    deliveryOrdersInfo: { isFetching: boolean; transportPlansData: IDeliveryOrders; errorMessage: string };
    reasonCodes: any;
    accordianTitle: string;
    updateReasonCodes: Array<IReasonCodes>;
    revisedOrders: Array<any>;
    cancelledOrders: Array<any>;
}

export interface IProps {
    listViewType: ListViewTypeEnum;
    selectedItems: Array<number>;
    transportPlans: Array<ITransportplanItems>;
    row: ITransportplanItems;
}
