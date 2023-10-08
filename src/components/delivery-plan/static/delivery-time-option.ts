import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';
import { ServiceLegDeliveryTimeOptionEnum, ServiceLegDeliveryTimeOptionDisplayName } from '@/static';

export function getDeliveryTimeOptions(): Array<IButtonGroupSwitchOption> {
    return [ServiceLegDeliveryTimeOptionEnum.SPECIFIC_TIME, ServiceLegDeliveryTimeOptionEnum.TIME_SLOT].map((value) => ({
        value,
        label: ServiceLegDeliveryTimeOptionDisplayName[value],
    }));
}
