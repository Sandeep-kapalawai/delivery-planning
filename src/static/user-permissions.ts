/**
 * We are only considering external users for user group name check
 */
export enum UserPermissionUserGroupNameEnum {
    SCMDestinationCustomerService = 'SCM Destination Customer Service',
    SCMConsignee = 'SCMConsignee',
}

export enum UserPermissionV3BusinessCapabilityEnum {
    Destination_Delivery_Planning = 'Destination (Delivery Planning)',
}

export enum UserPermissionV3Enum {
    Read = 'Read',
    Edit = 'Edit',
    Execute = 'Execute',
}
