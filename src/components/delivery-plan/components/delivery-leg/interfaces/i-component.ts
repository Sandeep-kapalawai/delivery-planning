import { ICargoStuffingDetails, IServicePlan, IServiceLeg } from '@/interfaces';
import { ServiceLegStatusEnum } from '@/static';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, ServiceLegDirectionToMoveEnum } from '@/static';

export interface IData {
    ServiceLegDirectionToMoveEnum: typeof ServiceLegDirectionToMoveEnum;
    isUpdateStatusModalOpen: boolean;
    legToUpdateStatus: Object;
    showCancelLegConfirmationModal: boolean;
}

export interface IMethods {
    copyDeliveryLeg: ({ leg }: { leg: IServiceLeg }) => void;
    cancelDeliveryLeg: ({ leg }: { leg: IServiceLeg }) => void;
    removeDeliveryLeg: ({ leg }: { leg: IServiceLeg }) => void;
    moveDeliveryLeg: ({ leg, direction }: { leg: IServiceLeg; direction: ServiceLegDirectionToMoveEnum }) => void;
    acceptDeliveryLeg: ({ leg }: { leg: IServiceLeg }) => void;
    rejectDeliveryLeg: ({ leg }: { leg: IServiceLeg }) => void;
    onUpdateStatusFieldClick: (leg: IServiceLeg) => void;
    onCloseStatusModal(refreshData: boolean): void;
    updateStatusConfirm(updateStatus: string): void;
    showUpdateStatusAction(leg: IServiceLeg): boolean;
    onCancelLegConfirm(): void;
    onCancelLegCancel(): void;
    getServiceLegStatusDisplayName(serviceLegStatus: ServiceLegStatusEnum): string;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    isLegSent: boolean;
    colorForStatus: string | null;
    cancelLegModalMessage: string;
    disableUpdateStatusAction: boolean;
}

export interface IProps {
    details: { result: ICargoStuffingDetails };
    deliveryPlan: { response: IServicePlan };
    leg: IServiceLeg;
    legIndex: number;
    isFirstLeg: boolean;
    isLastLeg: boolean;
    disabled: boolean;
}
