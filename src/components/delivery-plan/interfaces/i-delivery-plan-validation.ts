import { ICargoStuffingDetails, IServicePlan, IServiceLeg } from '@/interfaces';

export interface IDeliveryPlanValidationParams {
    isSavePlanOperation: boolean;
    details: ICargoStuffingDetails;
    deliveryPlan: IServicePlan;
    activeDeliveryLegs: Array<IServiceLeg>;
    firstActiveDeliveryLeg: IServiceLeg;
    lastActiveDeliveryLeg: IServiceLeg;
    activeEmptyReturnLeg: IServiceLeg;
}

export interface IDeliveryPlanValidationResult {
    isValid: boolean;
    error?: string;
}
