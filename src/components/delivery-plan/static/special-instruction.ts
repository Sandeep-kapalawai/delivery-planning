import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';
import { ServiceLegSpecialInstructionEnum, ServiceLegSpecialInstructionDisplayName } from '@/static';

export function getSpecialInstructionOptions(): Array<IButtonGroupSwitchOption> {
    return [ServiceLegSpecialInstructionEnum.NONE, ServiceLegSpecialInstructionEnum.PRE_PULL, ServiceLegSpecialInstructionEnum.OFF_DOCK_STORAGE].map((value) => ({
        value,
        label: ServiceLegSpecialInstructionDisplayName[value],
    }));
}
