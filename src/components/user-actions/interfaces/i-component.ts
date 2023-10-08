import { ListViewTypeEnum, MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';

export interface IUserActionData {
    isRequestInProgress: boolean;
    requestSuccessMessage: string;
    requestErrors: Array<string>;
    form: any;
    formValidationObserver: any;
}

export interface IUserActionMethods {
    initializeModal?(): Promise<void>;
    onSaveButtonClick(): Promise<void>;
    onCancelButtonClick(): void;
}

export interface IUserActionComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    isFormInvalid: boolean;
}

export interface IUserActionProps {
    listViewType: ListViewTypeEnum;
    selectedRows: Map<number, any>;
}
