import { GasCheckResultsEnum } from '@/static';

export interface IUpdateDetails {
    cargoStuffingId?: number;
    pickupReference: string;
    pickupReferenceExpiryDateTime: string;
    deliveryPriorityId: number | string;
    specialProgramId: number | string;
    emptyReturnReference: string;
    emptyReturnReferenceExpiryDateTime: string;
    isMultipleDeliveryPrograms?: boolean;
    isMultipleDeliveryPriorities?: boolean;
    isMultipleSpecialPrograms?: boolean;
    isMultipleEmptyReturnReference?: boolean;
    isMultipleEmptyReturnReferenceExpiryDateTime?: boolean;
    isMultiplePickupReferenceExpiryDateTime?: boolean;
    isMultiplePickupReference?: boolean;
    pickupReferenceExpiryDateTimeLocal?: string | undefined;
    emptyReturnReferencePlaceholder?: string;
    gasCheckDetails: {
        gasCheckRequired?: boolean;
        gasCheckResult?: GasCheckResultsEnum;
        gasCheckRequestedBy: string;
        gasCheckRequestedDate: string;
        isMultipleGasCheckRequestedBy: boolean;
        isMultipleGasCheckRequestedDate: boolean;
        isMultipleGasCheckRequired: boolean;
        isMultipleGasCheckResult: boolean;
        isDisabledGasCheckRequestedBy: boolean;
        isDisabledGasCheckRequestedDate: boolean;
        isDisabledGasCheckRequired: boolean;
        isDisabledGasCheckResult: boolean;
    };
}

export interface IUpdateDetailsConfig {
    isPickupReferenceRequired: boolean;
    isPickupReferenceExpiryRequired: boolean;
    isEmptyReferenceExpiryRequired: boolean;
    isEmptyReferenceRequired: boolean;
}

export interface IPriorityProgram {
    label: string | undefined;
    priorityLevel?: number;
    value: any;
    priorities?: Array<any>;
    programName?: string;
    deliveryPriorityId?: number;
    displayName?: string;
}

export interface ISelectedPriority {
    updateSelectedPriority: boolean;
}
export interface IAllPriorities {
    programName: string;
    priorities: Array<IPriorityProgram>;
}

export interface ISpecialProgram {
    specialProgramName: string;
    specialProgramId: number;
}

export interface GasCheckDetails {
    gasCheckRequired: boolean;
    gasCheckResult?: GasCheckResultsEnum;
    gasCheckRequestedBy: string;
    gasCheckRequestedDate: string;
}
export interface GasCheckRequiredOption {
    label: string;
    value: boolean;
}

export interface GasCheckResultOption {
    label: string;
    value: GasCheckResultsEnum;
}
