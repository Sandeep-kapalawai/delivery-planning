import { IButtonGroupSwitchOption } from './i-option';

export interface IData {}

export interface IMethods {
    onButtonClick: (option: IButtonGroupSwitchOption) => void;
}

export interface IComputed {}

export interface IProps {
    label: string;
    disabled: boolean;
    options: Array<IButtonGroupSwitchOption>;
    value: string | number;
}
