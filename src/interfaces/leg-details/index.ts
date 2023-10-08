import { ServicePlanTransportModeEnum } from '@/static';

export interface ILegDetails {
    dropOffLocation: string;
    pickUpLocation: string;
    sequence: number;
    transportMode: ServicePlanTransportModeEnum;
    transportProvider: string;
}
