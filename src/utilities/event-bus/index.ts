import Vue from 'vue';
export const EventBus = new Vue();

export enum EventBusEventName {
    FETCH_LIST = 'FETCH_LIST',
    SCROLL_COMMENTS_SECTION_INTO_VIEW = 'SCROLL_COMMENTS_SECTION_INTO_VIEW',
}
