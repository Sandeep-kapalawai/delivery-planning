import { IServiceLeg } from '@/interfaces';
import { DeliveryPlanningViewNameEnum, ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';

export interface IData {}

export interface IMethods {
    navigateToListPage: () => void;
    fetchDetails: () => Promise<void>;
    fetchCustomerConfiguration: ({ customerBECode }: { customerBECode: string }) => Promise<void>;
    resetCustomerConfiguration: () => Promise<void>;
    resetDetailsState: () => void;
    onUpdateDetails: () => void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    details: {
        result: any;
        isFetching: boolean;
    };
    deliveryPlan: {
        isFetching: boolean;
        isSaving: boolean;
        isSending: boolean;
    };
    allDeliveryLegs: Array<IServiceLeg>;
    deliveryOrderCount: Array<any>;
    isSICancelled: boolean;
}

export interface IProps {
    id: number | string;
    viewType: ListViewTypeEnum;
    viewModule: string;
    viewName: DeliveryPlanningViewNameEnum;
}
