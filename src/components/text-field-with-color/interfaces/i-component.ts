export interface IData {}

export interface IMethods {}

export interface IComputed {
    formattedValue: string | number;
    computedStyle: { [key: string]: string };
}

export interface IProps {
    label: string;
    value: string | number;
    color: string;
}
