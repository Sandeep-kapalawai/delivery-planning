import { ICargoStuffingDetails, IServicePlan, IServiceLeg, ILocationFullAddress } from '@/interfaces';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, ServiceLegSpecialInstructionEnum } from '@/static';
import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';

export interface IData {}

export interface IMethods {
    setPickupTimeZoneAndOffset: ({ leg, location, date }: { leg: IServiceLeg; location?: ILocationFullAddress; date?: string | null }) => void;
    setPickupLocation: ({ leg, location }: { leg: IServiceLeg; location: ILocationFullAddress }) => void;
    setPickupOnDate: ({ leg, date }: { leg: IServiceLeg; date: string }) => void;
    setPickupFromTime: ({ leg, time }: { leg: IServiceLeg; time: string }) => void;
    setSpecialInstruction: ({ leg, specialInstruction }: { leg: IServiceLeg; specialInstruction: ServiceLegSpecialInstructionEnum }) => void;
    validatePickupDateTimeFields: () => void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    isLegStatusSentOrAccepted: boolean;
    isPickupDateRequired: boolean;
    pickupDateMinimumValue: Date;
    specialInstructionOptions: Array<IButtonGroupSwitchOption>;
    lastFreeDate: string;
    pickupReferenceExpiry: string;
    pickupReference: string;
}

export interface IProps {
    details: { result: ICargoStuffingDetails };
    deliveryPlan: { response: IServicePlan };
    leg: IServiceLeg;
    legIndex: number;
    isFirstLeg: boolean;
    disabled: boolean;
}
