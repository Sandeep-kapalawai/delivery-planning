import { IServicePlan } from '@/interfaces';
import { DeliveryPlanTypeEnum } from '@/static';
import { IButtonGroupSwitchOption } from '@/components/button-group-switch/interfaces';

export interface IData {}

export interface IMethods {
    setDeliveryPlanType: ({ plan, deliveryPlanType }: { plan: IServicePlan; deliveryPlanType: DeliveryPlanTypeEnum }) => void;
}

export interface IComputed {
    deliveryPlanTypeOptions: Array<IButtonGroupSwitchOption>;
}

export interface IProps {
    deliveryPlan: {
        response: IServicePlan;
    };
}
