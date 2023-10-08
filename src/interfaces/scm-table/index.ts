import { ColDef } from 'ag-grid-community';
import { IAllowAccessForUserGroups } from '../user-permissions';

export interface SCMTableColDef extends ColDef {
    name?: string | null;
    colWidth?: number;
    headerSecondaryText?: string;
    headerTertiaryText?: string;
    iconTextField?: string;
    linkTextField?: string;
    primaryTextAction?: string;
    secondaryTextField?: string;
    tertiaryTextField?: string;
    isHidden?: boolean;
    isLocked?: boolean;
    sticky?: boolean | string | null;
    __customCellRenderer__?: any;
    dataFormatterFieldPrimary?: (data: any) => string;
    dataFormatterFieldSecondary?: (data: any) => string;
    dataFormatterFieldTetriary?: (data: any) => string;
    allowAccessForUserGroups?: IAllowAccessForUserGroups;
}

export interface SCMTableRowAction {
    icon?: string;
    category?: 'mds' | 'satisfied' | 'unsatisfied' | 'high' | 'intermediate' | 'processing' | 'new' | 'unavailable';
    interactive?: boolean;
    notification?: number;
    text?: string;
    secondaryText?: string;
    tooltipText?: string;
    isDisabled?: boolean;
    actionMethod?: SCMTableRowActionMethod;
}

export type SCMTableRowActionMethod = ({ rowData, rowIndex }: { rowData: any; rowIndex: number }) => void;

export interface SCMTableTheme {
    spacing: string;
}
