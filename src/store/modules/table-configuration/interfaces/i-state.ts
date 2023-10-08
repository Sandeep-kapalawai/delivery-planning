import { SCMTableColDef, SCMTableTheme } from '@/interfaces';

export interface IState {
    initialized: boolean;
    saveUserPreferencesEnabled: boolean;
    tableId: string;
    defaultColDef: SCMTableColDef;
    originalColumnDefs: Array<SCMTableColDef>;
    originalColumnDefsMap: Map<string, SCMTableColDef>;
    columnDefs: Array<SCMTableColDef>;
    originalTheme: SCMTableTheme;
    theme: SCMTableTheme;
}
