import { SCMTableColDef } from '@/interfaces/scm-table';
import { ListViewTypeEnum } from '@/static';
import { listViewTypeSpecificAction } from '@/logic';
import { formatValueIfEmpty } from 'destination/utilities';
import i18n from '@/i18n';

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
                sortable: false,
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
            return [TableColumns.TOGGLE, TableColumns.PO, TableColumns.WEIGHT, TableColumns.PACKAGES, TableColumns.QUANTITY, TableColumns.VOLUME];
        },
        [ListViewTypeEnum.lcl]: () => {
            return [];
        },
    });
}

export function getChildTableColumnDefs({ listViewType }: { listViewType: ListViewTypeEnum }): Array<SCMTableColDef> {
    return listViewTypeSpecificAction<Array<SCMTableColDef>>(listViewType, {
        [ListViewTypeEnum.fcl]: () => {
            return [
                TableColumns.SKU,
                TableColumns.DESCRIPTION,
                TableColumns.WEIGHT,
                TableColumns.PACKAGES,
                TableColumns.QUANTITY,
                TableColumns.VOLUME,
                TableColumns.HS_CODES,
            ];
        },
        [ListViewTypeEnum.lcl]: () => {
            return [];
        },
    });
}

class TableColumns {
    //PO Table and SKU table has similar cols and made it same class
    static get TOGGLE(): SCMTableColDef {
        return {
            headerName: '',
            field: 'level',
            type: 'toggle',
            maxWidth: 60,
        };
    }

    static get PO(): SCMTableColDef {
        return {
            headerName: i18n.t('FIELD.PO_NUMBER').toString(),
            field: 'purchaseOrderNumber',
            tooltipField: 'purchaseOrderNumber',
            colWidth: 150,
            headerTooltip: 'purchaseOrderNumber',
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(data.purchaseOrderNumber);
            },
        };
    }

    static get SKU(): SCMTableColDef {
        return {
            colWidth: 150,
            name: i18n.t('FIELD.SKU_NO').toString(),
            headerName: i18n.t('FIELD.SKU_NO').toString(),
            headerTooltip: i18n.t('FIELD.SKU_NO').toString(),
            field: 'stockKeepingUnitNumber',
            tooltipField: 'stockKeepingUnitNumber',
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(data.stockKeepingUnitNumber);
            },
        };
    }

    static get DESCRIPTION(): SCMTableColDef {
        return {
            colWidth: 150,
            name: i18n.t('FIELD.DESCRIPTION').toString(),
            headerName: i18n.t('FIELD.DESCRIPTION').toString(),
            headerTooltip: i18n.t('FIELD.DESCRIPTION').toString(),
            field: 'description',
            tooltipField: 'description',
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(data.description);
            },
        };
    }

    static get PACKAGES(): SCMTableColDef {
        return {
            colWidth: 150,
            name: i18n.t('FIELD.PACKAGES').toString(),
            headerName: i18n.t('FIELD.PACKAGES').toString(),
            headerTooltip: i18n.t('FIELD.PACKAGES').toString(),
            field: 'packagesWithUnitType',
            tooltipField: 'packagesWithUnitType',
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(data.packagesWithUnitType);
            },
        };
    }

    static get QUANTITY(): SCMTableColDef {
        return {
            name: i18n.t('FIELD.QUANTITY').toString(),
            headerName: i18n.t('FIELD.QUANTITY').toString(),
            headerTooltip: i18n.t('FIELD.QUANTITY').toString(),
            field: 'quantitiesWithUnitType',
            tooltipField: 'quantitiesWithUnitType',
            colWidth: 150,
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(data.quantitiesWithUnitType);
            },
        };
    }

    static get WEIGHT(): SCMTableColDef {
        return {
            colWidth: 150,
            name: i18n.t('FIELD.GROSS_WEIGHT').toString(),
            headerName: i18n.t('FIELD.GROSS_WEIGHT').toString(),
            headerTooltip: i18n.t('FIELD.GROSS_WEIGHT').toString(),
            field: 'grossWeightsWithUnitType',
            tooltipField: 'grossWeightsWithUnitType',
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(data.grossWeightsWithUnitType);
            },
        };
    }

    static get VOLUME(): SCMTableColDef {
        return {
            name: i18n.t('FIELD.VOLUME').toString(),
            headerName: i18n.t('FIELD.VOLUME').toString(),
            headerTooltip: i18n.t('FIELD.VOLUME').toString(),
            field: 'volumesWithUnitType',
            tooltipField: 'volumesWithUnitType',
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(data.volumesWithUnitType);
            },
            colWidth: 150,
        };
    }
    static get HS_CODES(): SCMTableColDef {
        return {
            name: i18n.t('FIELD.HS_CODES').toString(),
            headerName: i18n.t('FIELD.HS_CODES').toString(),
            headerTooltip: i18n.t('FIELD.HS_CODES').toString(),
            field: 'commodityCode',
            tooltipField: 'commodityCode',
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(data.commodityCode);
            },
            colWidth: 100,
        };
    }
}
