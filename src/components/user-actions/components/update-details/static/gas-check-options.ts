import { GasCheckResultsEnum } from '@/static';
import { GasCheckRequiredOption, GasCheckResultOption } from '../interfaces/i-update-details';

export const GasCheckRequiredOptions: GasCheckRequiredOption[] = [
    {
        value: true,
        label: 'YES',
    },
    {
        value: false,
        label: 'NO',
    },
];

export const GasCheckResultOptions: GasCheckResultOption[] = [
    {
        value: GasCheckResultsEnum.PASS,
        label: 'PASS',
    },
    {
        value: GasCheckResultsEnum.FAIL,
        label: 'FAIL',
    },
];
