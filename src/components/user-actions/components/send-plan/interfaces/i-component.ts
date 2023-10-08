import { ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, NotificationComponentEnum, NotificationPositionEnum } from '@/static';
import { ITransportplanItems, IDeliveryOrderHeaders, IFclListItem, ILclListItem, IMissingFDL, IDeliveryOrders, IDeliveryPlan, IInvalidItems } from '@/interfaces';

export interface IData {
    isProcessingRequest: boolean;
    NotificationComponentEnum: typeof NotificationComponentEnum;
    NotificationPositionEnum: typeof NotificationPositionEnum;
}

export interface IMethods {
    fetchDeliveryOrders(): Promise<void>;
    editPlanRoute(cargoStuffingNumber: string): void;
    mappedOrderItems(order: IDeliveryPlan, transportProviderCode: string): void;
    onSendButtonClick(): void;
    onCloseButtonClick(): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    selectedItems: Array<number | string>;
    isTransportPlansAvailable: boolean;
    deliveryOrdersInfo: any;
    headerInfo: IDeliveryOrderHeaders;
    transportPlans: Array<ITransportplanItems>;
    displayinvalidNotification: Array<IInvalidItems>;
    notChangedNotificationMessage: string;
    disableSendButton: boolean;
    displayFDLNotification: Array<IMissingFDL>;
    getDeliveryOrdersresult: any;
    isLoading: boolean;
    renderEQBLText: string;
}

export interface IProps {
    listViewType: ListViewTypeEnum;
    selectedRows: Map<number | string, IFclListItem | ILclListItem>;
}
