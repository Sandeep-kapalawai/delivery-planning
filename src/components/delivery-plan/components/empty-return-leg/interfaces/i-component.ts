import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';
import { ICargoStuffingDetails, IServicePlan, IServiceLeg, ILocationFullAddress, ITransportProvider } from '@/interfaces';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, ServiceLegDeliveryTimeOptionEnum } from '@/static';

export interface IData {
    isSameAsPickupLocation: boolean;
    isSameAsLastLegProvider: boolean;
};

export interface IMethods {
    setDeliveryTimeZoneAndOffset: ({ leg, location, date }: { leg: IServiceLeg; location?: ILocationFullAddress; date?: string | null }) => void;
    setDeliveryLocation: ({ leg, location }: { leg: IServiceLeg; location: ILocationFullAddress }) => void;
    setDeliveryOnDate: ({ leg, date }: { leg: IServiceLeg; date: string }) => void;
    setDeliveryTimeOption: ({ leg, deliveryTimeOption }: { leg: IServiceLeg; deliveryTimeOption: ServiceLegDeliveryTimeOptionEnum }) => void;
    setDeliveryFromTime: ({ leg, time }: { leg: IServiceLeg; time: string }) => void;
    setDeliveryToTime: ({ leg, time }: { leg: IServiceLeg; time: string }) => void;
    setTransportProvider: ({ leg, provider }: { leg: IServiceLeg; provider?: ITransportProvider }) => void;
    setAdditionalInstruction: ({ leg, additionalInstruction }: { leg: IServiceLeg; additionalInstruction: string }) => void;
    validateCollectionDateTimeFields: () => void;
    getDeliveryPlanTimeValidationError: (errors: Record<string, string[]>) => string;
    checkAndSetIsSameAsPickupLocation: () => void;
    checkAndSetIsSameAsLastLegProvider: () => void;
    setEmptyReturnLocationFromFirstLeg: () => void;
    setEmptyReturnProviderFromLastLeg: () => void;
    onSameAsPickupLocationChange: (event: CustomEvent) => void;
    onSameAsLastLegProviderChange: (event: CustomEvent) => void;
    onEmptyReturnLocationChange: (location: ILocationFullAddress) => void;
    onEmptyReturnProviderChange: (provider: ITransportProvider) => void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    isLegSent: boolean;
    emptyReturnReference: string;
    emptyReturnReferenceExpiry: string;
    deliveryDateMinimumValue: Date;
    deliveryTimeOptions: Array<IButtonGroupSwitchOption>;
    firstActiveLegPickupAddress: { beCode?: string; displayName?: string; displayText?: string };
    lastActiveLegTransportProvider: { providerName?: string; providerBECode?: string };
    isTimeSlotOptionSelected: boolean;
}

export interface IProps {
    details: { result: ICargoStuffingDetails };
    deliveryPlan: { response: IServicePlan };
    leg: IServiceLeg;
    firstActiveLeg: IServiceLeg;
    lastActiveLeg: IServiceLeg;
}
