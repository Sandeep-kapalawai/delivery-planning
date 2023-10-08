import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, ServicePlanTransportModeEnum } from '@/static';
import { IServiceLeg, ITransportProvider } from '@/interfaces';
import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';

export interface IData {}

export interface IMethods {
    setTransportMode: ({ leg, transportMode }: { leg: IServiceLeg; transportMode: ServicePlanTransportModeEnum }) => void;
    setTransportProvider: ({ leg, provider }: { leg: IServiceLeg; provider?: ITransportProvider }) => void;
    setAdditionalInstruction: ({ leg, additionalInstruction }: { leg: IServiceLeg; additionalInstruction: string }) => void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    transportModeOptions: Array<IButtonGroupSwitchOption>;
}

export interface IProps {
    leg: IServiceLeg;
    legIndex: number;
    isLegSent: boolean;
    disabled: boolean;
}
