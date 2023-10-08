import { ValidationObserver } from 'vee-validate';
import { IServiceLegDataRow } from './i-service-leg';
import { ICargoStuffingDetails, ICustomizableField, ICustomizableFieldRequestParams, IServiceLeg, IServicePlan, SCMTableColDef } from '@/interfaces';
import { DeliveryPlanningViewNameEnum, ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, RelatedObjectTypeEnum } from '@/static';

export interface IData {
    isSavingPlan: boolean;
    isSendingPlan: boolean;
    showSendPlanConfirmationModal: boolean;
    showCancelPlanConfirmationModal: boolean;
    sentLegsDisabled: boolean;
}

export interface IMethods {
    resetDeliveryPlanState: () => void;
    fetchDeliveryPlan: ({ deliveryPlanId }: { deliveryPlanId: number | string }) => Promise<void>;
    fetchAdditionalReference: ({ params }: { params: ICustomizableFieldRequestParams }) => Promise<void>;
    saveDeliveryPlan: ({ deliveryPlanId, isSendServicePlanRequest }: { deliveryPlanId: number | string; isSendServicePlanRequest: boolean }) => Promise<void>;
    addDeliveryLeg: () => void;
    copyDeliveryLeg: ({ leg }: { leg: IServiceLeg }) => void;
    undoCancelRejectDeliveryLeg: ({ leg }: { leg: IServiceLeg }) => void;
    setIsStopOffLocation: ({ isStopOffLocation }: { isStopOffLocation: boolean }) => void;
    setAdditionalReferenceField: ({
        relatedObjectId,
        relatedObjectType,
        field,
    }: {
        relatedObjectId: number | string;
        relatedObjectType: RelatedObjectTypeEnum;
        field: ICustomizableField;
    }) => void;
    cancelDeliveryPlan: () => void;
    navigateToListPage: () => void;
    markFormAsDirty: () => void;
    fetchDeliveryPlanData: () => Promise<void>;
    onSavePlanButtonClick: () => Promise<void>;
    onSendPlanButtonClick: () => Promise<void>;
    onSendPlanSuccess: () => void;
    onSendPlanClosed: () => void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    relatedObjectType: RelatedObjectTypeEnum;
    selectedRows: Map<number | string, any>;
    validationObserver: InstanceType<typeof ValidationObserver>;
    isStopOffLocationEnable: boolean;
    deliveryPlan: {
        isFetching: boolean;
        response: IServicePlan;
    };
    activeDeliveryLegs: Array<IServiceLeg>;
    firstActiveDeliveryLeg: IServiceLeg;
    lastActiveDeliveryLeg: IServiceLeg;
    activeEmptyReturnLeg: IServiceLeg;
    cancelledLegs: Array<IServiceLeg>;
    rejectedLegs: Array<IServiceLeg>;
    additionalReference: {
        isFetching: boolean;
        response: Array<ICustomizableField>;
    };
    cancelledLegsInfoMessage: string;
    cancelledLegsDefaultColDef: SCMTableColDef;
    cancelledLegsColumnDefs: Array<SCMTableColDef>;
    cancelledLegsRowData: Array<IServiceLegDataRow>;
    rejectedLegsInfoMessage: string;
    rejectedLegsDefaultColDef: SCMTableColDef;
    rejectedLegsColumnDefs: Array<SCMTableColDef>;
    rejectedLegsRowData: Array<IServiceLegDataRow>;
    isDeliveryLegsNotPresent: boolean;
    showEmptyReturnLeg: boolean;
    isSaveOrSendPlanInProgress: boolean;
    deliveryOrders: string[];
    isCancelPlanButtonDisabled: boolean;
    isStopOffLocation: boolean;
}

export interface IProps {
    id: number | string;
    viewType: ListViewTypeEnum;
    viewName: DeliveryPlanningViewNameEnum;
    details: {
        result: ICargoStuffingDetails;
    };
}
