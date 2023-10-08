import { DemurrageAndDetentionStatusEnum } from '@/static';

export interface IFees {
    status: DemurrageAndDetentionStatusEnum;
    lastFreeDateTimeUtc: string;
    lastFreeDateTimeLocal: string;
    lastFreeDateTimeZone: string;
    numberOfDays: number | null;
    alertNumber: string | null;
}
