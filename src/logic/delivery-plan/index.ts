import { PlanningStatusEnum } from '@/static';
import { IFclListItem, ILclListItem } from '@/interfaces';

export function isDeliveryPlanModifiedByUser(object: IFclListItem | ILclListItem): boolean {
    const planningStatus: PlanningStatusEnum = object.planningStatus;
    return !(!planningStatus || planningStatus === PlanningStatusEnum.INITIAL || planningStatus === PlanningStatusEnum.READY_TO_PLAN);
}
