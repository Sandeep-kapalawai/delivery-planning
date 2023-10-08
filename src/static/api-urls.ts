const BASE_URL = '/delivery-planning-cca';

export const API_URLS = {
    // Autocomplete URLs
    GET_LOCATION_FULL_ADDRESS: () => `${BASE_URL}/autocomplete/location-full-address`,
    GET_PARTIES: () => `${BASE_URL}/autocomplete/parties`,
    GET_FILTERS_AUTOCOMPLETE: () => `${BASE_URL}/autocomplete/filters`,
    // Customer URLs
    GET_CUSTOMER_CONFIGURATIONS: (customerBECode: string) => `${BASE_URL}/customer-configurations/${customerBECode}`,
    GET_CUSTOMERS: () => `${BASE_URL}/customers`,
    // List View URLs
    GET_FCL_LIST: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings`,
    GET_FCL_TRANSPORT_DOCUMENTS: (deliveryPlanId: number | string) => `${BASE_URL}/cargo-stuffings/${deliveryPlanId}/transport-documents`,
    GET_LCL_LIST: () => `${BASE_URL}/shipments/less-than-container-loads/transport-documents`,
    // Excel Export Import URLs
    IMPORT_SERVICE_PLAN: () => `${BASE_URL}/service-plans/import`,
    GET_CSA_FCL_EXPORT_BULK_EDIT: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings/export/bulk-edit`,
    GET_CSA_FCL_EXPORT_SELECTED_COLUMNS: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings/export/selectedcolumns`,
    GET_CSA_FCL_EXPORT_ALL: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings/export`,
    GET_CONSIGNEE_FCL_EXPORT_BULK_EDIT: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings/consigneeInput/export/bulk-edit`,
    GET_CONSIGNEE_FCL_EXPORT_ALL: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings/consigneeInput/export`,
    // Purchase Orders List
    GET_PO_LIST: () => `${BASE_URL}/shipments/customer-order-lines`,
    // Details View URLs
    GET_FCL_CARGO_STUFFING_DETAILS: (deliveryPlanId: number | string) => `${BASE_URL}/cargo-stuffings/${deliveryPlanId}`,
    ADD_COMMENT: () => `${BASE_URL}/comments`,
    GET_COMMENTS: (deliveryPlanId: number | string) => `${BASE_URL}/comments/CargoStuffing/${deliveryPlanId}`,
    //User Actions URL's
    GET_DELIVERY_PROGRAMS: () => `${BASE_URL}/priorities/delivery-programs/cargo-stuffing`,
    GET_SPECIAL_PROGRAMS: () => `${BASE_URL}/special-programs/cargo-stuffing`,
    GET_UPDATE_CARGO_STUFFING_DETAILS: () => `${BASE_URL}/cargo-stuffings/update-details`,
    // Delivery Plan URLs:
    GET_UPDATE_FCL_SERVICE_PLANS: (deliveryPlanId: number | string) => `${BASE_URL}/service-plans/${deliveryPlanId}`,
    GET_UPDATE_CUSTOMIZABLE_FIELD: () => `${BASE_URL}/customizable-field`,
    // Delivery Order's :
    GET_DELIVERYORDERS: () => `${BASE_URL}/transport-plans`,
    GET_REASONCODES: () => `${BASE_URL}/reason-codes`,
    // User details URLs
    GET_USER_DETAILS: () => `${BASE_URL}/user-details`,
    // User preferences
    GET_POST_SAVED_FILTERS: () => `${BASE_URL}/user-preferences/filters`,
    UPDATE_SAVED_FILTERS: (filterId: string) => `${BASE_URL}/user-preferences/filters/${filterId}`,
    UPDATE_DEFAULT_FILTER: (filterId: string) => `${BASE_URL}/user-preferences/default-filter/${filterId}`,
    FAVOURITES: () => '/favourites/favourites',

    // Tiles (Quick Filters)
    GET_PRIORITY_LEVELS: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings/priority-level-groups`,
    GET_LASTFREEDAYS: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings/last-free-day-groups`,
    GET_PLANNINGSTATUS_TILES: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings/planning-status-groups`,
    GET_EXECUTIONSTATUS_TILES: () => `${BASE_URL}/shipments/full-container-loads/cargo-stuffings/execution-status-groups`,
};
