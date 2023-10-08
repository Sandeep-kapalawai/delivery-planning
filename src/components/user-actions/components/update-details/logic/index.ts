/* istanbul ignore file */
import { isEmptyValue } from 'destination/utilities';
import { IFclListItem, ILclListItem, IFinalDeliveryLocation } from '@/interfaces';
import { IUpdateDetails } from '../interfaces';

export function getFormDataforMultiSelect(data: Array<IUpdateDetails>, selectedRows: Map<number | string, IFclListItem | ILclListItem>) {
    const isGasCheckFieldDisabledFunction = ({
        selectedRows,
        fieldValues,
    }: {
        selectedRows: Map<number | string, IFclListItem | ILclListItem>;
        fieldValues: Set<any>;
    }) => {
        const isValuePresent = (fieldValues.size === 1 && !isEmptyValue(fieldValues.values().next().value)) || fieldValues.size > 1;
        return selectedRows.size > 1 && isValuePresent;
    };

    const detailsObject = {
        pickupReference: '',
        pickupReferenceExpiryDateTime: '',
        emptyReturnReference: '',
        emptyReturnReferenceExpiryDateTime: '',
        deliveryPriorityId: '',
        specialProgramId: '',
        isMultiplePickupReference: false,
        isMultiplePickupReferenceExpiryDateTime: false,
        isMultipleEmptyReturnReference: false,
        isMultipleEmptyReturnReferenceExpiryDateTime: false,
        isMultipleDeliveryPrograms: false,
        isMultipleDeliveryPriorities: false,
        isMultipleSpecialPrograms: false,
        gasCheckDetails: {
            gasCheckRequired: undefined,
            gasCheckResult: undefined,
            gasCheckRequestedDate: '',
            gasCheckRequestedBy: '',
            isMultipleGasCheckRequestedBy: false,
            isMultipleGasCheckRequestedDate: false,
            isMultipleGasCheckRequired: false,
            isMultipleGasCheckResult: false,
            isDisabledGasCheckRequestedBy: false,
            isDisabledGasCheckRequestedDate: false,
            isDisabledGasCheckRequired: false,
            isDisabledGasCheckResult: false,
        },
    };

    const deliveryPriorityIdSet: Set<string> = new Set<string>();
    const pickupReferenceSet: Set<string> = new Set<string>();
    const pickupReferenceExpiryDateTimeSet: Set<string> = new Set<string>();
    const emptyReturnReferenceSet: Set<string> = new Set<string>();
    const emptyReturnReferenceExpiryDateTimeSet: Set<string> = new Set<string>();
    const specialProgramIdSet: Set<string> = new Set<string>();
    const gasCheckRequiredSet: Set<string> = new Set<string>();
    const gasCheckResultSet: Set<string> = new Set<string>();
    const gasCheckRequestedBySet: Set<string> = new Set<string>();
    const gasCheckRequestedDateSet: Set<string> = new Set<string>();

    data.forEach((item: any) => {
        !isEmptyValue(item.pickupReference) ? pickupReferenceSet.add(item.pickupReference) : pickupReferenceSet.add('');
        !isEmptyValue(item.pickupReferenceExpiryDateTime)
            ? pickupReferenceExpiryDateTimeSet.add(item.pickupReferenceExpiryDateTime)
            : pickupReferenceExpiryDateTimeSet.add('');
        !isEmptyValue(item.emptyReturnReference) ? emptyReturnReferenceSet.add(item.emptyReturnReference) : emptyReturnReferenceSet.add('');
        !isEmptyValue(item.emptyReturnReferenceExpiryDateTime)
            ? emptyReturnReferenceExpiryDateTimeSet.add(item.emptyReturnReferenceExpiryDateTime)
            : emptyReturnReferenceExpiryDateTimeSet.add('');
        !isEmptyValue(item.deliveryPriorityId) ? deliveryPriorityIdSet.add(item.deliveryPriorityId) : deliveryPriorityIdSet.add('');
        !isEmptyValue(item.specialProgramId) ? specialProgramIdSet.add(item.specialProgramId) : specialProgramIdSet.add('');
        !isEmptyValue(item.gasCheckDetails?.gasCheckRequired) ? gasCheckRequiredSet.add(item.gasCheckDetails.gasCheckRequired) : gasCheckRequiredSet.add('');
        !isEmptyValue(item.gasCheckDetails?.gasCheckResult) ? gasCheckResultSet.add(item.gasCheckDetails.gasCheckResult) : gasCheckResultSet.add('');
        !isEmptyValue(item.gasCheckDetails?.gasCheckRequestedBy)
            ? gasCheckRequestedBySet.add(item.gasCheckDetails.gasCheckRequestedBy)
            : gasCheckRequestedBySet.add('');
        !isEmptyValue(item.gasCheckDetails?.gasCheckRequestedDate)
            ? gasCheckRequestedDateSet.add(item.gasCheckDetails.gasCheckRequestedDate)
            : gasCheckRequestedDateSet.add('');
    });

    if (deliveryPriorityIdSet.size === 1) {
        detailsObject.deliveryPriorityId = deliveryPriorityIdSet.values().next().value;
    } else if (deliveryPriorityIdSet.size > 1) {
        detailsObject.isMultipleDeliveryPrograms = true;
        detailsObject.isMultipleDeliveryPriorities = true;
    }
    if (pickupReferenceSet.size === 1) {
        detailsObject.pickupReference = pickupReferenceSet.values().next().value;
    } else if (pickupReferenceSet.size > 1) {
        detailsObject.isMultiplePickupReference = true;
    }
    if (pickupReferenceExpiryDateTimeSet.size === 1) {
        detailsObject.pickupReferenceExpiryDateTime = pickupReferenceExpiryDateTimeSet.values().next().value;
    } else if (pickupReferenceExpiryDateTimeSet.size > 1) {
        detailsObject.isMultiplePickupReferenceExpiryDateTime = true;
    }
    if (emptyReturnReferenceSet.size === 1) {
        detailsObject.emptyReturnReference = emptyReturnReferenceSet.values().next().value;
    } else if (emptyReturnReferenceSet.size > 1) {
        detailsObject.isMultipleEmptyReturnReference = true;
    }
    if (emptyReturnReferenceExpiryDateTimeSet.size === 1) {
        detailsObject.emptyReturnReferenceExpiryDateTime = emptyReturnReferenceExpiryDateTimeSet.values().next().value;
    } else if (emptyReturnReferenceExpiryDateTimeSet.size > 1) {
        detailsObject.isMultipleEmptyReturnReferenceExpiryDateTime = true;
    }
    if (specialProgramIdSet.size === 1) {
        detailsObject.specialProgramId = specialProgramIdSet.values().next().value;
    } else if (specialProgramIdSet.size > 1) {
        detailsObject.isMultipleSpecialPrograms = true;
    }

    if (gasCheckRequiredSet.size === 1) {
        detailsObject.gasCheckDetails.gasCheckRequired = gasCheckRequiredSet.values().next().value;
    } else if (gasCheckRequiredSet.size > 1) {
        detailsObject.gasCheckDetails.isMultipleGasCheckRequired = true;
    }
    detailsObject.gasCheckDetails.isDisabledGasCheckRequired = isGasCheckFieldDisabledFunction({ selectedRows, fieldValues: gasCheckRequiredSet });

    if (gasCheckResultSet.size === 1) {
        detailsObject.gasCheckDetails.gasCheckResult = gasCheckResultSet.values().next().value;
    } else if (gasCheckResultSet.size > 1) {
        detailsObject.gasCheckDetails.isMultipleGasCheckResult = true;
    }
    detailsObject.gasCheckDetails.isDisabledGasCheckResult = isGasCheckFieldDisabledFunction({ selectedRows, fieldValues: gasCheckResultSet });

    if (gasCheckRequestedBySet.size === 1) {
        detailsObject.gasCheckDetails.gasCheckRequestedBy = gasCheckRequestedBySet.values().next().value;
    } else if (gasCheckRequestedBySet.size > 1) {
        detailsObject.gasCheckDetails.isMultipleGasCheckRequestedBy = true;
    }
    detailsObject.gasCheckDetails.isDisabledGasCheckRequestedBy = isGasCheckFieldDisabledFunction({ selectedRows, fieldValues: gasCheckRequestedBySet });

    if (gasCheckRequestedDateSet.size === 1) {
        detailsObject.gasCheckDetails.gasCheckRequestedDate = gasCheckRequestedDateSet.values().next().value;
    } else if (gasCheckRequestedDateSet.size > 1) {
        detailsObject.gasCheckDetails.isMultipleGasCheckRequestedDate = true;
    }
    detailsObject.gasCheckDetails.isDisabledGasCheckRequestedDate = isGasCheckFieldDisabledFunction({ selectedRows, fieldValues: gasCheckRequestedDateSet });

    return detailsObject;
}

export const sortPriorities = (labelField: any, priorityLevelField: any) => (a: any, b: any) => {
    if (a[priorityLevelField] === b[priorityLevelField]) {
        return a[labelField] > b[labelField] ? 1 : -1;
    }

    return a[priorityLevelField] - b[priorityLevelField];
};

export function serializeBeCodes(locations: IFinalDeliveryLocation[]): string {
    return locations?.map((location) => location.beCode).join(',') || '';
}
