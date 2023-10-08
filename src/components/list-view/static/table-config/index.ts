import { SCMTableColDef } from '@/interfaces/scm-table';

import { validateAccessForUserGroupsV3, formatValueIfEmpty, getFormattedDate, getFormattedTime, getFormattedDateTime } from 'destination/utilities';
import i18n from '@/i18n';
import {
    ListViewTypeEnum,
    getPrimaryExecutiveStatusDisplayName,
    getSecondaryExecutiveStatusDisplayName,
    UserPermissionUserGroupNameEnum,
    getDemurrageAndDetentionStatusName,
    getSourceDisplayName,
    getCustomsStatusDisplayName,
} from '@/static';
import { listViewTypeSpecificAction } from '@/logic';

export function getDefaultColDef({ listViewType }: { listViewType: ListViewTypeEnum }): SCMTableColDef {
    return listViewTypeSpecificAction<SCMTableColDef>(listViewType, {
        [ListViewTypeEnum.fcl]: () => {
            return {
                flex: 1,
                minWidth: 100,
                hide: false,
                sortable: true,
                resizable: true,
                pinned: false,
                comparator: () => 0,
            };
        },
        [ListViewTypeEnum.lcl]: () => {
            return {
                flex: 1,
                minWidth: 100,
                hide: false,
                sortable: true,
                resizable: true,
                pinned: false,
                comparator: () => 0,
            };
        },
    });
}

export function getColumnDefs({ listViewType }: { listViewType: ListViewTypeEnum }): Array<SCMTableColDef> {
    return listViewTypeSpecificAction<Array<SCMTableColDef>>(listViewType, {
        [ListViewTypeEnum.fcl]: () => {
            return [
                MainTableColumns.CHECKBOX_COLUMN,
                MainTableColumns.EQUIPMENT_NUMBER_COLUMN,
                MainTableColumns.SHIPMENT_STATUS,
                MainTableColumns.PLANNING_STATUS,
                MainTableColumns.BL_NUMBER_COLUMN,
                MainTableColumns.PO_COLUMN,
                MainTableColumns.POD_COLUMN,
                MainTableColumns.VESSEL_VOYAGE_COLUMN,
                MainTableColumns.ETD_COLUMN,
                MainTableColumns.ETA_COLUMN,
                MainTableColumns.ATA_COLUMN,
                MainTableColumns.FDL_COLUMN,
                MainTableColumns.CONSIGNEE,
                MainTableColumns.PRIORITY_COLUMN,
                MainTableColumns.PICK_UP_REF_COLUMN,
                MainTableColumns.EMPTY_RETURN_REF_COLUMN,
                MainTableColumns.LAST_FREE_DATE_DEMURRAGE,
                MainTableColumns.LAST_FREE_DATE_DETENTION,
                MainTableColumns.GAS_CHECK_COLUMN,
                MainTableColumns.SOURCE_COLUMN,
                MainTableColumns.LAST_UPDATED_BY_COLUMN,
                MainTableColumns.TRANSPORT_PROVIDER,
                // For Consginee role
                MainTableColumns.DELIVERY_REFERENCE_DATE_TIME,
                MainTableColumns.CUSTOMS_CLEARANCE_STATUS_DATE_TIME,
                MainTableColumns.IN_LAND_DEPOT_ARRIVAL_LOCATION_DATE,
            ].filter((column: SCMTableColDef) => validateAccessForUserGroupsV3(column.allowAccessForUserGroups));
        },
        [ListViewTypeEnum.lcl]: () => {
            return [
                MainTableColumns.CHECKBOX_COLUMN,
                MainTableColumns.EQUIPMENT_NUMBER_COLUMN,
                MainTableColumns.SHIPMENT_STATUS,
                MainTableColumns.PLANNING_STATUS,
                MainTableColumns.BL_NUMBER_COLUMN,
                MainTableColumns.PO_COLUMN,
                MainTableColumns.POD_COLUMN,
                MainTableColumns.VESSEL_VOYAGE_COLUMN,
                MainTableColumns.ETD_COLUMN,
                MainTableColumns.ETA_COLUMN,
                MainTableColumns.ATA_COLUMN,
                MainTableColumns.FDL_COLUMN,
                MainTableColumns.CONSIGNEE,
                MainTableColumns.PRIORITY_COLUMN,
                MainTableColumns.EMPTY_RETURN_REF_COLUMN,
                MainTableColumns.PICK_UP_REF_COLUMN,
                MainTableColumns.GAS_CHECK_COLUMN,
                MainTableColumns.SOURCE_COLUMN,
                MainTableColumns.LAST_UPDATED_BY_COLUMN,
            ];
        },
    });
}

class MainTableColumns {
    static CHECKBOX_COLUMN: SCMTableColDef = {
        maxWidth: 60,
        name: i18n.t('SELECT').toString(),
        headerName: '',
        type: 'checkbox',
        field: 'selector',
        suppressMovable: true,
        sortable: false,
        resizable: false,
        lockPosition: true,
        isLocked: true,
        sticky: 'left',
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static EQUIPMENT_NUMBER_COLUMN: SCMTableColDef = {
        flex: 0,
        colWidth: 200,
        name: i18n.t('FIELD.EQUIPMENT_NUMBER').toString(),
        headerName: i18n.t('FIELD.EQUIPMENT_NUMBER').toString(),
        headerSecondaryText: i18n.t('FIELD.SIZE').toString(),
        headerTooltip: 'Equipment',
        field: 'cargoStuffingNumber',
        secondaryTextField: 'cargoStuffingType',
        tooltipField: 'cargoStuffingNumber',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.cargoStuffingNumber);
        },
        lockPosition: true,
        isLocked: true,
        sticky: 'left',
        primaryTextAction: 'navigateToDetailsPage',
        sortable: false,
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static SHIPMENT_STATUS: SCMTableColDef = {
        minWidth: 150,
        name: i18n.t('FIELD.SHIPMENT_STATUS').toString(),
        headerName: i18n.t('FIELD.SHIPMENT_STATUS').toString(),
        headerTooltip: i18n.t('FIELD.CONTAINER_STATUS').toString(),
        field: 'primaryExecutiveStatus',
        tooltipField: 'primaryExecutiveStatus',
        secondaryTextField: 'secondaryExecutiveStatus',
        primaryTextAction: 'navigateToTNT',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getPrimaryExecutiveStatusDisplayName(data.primaryExecutiveStatus));
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(getSecondaryExecutiveStatusDisplayName(data.secondaryExecutiveStatus));
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static BL_NUMBER_COLUMN: SCMTableColDef = {
        minWidth: 150,
        name: i18n.t('FIELD.BL_NO').toString(),
        headerName: i18n.t('FIELD.BL_NO').toString(),
        headerSecondaryText: i18n.t('FIELD.CARRIER').toString(),
        headerTooltip: i18n.t('FIELD.BL_NO').toString(),
        field: 'transportDocumentNumbers',
        secondaryTextField: 'maerskCarrierCode',
        tooltipField: 'transportDocumentNumbers',
        sortable: false,
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.transportDocumentNumber);
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(data.maerskCarrierCode);
        },
        primaryTextAction: 'primaryTextActionBLNo',
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static PO_COLUMN: SCMTableColDef = {
        minWidth: 75,
        name: i18n.t('FIELD.PO').toString(),
        headerName: i18n.t('FIELD.PO').toString(),
        headerTooltip: i18n.t('FIELD.PO').toString(),
        field: 'purchaseOrdersCount',
        sortable: false,
        primaryTextAction: 'primaryTextActionPO',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.purchaseOrdersCount);
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static POD_COLUMN: SCMTableColDef = {
        minWidth: 120,
        name: i18n.t('FIELD.PORT_OF_DISCHARGE').toString(),
        headerName: i18n.t('FIELD.PORT_OF_DISCHARGE').toString(),
        headerSecondaryText: '',
        headerTooltip: i18n.t('FIELD.PORT_OF_DISCHARGE').toString(),
        field: 'portOfDischargeLocation',
        secondaryTextField: 'portOfDischargeCountry',
        tooltipField: 'portOfDischargeLocation',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.portOfDischargeLocation);
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(data.portOfDischargeCountry);
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static VESSEL_VOYAGE_COLUMN: SCMTableColDef = {
        minWidth: 200,
        name: i18n.t('FILTERS.VESSEL').toString(),
        headerName: i18n.t('FILTERS.VESSEL').toString(),
        headerTooltip: i18n.t('FILTERS.VESSEL').toString(),
        headerSecondaryText: i18n.t('FILTERS.VOYAGE').toString(),
        field: 'vesselName',
        secondaryTextField: 'voyageReference',
        tooltipField: 'vesselName',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.vesselName);
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(data.voyageReference);
        },
        sortable: true,
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static ETD_COLUMN: SCMTableColDef = {
        minWidth: 125,
        name: i18n.t('FIELD.ESTIMATED_DISCHARGE_DATE').toString(),
        headerName: i18n.t('FIELD.ESTIMATED_DISCHARGE_DATE').toString(),
        headerTooltip: i18n.t('FIELD.ESTIMATED_DISCHARGE_DATE').toString(),
        field: 'estimatedTimeOfDischargeDateTimeLocal',
        tooltipField: 'estimatedTimeOfDischargeDateTimeLocal',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data.estimatedTimeOfDischargeDateTimeLocal }));
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static ETA_COLUMN: SCMTableColDef = {
        minWidth: 125,
        name: i18n.t('FIELD.ETA').toString(),
        headerName: i18n.t('FIELD.ETA').toString(),
        headerSecondaryText: i18n.t('FIELD.PREDICTIVE_ETA').toString(),
        headerTooltip: i18n.t('FIELD.ETA').toString(),
        field: 'estimatedTimeOfArrivalDateTimeLocal',
        secondaryTextField: 'predictiveEstimatedTimeOfArrivalDateTimeLocal',
        tooltipField: 'estimatedTimeOfArrivalDateTimeLocal',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data.estimatedTimeOfArrivalDateTimeLocal }));
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data.predictiveEstimatedTimeOfArrivalDateTimeLocal }));
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
        sort: 'asc',
    };

    static ATA_COLUMN: SCMTableColDef = {
        minWidth: 125,
        name: i18n.t('FIELD.ATA').toString(),
        headerName: i18n.t('FIELD.ATA').toString(),
        headerSecondaryText: '',
        headerTooltip: i18n.t('FIELD.ATA').toString(),
        field: 'actualTimeOfArrivalDateTimeLocal',
        tooltipField: 'actualTimeOfArrivalDateTimeLocal',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data.actualTimeOfArrivalDateTimeLocal }));
        },

        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static FDL_COLUMN: SCMTableColDef = {
        minWidth: 200,
        name: i18n.t('FIELD.FDL').toString(),
        headerName: i18n.t('FIELD.FDL').toString(),
        headerTooltip: i18n.t('FIELD.FDL').toString(),
        field: 'locations',
        tooltipField: 'locations',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.locations);
        },
        sortable: false,
        primaryTextAction: 'primaryTextActionFDL',
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static CONSIGNEE: SCMTableColDef = {
        flex: 0,
        colWidth: 220,
        name: i18n.t('FIELD.CONSIGNEE').toString(),
        headerName: i18n.t('FIELD.CONSIGNEE').toString(),
        headerTooltip: 'consigneeName',
        field: 'consigneeName',
        tooltipField: 'consigneeName',
        headerSecondaryText: i18n.t('FIELD.SHIPPER').toString(),
        secondaryTextField: 'shipperName',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.consigneeName);
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(data.shipperName);
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static PLANNING_STATUS: SCMTableColDef = {
        minWidth: 170,
        name: i18n.t('FIELD.PLANNING_STATUS').toString(),
        headerName: i18n.t('FIELD.PLANNING_STATUS').toString(),
        headerTooltip: i18n.t('FIELD.PLANNING_STATUS').toString(),
        type: 'colorTheme',
        field: 'planningStatus',
        tooltipField: 'planningStatus',
        iconTextField: 'serviceModeIcon',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.planningStatus);
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static PRIORITY_COLUMN: SCMTableColDef = {
        minWidth: 140,
        name: i18n.t('FIELD.PRIORITY').toString(),
        headerName: i18n.t('FIELD.PRIORITY').toString(),
        headerSecondaryText: i18n.t('FIELD.PROGRAM').toString(),
        type: 'colorTheme',
        field: 'priorityShipment',
        headerTooltip: i18n.t('FIELD.PRIORITY').toString(),
        tooltipField: 'priorityShipment',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.priorityShipment);
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static EMPTY_RETURN_REF_COLUMN: SCMTableColDef = {
        minWidth: 140,
        name: i18n.t('FIELD.EMPTY_RETURN_REF').toString(),
        headerName: i18n.t('FIELD.EMPTY_RETURN_REF').toString(),
        headerSecondaryText: i18n.t('FIELD.EXPIRY').toString(),
        headerTooltip: i18n.t('FIELD.EMPTY_RETURN_REF').toString(),
        field: 'emptyReturnReference',
        secondaryTextField: 'emptyReturnReferenceExpiryDateTimeLocal',
        tooltipField: 'emptyReturnReference',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.emptyReturnReference);
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data.emptyReturnReferenceExpiryDateTimeLocal }));
        },
        sortable: false,
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static GAS_CHECK_COLUMN: SCMTableColDef = {
        minWidth: 125,
        name: i18n.t('FIELD.GAS_CHECK_REQUIRED').toString(),
        headerName: i18n.t('FIELD.GAS_CHECK_REQUIRED').toString(),
        headerSecondaryText: i18n.t('FIELD.GAS_CHECK_RESULT').toString(),
        headerTooltip: i18n.t('FIELD.GAS_CHECK_REQUIRED').toString(),
        field: 'gasCheckRequired',
        secondaryTextField: 'gasCheckResult',
        tooltipField: 'gasCheckRequired',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.gasCheckRequired);
        },
        dataFormatterFieldSecondary(data) {
            return data.gasCheckResult ? formatValueIfEmpty(data.gasCheckResult) : null;
        },
        sortable: true,
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static PICK_UP_REF_COLUMN: SCMTableColDef = {
        minWidth: 140,
        name: i18n.t('FIELD.PICK_UP_REF').toString(),
        headerName: i18n.t('FIELD.PICK_UP_REF').toString(),
        headerSecondaryText: i18n.t('FIELD.EXPIRY').toString(),
        headerTooltip: i18n.t('FIELD.PICK_UP_REF').toString(),
        field: 'pickupReference',
        secondaryTextField: 'pickupReferenceExpiryDateTimeLocal',
        tooltipField: 'pickupReference',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.pickupReference);
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data.pickupReferenceExpiryDateTimeLocal }));
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static SOURCE_COLUMN: SCMTableColDef = {
        minWidth: 80,
        name: i18n.t('FIELD.SOURCE').toString(),
        headerName: i18n.t('FIELD.SOURCE').toString(),
        headerTooltip: i18n.t('FIELD.SOURCE').toString(),
        field: 'shipmentMessageSource',
        tooltipField: 'shipmentMessageSource',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getSourceDisplayName(data.shipmentMessageSource));
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
    };

    static LAST_UPDATED_BY_COLUMN: SCMTableColDef = {
        minWidth: 200,
        name: i18n.t('FIELD.LAST_UPDATED_BY').toString(),
        headerName: i18n.t('FIELD.LAST_UPDATED_BY').toString(),
        headerSecondaryText: i18n.t('FIELD.DATE_TIME').toString(),
        headerTooltip: i18n.t('FIELD.LAST_UPDATED_BY').toString(),
        field: 'containerLastUserUpdated',
        secondaryTextField: 'containerLastUserUpdatedDateTime',
        tooltipField: 'containerLastUserUpdated',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.containerLastUserUpdated);
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(getFormattedDateTime({ date: data.containerLastUserUpdatedDateTime, timeZone: data.containerLastUserUpdatedTimeZone }));
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService],
            validateForInternalUsers: false,
        },
        sortable: false,
    };

    static DELIVERY_REFERENCE_DATE_TIME: SCMTableColDef = {
        minWidth: 180,
        name: i18n.t('FIELD.DELIVERY_DATE_TIME').toString(),
        headerName: i18n.t('FIELD.DELIVERY_DATE_TIME').toString(),
        headerTooltip: i18n.t('FIELD.DELIVERY_DATE_TIME').toString(),
        headerSecondaryText: i18n.t('FIELD.DELIVERY_REFERENCE').toString(),
        secondaryTextField: 'deliveryReferenceFinalLeg',
        field: 'deliveryDateTimeFinalLeg',
        tooltipField: 'deliveryDateTimeFinalLeg',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data.deliveryDateTimeFinalLeg }));
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(data.deliveryReferenceFinalLeg);
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: true,
        },
        sortable: false,
    };

    static CUSTOMS_CLEARANCE_STATUS_DATE_TIME: SCMTableColDef = {
        minWidth: 180,
        name: i18n.t('FIELD.CUSTOMS_CLEARANCE_DATE').toString(),
        headerName: i18n.t('FIELD.CUSTOMS_CLEARANCE_DATE').toString(),
        headerTooltip: i18n.t('FIELD.CUSTOMS_CLEARANCE_DATE').toString(),
        headerSecondaryText: i18n.t('FIELD.CUSTOMS_STATUS').toString(),
        secondaryTextField: 'customsStatus',
        field: 'customsClearanceDate',
        tooltipField: 'customsClearanceDate',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data.customsClearanceDate }));
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(getCustomsStatusDisplayName(data.customsStatus));
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: true,
        },
        sortable: false,
    };

    static TRANSPORT_PROVIDER: SCMTableColDef = {
        minWidth: 200,
        name: i18n.t('FIELD.TRANSPORT_PROVIDER').toString(),
        headerName: i18n.t('FIELD.TRANSPORT_PROVIDER').toString(),
        headerTooltip: i18n.t('FIELD.TRANSPORT_PROVIDER').toString(),
        field: 'transportProviderDetails',
        type: 'multipleValues',
        primaryTextAction: 'primaryTextActionTransportProviderDetails',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.transportProviderDetails);
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
        sortable: false,
    };

    static IN_LAND_DEPOT_ARRIVAL_LOCATION_DATE: SCMTableColDef = {
        minWidth: 180,
        name: i18n.t('FIELD.IN_LAND_DEPOT_DATE').toString(),
        headerName: i18n.t('FIELD.IN_LAND_DEPOT_DATE').toString(),
        headerTooltip: i18n.t('FIELD.IN_LAND_DEPOT_DATE').toString(),
        field: 'inlandDepotArrivalDate',
        tooltipField: 'inlandDepotArrivalDate',
        headerSecondaryText: i18n.t('FIELD.ARRIVED_AT_INLAND_DEPOT_LOCATION').toString(),
        secondaryTextField: 'inlandDepotLocation',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data.inlandDepotArrivalDate }));
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(data.inlandDepotLocation);
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: true,
        },
        sortable: false,
    };

    static LAST_FREE_DATE_DEMURRAGE: SCMTableColDef = {
        minWidth: 200,
        name: i18n.t('FIELD.LAST_FREE_DATE_DEMURRAGE').toString(),
        headerName: i18n.t('FIELD.LAST_FREE_DATE_DEMURRAGE').toString(),
        headerTooltip: i18n.t('FIELD.LAST_FREE_DATE_DEMURRAGE').toString(),
        field: 'demurrageFeeLastFreeDate',
        tooltipField: 'demurrageFeeLastFreeDate',
        headerSecondaryText: i18n.t('FIELD.DEMURRAGE_STATUS').toString(),
        secondaryTextField: 'demurrageFeeStatus',
        primaryTextAction: 'navigateToAEMforDemurrageFee',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data?.fees?.demurrage?.lastFreeDateTimeLocal }));
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(getDemurrageAndDetentionStatusName(data?.fees?.demurrage?.status, data?.fees?.demurrage?.numberOfDays));
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
        sortable: true,
    };

    static LAST_FREE_DATE_DETENTION: SCMTableColDef = {
        minWidth: 200,
        name: i18n.t('FIELD.LAST_FREE_DATE_DETENTION').toString(),
        headerName: i18n.t('FIELD.LAST_FREE_DATE_DETENTION').toString(),
        headerTooltip: i18n.t('FIELD.LAST_FREE_DATE_DETENTION').toString(),
        field: 'detentionFeeLastFreeDate',
        tooltipField: 'detentionFeeLastFreeDate',
        headerSecondaryText: i18n.t('FIELD.DETENTION_STATUS').toString(),
        secondaryTextField: 'detentionFeeStatus',
        primaryTextAction: 'navigateToAEMforDetentionFee',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(getFormattedDate({ date: data?.fees?.detention?.lastFreeDateTimeLocal }));
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(getDemurrageAndDetentionStatusName(data?.fees?.detention?.status, data?.fees?.detention?.numberOfDays));
        },
        allowAccessForUserGroups: {
            userGroupNames: [UserPermissionUserGroupNameEnum.SCMDestinationCustomerService, UserPermissionUserGroupNameEnum.SCMConsignee],
            validateForInternalUsers: false,
        },
        sortable: true,
    };
}
