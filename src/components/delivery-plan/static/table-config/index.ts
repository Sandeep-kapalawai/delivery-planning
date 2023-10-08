import { ValueGetterParams } from 'ag-grid-community';
import { SCMTableColDef } from '@/interfaces/scm-table';
import { formatValueIfEmpty } from 'destination/utilities';
import i18n from '@/i18n';
import { ListViewTypeEnum, getServiceLegStatusDisplayName } from '@/static';
import { listViewTypeSpecificAction } from '@/logic';
import LocationCell from '@/components/location-cell/location-cell.vue';

export function getCancelledLegsDefaultColDef({ viewType }: { viewType: ListViewTypeEnum }): SCMTableColDef {
    return listViewTypeSpecificAction<SCMTableColDef>(viewType, {
        [ListViewTypeEnum.fcl]: () => {
            return {
                flex: 1,
                minWidth: 100,
                hide: false,
                sortable: false,
                resizable: true,
                pinned: false,
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
            };
        },
    });
}

export function getCancelledLegsColumnDefs({ viewType }: { viewType: ListViewTypeEnum }): Array<SCMTableColDef> {
    return listViewTypeSpecificAction<Array<SCMTableColDef>>(viewType, {
        [ListViewTypeEnum.fcl]: () => {
            return [
                MainTableColumns.DELIVERY_ORDER,
                MainTableColumns.PICK_UP,
                MainTableColumns.ARROW_RIGHT,
                MainTableColumns.DELIVERY,
                MainTableColumns.DELIVERY_REFERENCE,
                MainTableColumns.TRANSPORT_PROVIDER,
                MainTableColumns.TRANSPORT_MODE,
                MainTableColumns.VERSION,
                MainTableColumns.ACTIONS,
            ];
        },
        [ListViewTypeEnum.lcl]: () => {
            return [
                MainTableColumns.DELIVERY_ORDER,
                MainTableColumns.PICK_UP,
                MainTableColumns.ARROW_RIGHT,
                MainTableColumns.DELIVERY,
                MainTableColumns.DELIVERY_REFERENCE,
                MainTableColumns.TRANSPORT_PROVIDER,
                MainTableColumns.TRANSPORT_MODE,
                MainTableColumns.VERSION,
                MainTableColumns.ACTIONS,
            ];
        },
    });
}

export function getRejectedLegsDefaultColDef({ viewType }: { viewType: ListViewTypeEnum }): SCMTableColDef {
    return listViewTypeSpecificAction<SCMTableColDef>(viewType, {
        [ListViewTypeEnum.fcl]: () => {
            return {
                flex: 1,
                minWidth: 100,
                hide: false,
                sortable: false,
                resizable: true,
                pinned: false,
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
            };
        },
    });
}

export function getRejectedLegsColumnDefs({ viewType }: { viewType: ListViewTypeEnum }): Array<SCMTableColDef> {
    return listViewTypeSpecificAction<Array<SCMTableColDef>>(viewType, {
        [ListViewTypeEnum.fcl]: () => {
            return [
                MainTableColumns.DELIVERY_ORDER,
                MainTableColumns.PICK_UP,
                MainTableColumns.ARROW_RIGHT,
                MainTableColumns.DELIVERY,
                MainTableColumns.DELIVERY_REFERENCE,
                MainTableColumns.TRANSPORT_PROVIDER,
                MainTableColumns.TRANSPORT_MODE,
                MainTableColumns.VERSION,
                MainTableColumns.ACTIONS,
            ];
        },
        [ListViewTypeEnum.lcl]: () => {
            return [
                MainTableColumns.DELIVERY_ORDER,
                MainTableColumns.PICK_UP,
                MainTableColumns.ARROW_RIGHT,
                MainTableColumns.DELIVERY,
                MainTableColumns.DELIVERY_REFERENCE,
                MainTableColumns.TRANSPORT_PROVIDER,
                MainTableColumns.TRANSPORT_MODE,
                MainTableColumns.VERSION,
                MainTableColumns.ACTIONS,
            ];
        },
    });
}

class MainTableColumns {
    static DELIVERY_ORDER: SCMTableColDef = {
        flex: 0,
        colWidth: 150,
        name: i18n.t('FIELD.DELIVERY_ORDER').toString(),
        headerName: i18n.t('FIELD.DELIVERY_ORDER').toString(),
        headerTooltip: i18n.t('FIELD.DELIVERY_ORDER').toString(),
        field: 'deliveryOrder',
        secondaryTextField: 'status',
        tooltipField: 'deliveryOrder',
        resizable: false,
        lockPosition: true,
        isLocked: true,
        sticky: 'left',
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(getServiceLegStatusDisplayName(data.status));
        },
    };

    static PICK_UP: SCMTableColDef = {
        flex: 0,
        colWidth: 180,
        name: i18n.t('FIELD.PICK_UP').toString(),
        headerName: i18n.t('FIELD.PICK_UP').toString(),
        headerTooltip: i18n.t('FIELD.PICK_UP').toString(),
        field: 'pickupData.pickUpAddress',
        resizable: false,
        lockPosition: true,
        isLocked: true,
        valueGetter(params: ValueGetterParams) {
            const { beCode, displayName: name, displayText: address } = params.data.pickupData.pickUpAddress;
            return { beCode, name, address };
        },
        __customCellRenderer__: LocationCell,
    };

    static ARROW_RIGHT: SCMTableColDef = {
        flex: 0,
        colWidth: 60,
        minWidth: 60,
        name: 'Arrow Right',
        headerName: '',
        field: 'arrowRight',
        resizable: false,
        lockPosition: true,
        isLocked: true,
        iconTextField: 'arrowRightIcon',
    };

    static DELIVERY: SCMTableColDef = {
        flex: 0,
        colWidth: 180,
        name: i18n.t('FIELD.DELIVERY').toString(),
        headerName: i18n.t('FIELD.DELIVERY').toString(),
        headerTooltip: i18n.t('FIELD.DELIVERY').toString(),
        field: 'deliveryData.deliveryAddress',
        resizable: false,
        lockPosition: true,
        isLocked: true,
        valueGetter(params: ValueGetterParams) {
            const { beCode, displayName: name, displayText: address } = params.data.deliveryData.deliveryAddress;
            return { beCode, name, address };
        },
        __customCellRenderer__: LocationCell,
    };

    static DELIVERY_REFERENCE: SCMTableColDef = {
        name: i18n.t('FIELD.DELIVERY_REFERENCE').toString(),
        headerName: i18n.t('FIELD.DELIVERY_REFERENCE').toString(),
        headerTooltip: i18n.t('FIELD.DELIVERY_REFERENCE').toString(),
        field: 'deliveryData.deliveryReference',
        tooltipField: 'deliveryData.deliveryReference',
        lockPosition: true,
        isLocked: true,
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.deliveryData.deliveryReference);
        },
    };

    static TRANSPORT_PROVIDER: SCMTableColDef = {
        name: i18n.t('FIELD.TRANSPORT_PROVIDER').toString(),
        headerName: i18n.t('FIELD.TRANSPORT_PROVIDER').toString(),
        headerTooltip: i18n.t('FIELD.TRANSPORT_PROVIDER').toString(),
        field: 'transportData.provider.providerBECode',
        secondaryTextField: 'transportData',
        tooltipField: 'transportData.provider.providerBECode',
        lockPosition: true,
        isLocked: true,
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.transportData.provider.providerBECode);
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(data.transportData.provider.providerName);
        },
    };

    static TRANSPORT_MODE: SCMTableColDef = {
        maxWidth: 140,
        name: i18n.t('FIELD.TRANSPORT_MODE').toString(),
        headerName: i18n.t('FIELD.TRANSPORT_MODE').toString(),
        headerTooltip: i18n.t('FIELD.TRANSPORT_MODE').toString(),
        field: 'transportData.transportMode',
        secondaryTextField: 'transportData',
        tooltipField: 'transportData.transportMode',
        lockPosition: true,
        isLocked: true,
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.transportData.transportMode);
        },
        dataFormatterFieldSecondary(data) {
            return formatValueIfEmpty(data.transportData.deliveryType);
        },
    };

    static VERSION: SCMTableColDef = {
        maxWidth: 80,
        name: i18n.t('FIELD.VERSION').toString(),
        headerName: i18n.t('FIELD.VERSION').toString(),
        headerTooltip: i18n.t('FIELD.VERSION').toString(),
        field: 'version',
        tooltipField: 'version',
        lockPosition: true,
        isLocked: true,
        dataFormatterFieldPrimary(data) {
            return formatValueIfEmpty(data.version);
        },
    };

    static ACTIONS: SCMTableColDef = {
        flex: 0,
        colWidth: 155,
        name: 'Actions',
        headerName: 'Actions',
        field: 'rowActions',
        type: 'rowActions',
        resizable: false,
        lockPosition: true,
        isLocked: true,
        sticky: 'right',
    };
}
