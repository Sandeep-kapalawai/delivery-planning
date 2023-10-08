import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE, ListViewTypeEnum } from '@/static';
import { DeliveryLocation, ICargoStuffingDetails } from '@/interfaces';
import { HeaderSectionField } from '../static';

export interface IData {
    isUpdateDetailsPanelVisible: boolean;
}

export interface IMethods {
    handleUpdateDetails: () => void;
    navigateToComments: () => void;
    gasCheckRequiredValue: () => string | undefined;
    gasCheckResultValue: () => string | undefined;
    gasCheckRequestedByValue: () => string | undefined;
    gasCheckRequestedDateValue: () => string | undefined;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    details: { result: ICargoStuffingDetails };
    sealNumber: string;
    shipmentStatus: string;
    priority: { level: number; displayName: string };
    program: string;
    headerSectionFields: Array<HeaderSectionField>;
    finalDeliveryLocations: Array<DeliveryLocation>;
    selectedRows: Map<number | string, ICargoStuffingDetails>;
    showIndicatorFlags: boolean;
}

export interface IProps {
    viewType: ListViewTypeEnum;
    viewModule: string;
    isSICancelled: boolean;
}
