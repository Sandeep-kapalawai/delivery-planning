import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';
import { ICustomizableField } from '@/interfaces';

export interface IData {
    minValue: number;
    maxValue: number;
}

export interface IMethods {
    onKeydown(event: KeyboardEvent): void;
    onInput(event: InputEvent): void;
}
export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
    isDecimalAllowed: boolean;
}

export interface IProps {
    field: ICustomizableField;
}
