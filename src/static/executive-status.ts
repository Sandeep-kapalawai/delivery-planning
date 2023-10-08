import i18n from '@/i18n';

export enum PrimaryExecutiveStatus {
    DEPARTURE_PENDING = 'DEPARTURE_PENDING',
    IN_TRANSIT = 'IN_TRANSIT',
    VESSEL_ARRIVED = 'VESSEL_ARRIVED',
    UNLOADED_FROM_VESSEL = 'UNLOADED_FROM_VESSEL',
    AVAILABLE_FOR_DELIVERY = 'AVAILABLE_FOR_DELIVERY',
    INTERMODAL_IN_TRANSIT = 'INTERMODAL_IN_TRANSIT',
    AT_INLAND_TERMINAL = 'AT_INLAND_TERMINAL',
    DELIVERY_IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
    IN_STORAGE = 'IN_STORAGE',
    RETURN_TO_CARRIER = 'RETURN_TO_CARRIER',
    ARRIVED_AT_FINAL_PORT = 'ARRIVED_AT_FINAL_PORT',
    CARGO_DELIVERED = 'CARGO_DELIVERED',
    EMPTY_RETURNED = 'EMPTY_RETURNED',
}

export enum SecondaryExecutiveStatus {
    VESSEL_DEPARTURE = 'VESSEL_DEPARTURE',
    VESSEL_ARRIVAL = 'VESSEL_ARRIVAL',
    CARRIER_RELEASE = 'CARRIER_RELEASE',
    UNLOADED_FROM_VESSEL = 'UNLOADED_FROM_VESSEL',
    TERMINAL_READY = 'TERMINAL_READY',
    GATE_OUT = 'GATE_OUT',
    //#region Rail events
    LOADED_ON_RAIL = 'LOADED_ON_RAIL',
    RAIL_DEPARTURE_FROM_ORIGIN_INTERMODAL_RAMP = 'RAIL_DEPARTURE_FROM_ORIGIN_INTERMODAL_RAMP',
    RAIL_ARRIVAL_AT_DESTINATION_INTERMODAL_RAMP = 'RAIL_ARRIVAL_AT_DESTINATION_INTERMODAL_RAMP',
    UNLOADED_FROM_A_RAIL_CAR = 'UNLOADED_FROM_A_RAIL_CAR',
    //#endregion Rail events
    //#region Barge events
    LOADED_ON_BARGE = 'LOADED_ON_BARGE',
    BARGE_DEPARTURE = 'BARGE_DEPARTURE',
    BARGE_ARRIVAL = 'BARGE_ARRIVAL',
    UNLOADED_FROM_BARGE = 'UNLOADED_FROM_BARGE',
    //#endregion Barge events
    //#region Truck events
    INLAND_DEPOT_ARRIVAL = 'INLAND_DEPOT_ARRIVAL',
    INLAND_DEPOT_DEPARTURE = 'INLAND_DEPOT_DEPARTURE',
    STORAGE_LOCATION_ARRIVAL = 'STORAGE_LOCATION_ARRIVAL',
    STORAGE_LOCATION_DEPARTURE = 'STORAGE_LOCATION_DEPARTURE',
    ARRIVED_AT_DELIVERY_LOCATION_FULL = 'ARRIVED_AT_DELIVERY_LOCATION_FULL',
    DELIVERY_CONFIRMED = 'DELIVERY_CONFIRMED',
    EQUIPMENT_DE_RIGGED = 'EQUIPMENT_DE_RIGGED',
    READY_FOR_PICKUP = 'READY_FOR_PICKUP',
    //#endregion Truck events
    EMPTY_CONTAINER_RETURNED = 'EMPTY_CONTAINER_RETURNED',
}

export function getPrimaryExecutiveStatusDisplayName(primaryExecutiveStatus: PrimaryExecutiveStatus): string {
    switch (primaryExecutiveStatus) {
        case PrimaryExecutiveStatus.DEPARTURE_PENDING:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.DEPARTURE_PENDING').toString();
        case PrimaryExecutiveStatus.IN_TRANSIT:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.IN_TRANSIT').toString();
        case PrimaryExecutiveStatus.VESSEL_ARRIVED:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.VESSEL_ARRIVED').toString();
        case PrimaryExecutiveStatus.UNLOADED_FROM_VESSEL:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.UNLOADED_FROM_VESSEL').toString();
        case PrimaryExecutiveStatus.AVAILABLE_FOR_DELIVERY:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.AVAILABLE_FOR_DELIVERY').toString();
        case PrimaryExecutiveStatus.INTERMODAL_IN_TRANSIT:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.INTERMODAL_IN_TRANSIT').toString();
        case PrimaryExecutiveStatus.DELIVERY_IN_PROGRESS:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.DELIVERY_IN_PROGRESS').toString();

        case PrimaryExecutiveStatus.IN_STORAGE:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.IN_STORAGE').toString();
        case PrimaryExecutiveStatus.RETURN_TO_CARRIER:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.RETURN_TO_CARRIER').toString();
        case PrimaryExecutiveStatus.ARRIVED_AT_FINAL_PORT:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.ARRIVED_AT_FINAL_PORT').toString();
        case PrimaryExecutiveStatus.AT_INLAND_TERMINAL:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.AT_INLAND_TERMINAL').toString();
        case PrimaryExecutiveStatus.CARGO_DELIVERED:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.CARGO_DELIVERED').toString();
        case PrimaryExecutiveStatus.EMPTY_RETURNED:
            return i18n.t('PRIMARY_EXECUTIVE_STATUS.EMPTY_RETURNED').toString();

        default:
            return primaryExecutiveStatus;
    }
}

export function getSecondaryExecutiveStatusDisplayName(secondaryExecutiveStatus: SecondaryExecutiveStatus): string {
    switch (secondaryExecutiveStatus) {
        case SecondaryExecutiveStatus.VESSEL_DEPARTURE:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.VESSEL_DEPARTURE').toString();
        case SecondaryExecutiveStatus.VESSEL_ARRIVAL:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.VESSEL_ARRIVAL').toString();
        case SecondaryExecutiveStatus.CARRIER_RELEASE:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.CARRIER_RELEASE').toString();
        case SecondaryExecutiveStatus.UNLOADED_FROM_VESSEL:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.UNLOADED_FROM_VESSEL').toString();
        case SecondaryExecutiveStatus.TERMINAL_READY:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.TERMINAL_READY').toString();
        case SecondaryExecutiveStatus.GATE_OUT:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.GATE_OUT').toString();
        //#region Rail events
        case SecondaryExecutiveStatus.LOADED_ON_RAIL:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.LOADED_ON_RAIL').toString();
        case SecondaryExecutiveStatus.RAIL_DEPARTURE_FROM_ORIGIN_INTERMODAL_RAMP:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.RAIL_DEPARTURE_FROM_ORIGIN_INTERMODAL_RAMP').toString();
        case SecondaryExecutiveStatus.RAIL_ARRIVAL_AT_DESTINATION_INTERMODAL_RAMP:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.RAIL_ARRIVAL_AT_DESTINATION_INTERMODAL_RAMP').toString();
        case SecondaryExecutiveStatus.UNLOADED_FROM_A_RAIL_CAR:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.UNLOADED_FROM_A_RAIL_CAR').toString();
        //#endregion Rail events
        //#region Barge events
        case SecondaryExecutiveStatus.LOADED_ON_BARGE:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.LOADED_ON_BARGE').toString();
        case SecondaryExecutiveStatus.BARGE_DEPARTURE:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.BARGE_DEPARTURE').toString();
        case SecondaryExecutiveStatus.BARGE_ARRIVAL:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.BARGE_ARRIVAL').toString();
        case SecondaryExecutiveStatus.UNLOADED_FROM_BARGE:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.UNLOADED_FROM_BARGE').toString();
        //#endregion Barge events
        //#region Truck events
        case SecondaryExecutiveStatus.INLAND_DEPOT_ARRIVAL:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.INLAND_DEPOT_ARRIVAL').toString();
        case SecondaryExecutiveStatus.INLAND_DEPOT_DEPARTURE:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.INLAND_DEPOT_DEPARTURE').toString();
        case SecondaryExecutiveStatus.STORAGE_LOCATION_ARRIVAL:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.STORAGE_LOCATION_ARRIVAL').toString();
        case SecondaryExecutiveStatus.STORAGE_LOCATION_DEPARTURE:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.STORAGE_LOCATION_DEPARTURE').toString();
        case SecondaryExecutiveStatus.ARRIVED_AT_DELIVERY_LOCATION_FULL:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.ARRIVED_AT_DELIVERY_LOCATION_FULL').toString();
        case SecondaryExecutiveStatus.DELIVERY_CONFIRMED:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.DELIVERY_CONFIRMED').toString();
        case SecondaryExecutiveStatus.EQUIPMENT_DE_RIGGED:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.EQUIPMENT_DE_RIGGED').toString();
        case SecondaryExecutiveStatus.READY_FOR_PICKUP:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.READY_FOR_PICKUP').toString();
        //#endregion Truck events
        case SecondaryExecutiveStatus.EMPTY_CONTAINER_RETURNED:
            return i18n.t('SECONDARY_EXECUTIVE_STATUS.EMPTY_CONTAINER_RETURNED').toString();
        default:
            return secondaryExecutiveStatus;
    }
}
