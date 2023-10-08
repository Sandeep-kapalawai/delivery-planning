import { MDS_COMPONENT_FIT_TYPE, MDS_COMPONENT_TYPE } from '@/static';
import { ICustomizableField } from '@/interfaces';

export interface IData {}

export interface IMethods {
    onInput(event: InputEvent): void;
}

export interface IComputed {
    mdsComponentFit: { [key in MDS_COMPONENT_TYPE]: MDS_COMPONENT_FIT_TYPE };
}

export interface IProps {
    field: ICustomizableField;
}
