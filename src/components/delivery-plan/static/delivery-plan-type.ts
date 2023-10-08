import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';
import { DeliveryPlanTypeEnum, DeliveryPlanTypeDisplayName } from '@/static';

export function getDeliveryPlanTypeOptions(): Array<IButtonGroupSwitchOption> {
    return [DeliveryPlanTypeEnum.SINGLE_DROP, DeliveryPlanTypeEnum.MULTI_DROP].map((value) => ({
        value,
        label: DeliveryPlanTypeDisplayName[value],
    }));
}
