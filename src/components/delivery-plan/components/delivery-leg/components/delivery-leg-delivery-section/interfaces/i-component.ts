import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';
import { ICargoStuffingDetails, IServiceLeg, ILocationFullAddress } from '@/interfaces';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, ServiceLegDeliveryTimeOptionEnum, ServiceLegDeliveryTypeEnum } from '@/static';

export interface IData {}

export interface IMethods {
    setDeliveryTimeZoneAndOffset: ({ leg, location, date }: { leg: IServiceLeg; location?: ILocationFullAddress; date?: string | null }) => void;
    setDeliveryLocation: ({ leg, location }: { leg: IServiceLeg; location: ILocationFullAddress }) => void;
    setDeliveryOnDate: ({ leg, date }: { leg: IServiceLeg; date: string }) => void;
    setDeliveryTimeOption: ({ leg, deliveryTimeOption }: { leg: IServiceLeg; deliveryTimeOption: ServiceLegDeliveryTimeOptionEnum }) => void;
    setDeliveryFromTime: ({ leg, time }: { leg: IServiceLeg; time: string }) => void;
    setDeliveryToTime: ({ leg, time }: { leg: IServiceLeg; time: string }) => void;
    setDeliveryReference: ({ leg, deliveryReference }: { leg: IServiceLeg; deliveryReference: string }) => void;
    setDeliveryType: ({ leg, deliveryType }: { leg: IServiceLeg; deliveryType: ServiceLegDeliveryTypeEnum }) => void;
    getDeliveryPlanTimeValidationError: (errors: Record<string, string[]>) => string;
    validateDeliveryDateTimeFields: () => void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    isLegStatusSentOrAccepted: boolean;
    deliveryDateMinimumValue: Date;
    deliveryTimeOptions: Array<IButtonGroupSwitchOption>;
    deliveryTypeOptions: Array<IButtonGroupSwitchOption>;
    isDeliveryTimeRequired: boolean;
    isDeliveryTypeDisabled: boolean;
    isTimeSlotOptionSelected: boolean;
}

export interface IProps {
    details: { result: ICargoStuffingDetails };
    leg: IServiceLeg;
    disabled: boolean;
    legIndex: number;
}
