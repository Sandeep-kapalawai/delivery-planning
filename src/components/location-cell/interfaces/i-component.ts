import { ICellRendererParams } from 'ag-grid-community';
import { Instance as TippyInstance } from 'tippy.js';

export interface IData {
    tippyInstance?: TippyInstance;
}

export interface IMethods {}

export interface IComputed {}

export interface IProps {
    params: ICellRendererParams;
}
