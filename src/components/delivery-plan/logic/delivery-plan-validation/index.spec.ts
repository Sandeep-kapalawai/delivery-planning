import { validateDeliveryPlan } from '.';
import { IDeliveryPlanValidationParams, IDeliveryPlanValidationResult } from '../../interfaces';
import { ICargoStuffingDetails, IServicePlan, IServiceLeg } from '@/interfaces';
import { createMockCargoStuffingDetails, createMockServicePlan, createMockServiceLeg } from '@/mocks';

describe('delivery-plan delivery-plan-validation logic', () => {
    describe('validateDeliveryPlan', () => {
        describe('STOP_OFF_LOCATION_SHOULD_NOT_EQUAL_FINAL_DELIVERY_LOCATION', () => {
            it.each([
                {
                    scenario: 'WHEN isStopOffLocation is false, THEN it returns isValid as true',
                    details: createMockCargoStuffingDetails(),
                    deliveryPlan: createMockServicePlan({ isStopOffLocation: false }),
                    lastActiveDeliveryLeg: createMockServiceLeg(),
                    expectedOutput: { isValid: true },
                },
                {
                    scenario: 'WHEN customerFinalPlaceOfDeliveryFacilityCode is empty, THEN it returns isValid as true',
                    details: createMockCargoStuffingDetails({ customerFinalPlaceOfDeliveryFacilityCode: '' }),
                    deliveryPlan: createMockServicePlan({ isStopOffLocation: true }),
                    lastActiveDeliveryLeg: createMockServiceLeg(),
                    expectedOutput: { isValid: true },
                },
                {
                    scenario: 'WHEN lastActiveDeliveryLeg is empty, THEN it returns isValid as true',
                    details: createMockCargoStuffingDetails(),
                    deliveryPlan: createMockServicePlan({ isStopOffLocation: true }),
                    lastActiveDeliveryLeg: undefined as any,
                    expectedOutput: { isValid: true },
                },
                {
                    scenario: 'WHEN lastActiveDeliveryLeg.deliveryData is empty, THEN it returns isValid as true',
                    details: createMockCargoStuffingDetails(),
                    deliveryPlan: createMockServicePlan({ isStopOffLocation: true }),
                    lastActiveDeliveryLeg: createMockServiceLeg({ deliveryData: undefined as any }),
                    expectedOutput: { isValid: true },
                },
                {
                    scenario: 'WHEN lastActiveDeliveryLeg.deliveryData.deliveryAddress is empty, THEN it returns isValid as true',
                    details: createMockCargoStuffingDetails(),
                    deliveryPlan: createMockServicePlan({ isStopOffLocation: true }),
                    lastActiveDeliveryLeg: createMockServiceLeg({ deliveryData: { deliveryAddress: undefined as any } as any }),
                    expectedOutput: { isValid: true },
                },
                {
                    scenario: 'WHEN lastActiveDeliveryLeg.deliveryData.deliveryAddress.beCode is empty, THEN it returns isValid as true',
                    details: createMockCargoStuffingDetails(),
                    deliveryPlan: createMockServicePlan({ isStopOffLocation: true }),
                    lastActiveDeliveryLeg: createMockServiceLeg({ deliveryData: { deliveryAddress: { beCode: '' } } as any }),
                    expectedOutput: { isValid: true },
                },
                {
                    scenario:
                        'WHEN lastActiveDeliveryLeg.deliveryData.deliveryAddress.beCode is different than final delivery locations, THEN it returns isValid as true',
                    details: createMockCargoStuffingDetails({ customerFinalPlaceOfDeliveryFacilityCode: 'BE_CODE_1,BE_CODE_2' }),
                    deliveryPlan: createMockServicePlan({ isStopOffLocation: true }),
                    lastActiveDeliveryLeg: createMockServiceLeg({ deliveryData: { deliveryAddress: { beCode: 'BE_CODE_3' } } as any }),
                    expectedOutput: { isValid: true },
                },
                {
                    scenario:
                        'WHEN lastActiveDeliveryLeg.deliveryData.deliveryAddress.beCode is different than final delivery locations, THEN it returns isValid as false',
                    details: createMockCargoStuffingDetails({ customerFinalPlaceOfDeliveryFacilityCode: 'BE_CODE_1,BE_CODE_2' }),
                    deliveryPlan: createMockServicePlan({ isStopOffLocation: true }),
                    lastActiveDeliveryLeg: createMockServiceLeg({ deliveryData: { deliveryAddress: { beCode: 'BE_CODE_1' } } as any }),
                    expectedOutput: { isValid: false, error: 'MESSAGE.STOP_OFF_LOCATION_SHOULD_NOT_EQUAL_FINAL_DELIVERY_LOCATION_ERROR' },
                },
            ])(
                '$scenario',
                ({
                    scenario,
                    details,
                    deliveryPlan,
                    lastActiveDeliveryLeg,
                    expectedOutput,
                }: {
                    scenario: string;
                    details: ICargoStuffingDetails;
                    deliveryPlan: IServicePlan;
                    lastActiveDeliveryLeg: IServiceLeg;
                    expectedOutput: IDeliveryPlanValidationResult;
                }) => {
                    expect(
                        validateDeliveryPlan({ isSavePlanOperation: true, details, deliveryPlan, lastActiveDeliveryLeg } as IDeliveryPlanValidationParams),
                    ).toStrictEqual(expectedOutput);
                },
            );
        });
    });
});
