import i18n from '@/i18n';

export enum PlanningStatusEnum {
    INITIAL = 'INITIAL',
    READY_TO_PLAN = 'READY_TO_PLAN',
    PLANNING_IN_PROGRESS = 'PLANNING_IN_PROGRESS',
    PLANNING_IN_PROGRESS_INTERMODAL_PLANNED = 'PLANNING_IN_PROGRESS_INTERMODAL_PLANNED',
    PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING = 'PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING',
    PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED = 'PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED',
    FULL_TRANSPORT_PLAN_SENT = 'FULL_TRANSPORT_PLAN_SENT',
    RE_PLANNING_REQUIRED = 'RE_PLANNING_REQUIRED',
    PLANNING_COMPLETED = 'PLANNING_COMPLETED',
}

export function getPrimaryPlanningStatusDisplayName(planningStatus: PlanningStatusEnum): string {
    switch (planningStatus) {
        case PlanningStatusEnum.INITIAL:
            return i18n.t('PLANNING_STATUS.INITIAL').toString();
        case PlanningStatusEnum.READY_TO_PLAN:
            return i18n.t('PLANNING_STATUS.READY_TO_PLAN').toString();
        case PlanningStatusEnum.PLANNING_IN_PROGRESS:
        case PlanningStatusEnum.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED:
        case PlanningStatusEnum.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING:
        case PlanningStatusEnum.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED:
            return i18n.t('PLANNING_STATUS.PLANNING_IN_PROGRESS').toString();
        case PlanningStatusEnum.FULL_TRANSPORT_PLAN_SENT:
            return i18n.t('PLANNING_STATUS.FULL_TRANSPORT_PLAN_SENT').toString();
        case PlanningStatusEnum.RE_PLANNING_REQUIRED:
            return i18n.t('PLANNING_STATUS.RE_PLANNING_REQUIRED').toString();
        case PlanningStatusEnum.PLANNING_COMPLETED:
            return i18n.t('PLANNING_STATUS.PLANNING_COMPLETED').toString();
        default:
            return planningStatus;
    }
}

export function getSecondaryPlanningStatusDisplayName(planningStatus: PlanningStatusEnum): string {
    switch (planningStatus) {
        case PlanningStatusEnum.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED:
            return i18n.t('PLANNING_STATUS.PLANNING_IN_PROGRESS_INTERMODAL_PLANNED').toString();
        case PlanningStatusEnum.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING:
            return i18n.t('PLANNING_STATUS.PLANNING_IN_PROGRESS_AVAILABLE_FOR_PLANNING').toString();
        case PlanningStatusEnum.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED:
            return i18n.t('PLANNING_STATUS.PLANNING_IN_PROGRESS_DELIVERY_DETAILS_SUBMITTED').toString();
        default:
            return '';
    }
}
