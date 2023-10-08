import { SCMTableColDef, SCMTableTheme, toolPanelPosition } from '@/interfaces';

export interface IData {
    showColumnConfigurator: boolean;
    draftColumnDefs: Array<SCMTableColDef>;
    draftTheme?: SCMTableTheme;
}

export interface IMethods {
    toggleColumnConfigurator(): void;
    onColumnsChange(updatedColumnDefs: Array<SCMTableColDef>): void;
    onApplyButtonClick(): void;
    onResetButtonClick(): void;
    onRowSpacingChange(spacing: string): void;
}

export interface IComputed {
    toolPanelPosition: toolPanelPosition;
    columnDefs: Array<SCMTableColDef>;
    theme: SCMTableTheme;
}

export interface IProps {
    listViewModule: string;
}
