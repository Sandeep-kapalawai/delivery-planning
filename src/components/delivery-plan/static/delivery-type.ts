import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';
import { ServiceLegDeliveryTypeEnum, ServiceLegDeliveryTypeDisplayName } from '@/static';

export function getDeliveryTypeOptions(): Array<IButtonGroupSwitchOption> {
    return [ServiceLegDeliveryTypeEnum.LIVE_UNLOAD, ServiceLegDeliveryTypeEnum.DROP_AND_SWAP].map((value) => ({
        value,
        label: ServiceLegDeliveryTypeDisplayName[value],
    }));
}
