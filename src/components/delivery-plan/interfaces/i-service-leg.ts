import { IServiceLeg, SCMTableRowAction } from '@/interfaces';

export interface IServiceLegDataRow extends IServiceLeg {
    arrowRightIcon?: string;
    rowActions?: Array<SCMTableRowAction>;
}
