import { ListViewTypeEnum, NotificationComponentEnum, NotificationPositionEnum } from '@/static';
import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';

export interface IData {
    NotificationComponentEnum: typeof NotificationComponentEnum;
    NotificationPositionEnum: typeof NotificationPositionEnum;
    isNotificationVisible: boolean;
    isAnyFileSelectedForUploaded: boolean;
    isAnyFileUploaded: boolean;
    filesList: Array<any>;
    responseFileContent: any;
    isImportingError: boolean;
    isExcelError: boolean;
}

export interface IMethods {
    onSelect(): void;
    onCloseButtonClick(): void;
    onConfirmButtonClick(): void;
    overrideDefaultErrorMessage(): void;
    getFilesFromRef(): Array<any>;
    setCustomRules(): void;
    handleFileUpload(file: any, fileContent: any): void;
    fileName(file: any): string;
    convertToKiloBytes(byte: any): any;
    onCancel(fileName: string): void;
    clearSelectedFiles(): void;
    handleFileChange(e: any): void;
    getContentFromFile(fileData: any): Uint8Array;
    drop(e: any): void;
    fileUploadValidate(filesList: any): boolean;
    downloadExcelFile(): void;
}
export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    fileCount: number;
    allowedExtensions: string;
    isImporting: boolean;
    isFileImported: boolean;
}

export interface IProps {
    listViewType: ListViewTypeEnum;
    listViewModule: string;
    files: Array<object>;
    allowMultipleSelection: boolean;
    uploadRules: any;
    errorMessages: any;
    fileRef: string;
    description: string;
    disableUpload: boolean;
}
