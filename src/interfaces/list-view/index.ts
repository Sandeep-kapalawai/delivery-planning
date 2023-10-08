export interface IFinalDeliveryLocationData {
    fdlName: string;
    fdlAddressLine1: string;
    fdlAddressLine2: string;
}

export interface IStatus {
    key: string;
    text: string;
    category?: string;
    id?: string;
}

export interface IPriority {
    key: string;
    text: string;
    secondaryText?: string;
    category?: string;
    priorityEllipse: boolean;
}

export type IFinalDeliveryLocation = {
    beCode: string;
    name: string;
    addressLines: string[];
};
