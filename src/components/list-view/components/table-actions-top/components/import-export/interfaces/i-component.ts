import { IExportExcelOption } from './i-export-excel-option';
import { IFclListItem, ILclListItem } from '@/interfaces';
import { ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';

export interface IData {
    isExportExcelOptionsVisible: boolean;
    isImportModelOpen: boolean;
    selectedExportExcelOption?: string;
    errorMsg: object;
    uploadRules: object;
}

export interface IMethods {
    onImportExcelModalClose({ isAnyFileUploaded }: { isAnyFileUploaded: boolean }): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    selectedRows: Map<number, IFclListItem | ILclListItem>;
    isExporting: boolean;
    isImportExcelOptionVisible: boolean;
    exportExcelOptions: Array<IExportExcelOption>;
}

export interface IProps {
    listViewType: ListViewTypeEnum;
    listViewModule: string;
}
