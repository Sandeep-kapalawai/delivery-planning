import Vue from 'vue';
export const FilterEventBus = new Vue();

export enum FilterEventBusEventName {
    FILTER_CLEAR = 'FILTER_CLEAR',
}
