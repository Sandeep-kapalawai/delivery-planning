import { mapCancelledServiceLegToDataRow, mapRejectedServiceLegToDataRow } from '.';
import { ServiceLegStatusEnum, ServiceLegTypeEnum } from '@/static';
import { IServiceLeg, SCMTableRowActionMethod } from '@/interfaces';
import { createMockServiceLeg } from '@/mocks';

describe('delivery-plan service-leg-mapping logic', () => {
    const copyLegActionMethod: SCMTableRowActionMethod = jest.fn(),
        undoCancelLegActionMethod: SCMTableRowActionMethod = jest.fn(),
        undoRejectLegActionMethod: SCMTableRowActionMethod = jest.fn();

    const copyLegAction = expect.objectContaining({
            icon: 'file-copy',
            tooltipText: 'DELIVERY_PLAN.COPY_LEG',
            actionMethod: copyLegActionMethod,
        }),
        undoCancelLegAction = expect.objectContaining({
            icon: 'arrow-curved-up-left',
            tooltipText: 'DELIVERY_PLAN.UNDO_CANCEL',
            actionMethod: undoCancelLegActionMethod,
        }),
        undoRejectLegAction = expect.objectContaining({
            icon: 'arrow-curved-up-left',
            tooltipText: 'DELIVERY_PLAN.UNDO_REJECT',
            actionMethod: undoRejectLegActionMethod,
        });

    describe('mapCancelledServiceLegToDataRow', () => {
        it('adds arrowRightIcon, copy leg and undo cancel action', () => {
            const leg: IServiceLeg = createMockServiceLeg({
                legType: ServiceLegTypeEnum.SERVICE_LEG,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
            });

            const mappedServiceLeg = mapCancelledServiceLegToDataRow(leg, { copyLegActionMethod, undoCancelLegActionMethod });

            expect(mappedServiceLeg.arrowRightIcon).toEqual('arrow-right');
            expect(mappedServiceLeg.rowActions).toEqual([copyLegAction, undoCancelLegAction]);
        });

        it('does not add undo cancel action if statusBeforeAction is undefined', () => {
            const leg: IServiceLeg = createMockServiceLeg({
                legType: ServiceLegTypeEnum.SERVICE_LEG,
                statusBeforeAction: undefined,
            });

            const mappedServiceLeg = mapCancelledServiceLegToDataRow(leg, { copyLegActionMethod, undoCancelLegActionMethod });

            expect(mappedServiceLeg.rowActions).toEqual([copyLegAction]);
        });

        it('does not add undo cancel action if statusBeforeAction is CANCELLED', () => {
            const leg: IServiceLeg = createMockServiceLeg({
                legType: ServiceLegTypeEnum.SERVICE_LEG,
                statusBeforeAction: ServiceLegStatusEnum.CANCELLED,
            });

            const mappedServiceLeg = mapCancelledServiceLegToDataRow(leg, { copyLegActionMethod, undoCancelLegActionMethod });

            expect(mappedServiceLeg.rowActions).toEqual([copyLegAction]);
        });

        it('does not add copy leg and undo cancel action if legType is EMPTY_RETURN_LEG', () => {
            const leg: IServiceLeg = createMockServiceLeg({
                legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
            });

            const mappedServiceLeg = mapCancelledServiceLegToDataRow(leg, { copyLegActionMethod, undoCancelLegActionMethod });

            expect(mappedServiceLeg.rowActions).toEqual([]);
        });
    });

    describe('mapRejectedServiceLegToDataRow', () => {
        it('adds arrowRightIcon, copy leg and undo cancel action', () => {
            const leg: IServiceLeg = createMockServiceLeg({
                legType: ServiceLegTypeEnum.SERVICE_LEG,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
            });

            const mappedServiceLeg = mapRejectedServiceLegToDataRow(leg, { copyLegActionMethod, undoRejectLegActionMethod });

            expect(mappedServiceLeg.arrowRightIcon).toEqual('arrow-right');
            expect(mappedServiceLeg.rowActions).toEqual([copyLegAction, undoRejectLegAction]);
        });

        it('does not add undo cancel action if statusBeforeAction is undefined', () => {
            const leg: IServiceLeg = createMockServiceLeg({
                legType: ServiceLegTypeEnum.SERVICE_LEG,
                statusBeforeAction: undefined,
            });

            const mappedServiceLeg = mapRejectedServiceLegToDataRow(leg, { copyLegActionMethod, undoRejectLegActionMethod });

            expect(mappedServiceLeg.rowActions).toEqual([copyLegAction]);
        });

        it('does not add undo cancel action if statusBeforeAction is REJECTED', () => {
            const leg: IServiceLeg = createMockServiceLeg({
                legType: ServiceLegTypeEnum.SERVICE_LEG,
                statusBeforeAction: ServiceLegStatusEnum.REJECTED,
            });

            const mappedServiceLeg = mapRejectedServiceLegToDataRow(leg, { copyLegActionMethod, undoRejectLegActionMethod });

            expect(mappedServiceLeg.rowActions).toEqual([copyLegAction]);
        });

        it('does not add copy leg and undo cancel action if legType is EMPTY_RETURN_LEG', () => {
            const leg: IServiceLeg = createMockServiceLeg({
                legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                statusBeforeAction: ServiceLegStatusEnum.SENT,
            });

            const mappedServiceLeg = mapRejectedServiceLegToDataRow(leg, { copyLegActionMethod, undoRejectLegActionMethod });

            expect(mappedServiceLeg.rowActions).toEqual([]);
        });
    });
});
