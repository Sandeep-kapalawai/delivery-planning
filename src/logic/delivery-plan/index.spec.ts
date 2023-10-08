import { isDeliveryPlanModifiedByUser } from '.';
import { PlanningStatusEnum } from '@/static';

describe('delivery plan id logic', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('isDeliveryPlanModifiedByUser', () => {
        it.each([
            [undefined, false],
            [PlanningStatusEnum.INITIAL, false],
            [PlanningStatusEnum.READY_TO_PLAN, false],
            [PlanningStatusEnum.PLANNING_IN_PROGRESS, true],
            [PlanningStatusEnum.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED, true],
            [PlanningStatusEnum.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING, true],
            [PlanningStatusEnum.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED, true],
            [PlanningStatusEnum.FULL_TRANSPORT_PLAN_SENT, true],
            [PlanningStatusEnum.RE_PLANNING_REQUIRED, true],
            [PlanningStatusEnum.PLANNING_COMPLETED, true],
        ])('for planning status: %s, returns: %s', (planningStatus: undefined | PlanningStatusEnum, expectedOutput: boolean) => {
            expect(isDeliveryPlanModifiedByUser({ planningStatus } as any)).toEqual(expectedOutput);
        });
    });
});
