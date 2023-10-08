import { IFinalDeliveryLocation } from '@/interfaces/list-view';
export interface IData {
    finalDeliveryLocationLabel: {
        location: string;
        beCode: string;
        address: string;
        deliveryLocation: string;
        containerNumber: string;
    };
}

export interface IMethods {}

export interface IComputed {}

export interface IProps {
    index: number;
    cargoStuffingNumber: string;
    locations: IFinalDeliveryLocation[];
}
