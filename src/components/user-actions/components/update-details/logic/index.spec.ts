import { getFormDataforMultiSelect, serializeBeCodes, sortPriorities } from '.';
import { IUpdateDetails } from '../interfaces';
import { GasCheckResultsEnum } from '@/static';
import { IFclListItem, ILclListItem, IFinalDeliveryLocation } from '@/interfaces';

describe('update details logic', () => {
    describe('getFormDataforMultiSelect', () => {
        it('getFormDataforMultiSelect returns $expectedResult when passed with more than one selected row', () => {
            const selectedRows: Map<string | number, IFclListItem | ILclListItem> = new Map([
                ['TEST_DELIVERY_PLAN_ID_1', { deliveryPlanId: 'TEST_DELIVERY_PLAN_ID_1', cargoStuffingId: 643 } as IFclListItem],
                ['TEST_DELIVERY_PLAN_ID_2', { deliveryPlanId: 'TEST_DELIVERY_PLAN_ID_2', cargoStuffingId: 645 } as IFclListItem],
            ]);
            const updateDetailsRows: Array<IUpdateDetails> = [
                {
                    cargoStuffingId: 643,
                    pickupReference: 'TEST_PICKUPREFERENCE-1',
                    pickupReferenceExpiryDateTime: '2023-02-16T00:00:00',
                    deliveryPriorityId: 55,
                    specialProgramId: 'TEST_PROGRAM_1',
                    emptyReturnReference: 'TEST_EMPTYRETURNREFERENCE_1',
                    emptyReturnReferenceExpiryDateTime: '2023-02-16T00:00:00',
                    gasCheckDetails: {
                        gasCheckRequired: true,
                        gasCheckResult: GasCheckResultsEnum.PASS,
                        gasCheckRequestedBy: 'Claus',
                        gasCheckRequestedDate: '2023-06-07',
                    },
                } as IUpdateDetails,
                {
                    cargoStuffingId: 645,
                    pickupReference: 'TEST_PICKUPREFERENCE-2',
                    pickupReferenceExpiryDateTime: '2023-02-17T00:00:00',
                    deliveryPriorityId: 56,
                    specialProgramId: 'TEST_PROGRAM_2',
                    emptyReturnReference: 'TEST_EMPTYRETURNREFERENCE_2',
                    emptyReturnReferenceExpiryDateTime: '2023-02-17T00:00:00',
                    gasCheckDetails: {
                        gasCheckRequired: false,
                        gasCheckResult: undefined,
                        gasCheckRequestedBy: '',
                        gasCheckRequestedDate: '',
                    },
                } as IUpdateDetails,
            ];

            expect(getFormDataforMultiSelect(updateDetailsRows, selectedRows)).toStrictEqual({
                deliveryPriorityId: '',
                emptyReturnReference: '',
                emptyReturnReferenceExpiryDateTime: '',
                isMultipleDeliveryPrograms: true,
                isMultipleDeliveryPriorities: true,
                isMultipleEmptyReturnReference: true,
                isMultipleEmptyReturnReferenceExpiryDateTime: true,
                isMultiplePickupReference: true,
                isMultiplePickupReferenceExpiryDateTime: true,
                isMultipleSpecialPrograms: true,
                pickupReference: '',
                pickupReferenceExpiryDateTime: '',
                specialProgramId: '',
                gasCheckDetails: {
                    gasCheckRequired: undefined,
                    gasCheckResult: undefined,
                    gasCheckRequestedBy: '',
                    gasCheckRequestedDate: '',
                    isDisabledGasCheckRequestedBy: true,
                    isDisabledGasCheckRequestedDate: true,
                    isDisabledGasCheckRequired: true,
                    isDisabledGasCheckResult: true,
                    isMultipleGasCheckRequestedBy: true,
                    isMultipleGasCheckRequestedDate: true,
                    isMultipleGasCheckRequired: true,
                    isMultipleGasCheckResult: true,
                },
            });
        });

        it('getFormDataforMultiSelect returns $expectedResult when passed with one selected row', () => {
            const selectedRows: Map<string | number, IFclListItem | ILclListItem> = new Map([
                ['TEST_DELIVERY_PLAN_ID_1', { deliveryPlanId: 'TEST_DELIVERY_PLAN_ID_1', cargoStuffingId: 643 } as IFclListItem],
            ]);
            const updateDetailsRows: Array<IUpdateDetails> = [
                {
                    cargoStuffingId: 643,
                    pickupReference: 'TEST_PICKUPREFERENCE',
                    pickupReferenceExpiryDateTime: '2023-02-16T00:00:00',
                    deliveryPriorityId: 123,
                    specialProgramId: 'TEST_PROGRAM',
                    emptyReturnReference: 'TEST_EMPTYRETURNREFERENCE',
                    emptyReturnReferenceExpiryDateTime: '2023-02-16T00:00:00',
                    gasCheckDetails: {
                        gasCheckRequired: true,
                        gasCheckResult: GasCheckResultsEnum.PASS,
                        gasCheckRequestedBy: 'Claus',
                        gasCheckRequestedDate: '2023-06-07',
                    },
                } as IUpdateDetails,
            ];

            expect(getFormDataforMultiSelect(updateDetailsRows, selectedRows)).toStrictEqual({
                deliveryPriorityId: 123,
                emptyReturnReference: 'TEST_EMPTYRETURNREFERENCE',
                emptyReturnReferenceExpiryDateTime: '2023-02-16T00:00:00',
                isMultipleDeliveryPrograms: false,
                isMultipleDeliveryPriorities: false,
                isMultipleEmptyReturnReference: false,
                isMultipleEmptyReturnReferenceExpiryDateTime: false,
                isMultiplePickupReference: false,
                isMultiplePickupReferenceExpiryDateTime: false,
                isMultipleSpecialPrograms: false,
                pickupReference: 'TEST_PICKUPREFERENCE',
                pickupReferenceExpiryDateTime: '2023-02-16T00:00:00',
                specialProgramId: 'TEST_PROGRAM',
                gasCheckDetails: {
                    gasCheckRequired: true,
                    gasCheckResult: GasCheckResultsEnum.PASS,
                    gasCheckRequestedBy: 'Claus',
                    gasCheckRequestedDate: '2023-06-07',
                    isDisabledGasCheckRequestedBy: false,
                    isDisabledGasCheckRequestedDate: false,
                    isDisabledGasCheckRequired: false,
                    isDisabledGasCheckResult: false,
                    isMultipleGasCheckRequestedBy: false,
                    isMultipleGasCheckRequestedDate: false,
                    isMultipleGasCheckRequired: false,
                    isMultipleGasCheckResult: false,
                },
            });
        });
    });

    describe('sortPriorities', () => {
        it('sortPriorities returns $expectedResult when prirority levels are not equal', () => {
            expect(
                sortPriorities('label', 'priorityLevel')(
                    {
                        value: 63,
                        label: 'Purple Sunday',
                        priorityLevel: 3,
                    },
                    {
                        value: 68,
                        label: 'Black Friday L4',
                        priorityLevel: 4,
                    },
                ),
            ).toStrictEqual(-1);
        });
        it('sortPriorities returns $expectedResult when prirority levels are  equal', () => {
            expect(
                sortPriorities('label', 'priorityLevel')(
                    {
                        value: 63,
                        label: 'Purple Sunday',
                        priorityLevel: 3,
                    },
                    {
                        value: 68,
                        label: 'Black Friday L4',
                        priorityLevel: 3,
                    },
                ),
            ).toStrictEqual(1);
        });
        it('sortPriorities returns $expectedResult when prirority levels are  equal and passed with different args', () => {
            expect(sortPriorities('label', 'priorityLevel')('label', 'priorityLevel')).toStrictEqual(-1);
        });
    });

    describe('serializeBeCodes', () => {
        const TEST_FINAL_DELIVERY_LOCATIONS: IFinalDeliveryLocation[] = [
            { beCode: 'TEST_LOCATION_1', name: 'Test City 1', addressLines: ['Address Line 1', 'Address Line 2', 'Address Line 3'] },
            { beCode: 'TEST_LOCATION_2', name: 'Test City 2', addressLines: ['Address Line 1', 'Address Line 2'] },
        ];

        it('returns an empty string if the input is undefined', () => {
            const result = serializeBeCodes(undefined as any);

            expect(result).toEqual('');
        });

        it('serializes BE codes correctly', () => {
            const expectedResult = 'TEST_LOCATION_1,TEST_LOCATION_2';

            const result = serializeBeCodes(TEST_FINAL_DELIVERY_LOCATIONS);

            expect(result).toEqual(expectedResult);
        });
    });
});
