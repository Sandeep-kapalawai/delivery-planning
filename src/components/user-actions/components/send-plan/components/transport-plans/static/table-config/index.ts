import { SCMTableColDef } from '@/interfaces/scm-table';

import i18n from '@/i18n';
import { FeatureToggleEnum, ListViewTypeEnum } from '@/static';
import { listViewTypeSpecificAction } from '@/logic';
import { isFeatureEnabled, formatValueIfEmpty } from 'destination/utilities';


const DOG_GOH = isFeatureEnabled(FeatureToggleEnum.HIDE_DG_GOH_RFR);

export function getDefaultColDef({ listViewType }: { listViewType: ListViewTypeEnum }): SCMTableColDef {
    return listViewTypeSpecificAction<SCMTableColDef>(listViewType, {
        [ListViewTypeEnum.fcl]: () => {
            return {
                flex: 1,
                minWidth: 100,
                hide: false,
                sortable: false,
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
                MainTableColumns.DELIVERY_ORDER,
                MainTableColumns.PICKUP_LOCATION,
                MainTableColumns.DELIVERY_LOCATION,
                MainTableColumns.TRANSPORT_MODE,
                MainTableColumns.PLANNED_DATE_TIME,
                MainTableColumns.VERSION,
                MainTableColumns.REASON_CODE,
                MainTableColumns.COMMENTS,
            ];
        },
        [ListViewTypeEnum.lcl]: () => {
            return [
                MainTableColumns.DELIVERY_ORDER,
                MainTableColumns.PICKUP_LOCATION,
                MainTableColumns.DELIVERY_LOCATION,
                MainTableColumns.TRANSPORT_MODE,
                MainTableColumns.PLANNED_DATE_TIME,
                MainTableColumns.VERSION,
                MainTableColumns.REASON_CODE,
                MainTableColumns.COMMENTS,
            ];
        },
    });
}

export function getColumnDefsforMultiSelect({ listViewType }: { listViewType: ListViewTypeEnum }): Array<SCMTableColDef> {
    return listViewTypeSpecificAction<Array<SCMTableColDef>>(listViewType, {
        [ListViewTypeEnum.fcl]: () => {
            if (!DOG_GOH) {
                return [
                    MainTableColumns.CONTAINER,
                    MainTableColumns.DELIVERY_ORDER,
                    MainTableColumns.PICKUP_LOCATION,
                    MainTableColumns.DELIVERY_LOCATION,
                    MainTableColumns.TRANSPORT_MODE,
                    MainTableColumns.PLANNED_DATE_TIME,
                    MainTableColumns.VERSION,
                    MainTableColumns.REASON_CODE,
                    MainTableColumns.COMMENTS,
                    MainTableColumns.DG,
                    MainTableColumns.GOH,
                    MainTableColumns.RFR,
                ];
            } else {
                return [
                    MainTableColumns.CONTAINER,
                    MainTableColumns.DELIVERY_ORDER,
                    MainTableColumns.PICKUP_LOCATION,
                    MainTableColumns.DELIVERY_LOCATION,
                    MainTableColumns.TRANSPORT_MODE,
                    MainTableColumns.PLANNED_DATE_TIME,
                    MainTableColumns.VERSION,
                    MainTableColumns.REASON_CODE,
                    MainTableColumns.COMMENTS,
                ];
            }
        },
        [ListViewTypeEnum.lcl]: () => {
            if (!DOG_GOH) {
                return [
                    MainTableColumns.CONTAINER,
                    MainTableColumns.DELIVERY_ORDER,
                    MainTableColumns.PICKUP_LOCATION,
                    MainTableColumns.DELIVERY_LOCATION,
                    MainTableColumns.TRANSPORT_MODE,
                    MainTableColumns.PLANNED_DATE_TIME,
                    MainTableColumns.VERSION,
                    MainTableColumns.REASON_CODE,
                    MainTableColumns.COMMENTS,
                    MainTableColumns.DG,
                    MainTableColumns.GOH,
                    MainTableColumns.RFR,
                ];
            } else {
                return [
                    MainTableColumns.BL,
                    MainTableColumns.DELIVERY_ORDER,
                    MainTableColumns.PICKUP_LOCATION,
                    MainTableColumns.DELIVERY_LOCATION,
                    MainTableColumns.TRANSPORT_MODE,
                    MainTableColumns.PLANNED_DATE_TIME,
                    MainTableColumns.VERSION,
                    MainTableColumns.REASON_CODE,
                    MainTableColumns.COMMENTS,
                ];
            }
        },
    });
}

class MainTableColumns {
    static CONTAINER: SCMTableColDef = {
        colWidth: 200,
        name: i18n.t('FIELD.CONTAINER_NUMBER').toString(),
        headerName: i18n.t('FIELD.CONTAINER_NUMBER').toString(),
        headerSecondaryText: i18n.t('FIELD.SIZE').toString(),
        headerTooltip: i18n.t('FIELD.CONTAINER_NUMBER').toString(),
        field: 'cargoStuffingNumber',
        secondaryTextField: 'containerSize',
        tooltipField: 'cargoStuffingNumber',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.cargoStuffingNumber);
        },
    };
    static BL: SCMTableColDef = {
        colWidth: 200,
        name: i18n.t('FIELD.BL_NO').toString(),
        headerName: i18n.t('FIELD.BL_NO').toString(),
        headerTooltip: i18n.t('FIELD.BL_NO').toString(),
        field: 'transportDocumentNumber',
        tooltipField: 'transportDocumentNumber',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.transportDocumentNumber);
        },
    };

    static DELIVERY_ORDER: SCMTableColDef = {
        minWidth: 150,
        name: i18n.t('FIELD.DELIVERY_ORDER').toString(),
        headerName: i18n.t('FIELD.DELIVERY_ORDER').toString(),
        headerTooltip: i18n.t('FIELD.DELIVERY_ORDER').toString(),
        field: 'deliveryOrderNumber',
        tooltipField: 'deliveryOrderNumber',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.deliveryOrderNumber);
        },
    };
    
    static PICKUP_LOCATION: SCMTableColDef = {
        minWidth: 120,
        name: i18n.t('FILTERS.PICK_UP_LOCATION').toString(),
        headerName: i18n.t('FILTERS.PICK_UP_LOCATION').toString(),
        headerTooltip: i18n.t('FILTERS.PICK_UP_LOCATION').toString(),
        field: 'pickupLocationBeCode',
        tooltipField: 'pickupLocationBeCode',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.pickupLocationBeCode);
        },
    };

    static DELIVERY_LOCATION: SCMTableColDef = {
        minWidth: 120,
        name: i18n.t('FILTERS.DELIVERY_LOCATION').toString(),
        headerName: i18n.t('FILTERS.DELIVERY_LOCATION').toString(),
        headerTooltip: i18n.t('FILTERS.DELIVERY_LOCATION').toString(),
        field: 'deliveryLocationBeCode',
        tooltipField: 'deliveryLocationBeCode',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.deliveryLocationBeCode);
        },
    };

    static TRANSPORT_MODE: SCMTableColDef = {
        minWidth: 180,
        name: i18n.t('FIELD.TRANSPORT_MODE').toString(),
        headerName: i18n.t('FIELD.TRANSPORT_MODE').toString(),
        headerTooltip: i18n.t('FIELD.TRANSPORT_MODE').toString(),
        field: 'transportModes',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.transportModes);
        },
        type: 'multipleValues',
    };

    static PLANNED_DATE_TIME: SCMTableColDef = {
        minWidth: 180,
        name: i18n.t('FIELD.PLANNED_DATE_TIME').toString(),
        headerName: i18n.t('FIELD.PLANNED_DATE_TIME').toString(),
        headerTooltip: i18n.t('FIELD.PLANNED_DATE_TIME').toString(),
        field: 'deliveryDateTimes',
        type: 'multipleValues',
    };

    static VERSION: SCMTableColDef = {
        minWidth: 70,
        name: i18n.t('FIELD.VERSION').toString(),
        headerName: i18n.t('FIELD.VERSION').toString(),
        headerTooltip: i18n.t('FIELD.VERSION').toString(),
        field: 'version',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.version);
        },
    };

    static REASON_CODE: SCMTableColDef = {
        minWidth: 180,
        name: i18n.t('FIELD.REASON_CODE').toString(),
        headerName: i18n.t('FIELD.REASON_CODE').toString(),
        type: 'dropdown',
        headerTooltip: i18n.t('FIELD.REASON_CODE').toString(),
        field: 'reasonCodes',
    };

    static COMMENTS: SCMTableColDef = {
        minWidth: 200,
        name: i18n.t('FIELD.COMMENTS').toString(),
        headerName: i18n.t('FIELD.COMMENTS').toString(),
        type: 'input',
        headerTooltip: i18n.t('FIELD.COMMENTS').toString(),
        field: 'comments',
    };

    static DG: SCMTableColDef = {
        minWidth: 80,
        name: i18n.t('FIELD.DG').toString(),
        headerName: i18n.t('FIELD.DG').toString(),
        headerTooltip: i18n.t('FIELD.DANGEROUS_GOODS').toString(),
        field: 'hasDangerousGoods',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.hasDangerousGoods);
        },
    };

    static GOH: SCMTableColDef = {
        minWidth: 80,
        name: i18n.t('FIELD.GOH').toString(),
        headerName: i18n.t('FIELD.GOH').toString(),
        headerTooltip: i18n.t('FIELD.GARMENT_ON_HANGER').toString(),
        field: 'hasGarmentOnHanger',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.hasGarmentOnHanger);
        },
    };

    static RFR: SCMTableColDef = {
        minWidth: 80,
        name: i18n.t('FIELD.RFR').toString(),
        headerName: i18n.t('FIELD.RFR').toString(),
        headerTooltip: i18n.t('FIELD.REEFER').toString(),
        field: 'hasReefer',
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.hasReefer);
        },
    };
}
