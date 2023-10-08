import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';
import { ServicePlanTransportModeEnum, ServicePlanTransportModeDisplayName } from '@/static';

export function getTransportModeOptions(): Array<IButtonGroupSwitchOption> {
    return [
        { value: ServicePlanTransportModeEnum.ROAD, disabled: false },
        { value: ServicePlanTransportModeEnum.RAIL, disabled: false },
        { value: ServicePlanTransportModeEnum.BARGE, disabled: false },
    ].map(({ value, disabled }: { value: ServicePlanTransportModeEnum; disabled?: boolean }) => ({
        value,
        disabled,
        label: ServicePlanTransportModeDisplayName[value],
    }));
}
