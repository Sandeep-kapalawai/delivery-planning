import { ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';

import {
    SCMTableColDef,
    IFinalDeliveryLocation,
    IPriority,
    IFclListItem,
    ILclListItem,
    IAppliedFilters,
    IGroupedQuickFilters,
    SCMTableTheme,
} from '@/interfaces';
import { SortingTypeEnum } from '@/store/modules/sorting/static';

export interface IData {
    previewPanelFDLIsOpen: boolean;
    previewPanelPOIsOpen: boolean;
    previewPanelBLIsOpen: boolean;
    previewPanelTransportProviderIsOpen:boolean,
    selectedRow: IFclListItem | ILclListItem | {}; //Empty obj for default case
    locations: IFinalDeliveryLocation[];
    cargoStuffingNumber: string;
    data: Array<IFclListItem | ILclListItem>;
    messageType: string;
}

export interface IMethods {
    initializeTableConfiguration(): void;
    initializeSorting(): void;
    fetchList(resetPageNumber?: boolean): Promise<void>;
    isRowSelectable(row: any): boolean;
    onColumnMoved(columnDefs: Array<SCMTableColDef>): void;
    onSortOrderChanged(direction: SortingTypeEnum | null, field: string): void;
    mapPriority(row: any): IPriority;
    getPlanningStatus(row: IFclListItem | ILclListItem): void;
    getGasCheckDetails(gasCheckDetails: any): {
        gasCheckRequired: string;
        gasCheckResult: string;
    };
    mapRow(row: any): void;
    openPreviewPanelFDL(row: any): void;
    openPreviewPanelPO(row: IFclListItem | ILclListItem): void;
    openPreviewPanelBl(row: IFclListItem | ILclListItem): void;
    closePreviewPanelFDL(): void;
    closePreviewPanelPO(): void;
    closePreviewPanelBL(): void;
    closePreviewPanelTransportProvider(): void;
    onSelectionChange(selectedRows: Array<any>): void;
    onUserActionClose(type:string): void;
    clearSelectionUpdateRows(): void;
    onCellSeeMoreClick(row: IFclListItem | ILclListItem):void;
    getTransportProviderDetails(row: IFclListItem | ILclListItem):void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    tableId: string;
    tableTheme: SCMTableTheme;
    defaultColDef: Array<SCMTableColDef>;
    columnDefs: Array<SCMTableColDef>;
    list: {
        isFetching: boolean;
        errorMessage: string;
        result: Array<any>;
        resultTotalCount: number;
    };
    rowData: Array<any>;
    appliedPagination: string;
    appliedFilters: IAppliedFilters;
    appliedQuickFilters: Array<IGroupedQuickFilters>;
    appliedSort: string;
    selectedRows: Map<number | string, IFclListItem | ILclListItem>;
    selectedCargoStuffingIDs: string;
}

export interface IProps {
    listViewType: ListViewTypeEnum;
    listViewModule: string;
}
