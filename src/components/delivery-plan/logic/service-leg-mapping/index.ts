import i18n from '@/i18n';
import { ServiceLegStatusEnum, ServiceLegTypeEnum } from '@/static';
import { IServiceLeg, SCMTableRowAction, SCMTableRowActionMethod } from '@/interfaces';
import { IServiceLegDataRow } from '../../interfaces';

function COPY_LEG_ACTION(options?: Partial<SCMTableRowAction>): SCMTableRowAction {
    return {
        icon: 'file-copy',
        category: 'new',
        interactive: true,
        tooltipText: i18n.t('DELIVERY_PLAN.COPY_LEG').toString(),
        ...options,
    };
}

function UNDO_CANCEL_ACTION(options?: Partial<SCMTableRowAction>): SCMTableRowAction {
    return {
        icon: 'arrow-curved-up-left',
        category: 'intermediate',
        interactive: true,
        tooltipText: i18n.t('DELIVERY_PLAN.UNDO_CANCEL').toString(),
        ...options,
    };
}

function UNDO_REJECT_ACTION(options?: Partial<SCMTableRowAction>): SCMTableRowAction {
    return {
        icon: 'arrow-curved-up-left',
        category: 'intermediate',
        interactive: true,
        tooltipText: i18n.t('DELIVERY_PLAN.UNDO_REJECT').toString(),
        ...options,
    };
}

export function mapCancelledServiceLegToDataRow(
    leg: IServiceLeg,
    { copyLegActionMethod, undoCancelLegActionMethod }: { copyLegActionMethod: SCMTableRowActionMethod; undoCancelLegActionMethod: SCMTableRowActionMethod },
): IServiceLegDataRow {
    const rowActions = [];
    if (leg.legType === ServiceLegTypeEnum.SERVICE_LEG) {
        rowActions.push(COPY_LEG_ACTION({ actionMethod: copyLegActionMethod }));

        if (leg.statusBeforeAction && leg.statusBeforeAction !== ServiceLegStatusEnum.CANCELLED) {
            rowActions.push(UNDO_CANCEL_ACTION({ actionMethod: undoCancelLegActionMethod }));
        }
    }

    return { ...leg, arrowRightIcon: 'arrow-right', rowActions };
}

export function mapRejectedServiceLegToDataRow(
    leg: IServiceLeg,
    { copyLegActionMethod, undoRejectLegActionMethod }: { copyLegActionMethod: SCMTableRowActionMethod; undoRejectLegActionMethod: SCMTableRowActionMethod },
): IServiceLegDataRow {
    const rowActions = [];
    if (leg.legType === ServiceLegTypeEnum.SERVICE_LEG) {
        rowActions.push(COPY_LEG_ACTION({ actionMethod: copyLegActionMethod }));

        if (leg.statusBeforeAction && leg.statusBeforeAction !== ServiceLegStatusEnum.REJECTED) {
            rowActions.push(UNDO_REJECT_ACTION({ actionMethod: undoRejectLegActionMethod }));
        }
    }

    return { ...leg, arrowRightIcon: 'arrow-right', rowActions };
}
