import { IListState } from '@/store/interfaces';
import { IFclListItem } from '@/interfaces';

export interface IState extends IListState<IFclListItem> {
    importExportAnExcel: {
        isExporting: boolean;
        isImporting: boolean;
        isFileImported: boolean;
    };
}
