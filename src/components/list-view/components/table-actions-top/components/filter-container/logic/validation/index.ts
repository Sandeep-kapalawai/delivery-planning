import i18n from '@/i18n';
import { IAppliedFilters, IValidationResult } from '@/interfaces';

export function validateFilterName({ filterName, savedFilters }: { filterName: string; savedFilters: IAppliedFilters }): IValidationResult {
    if (filterName.length < 1 || filterName.length > 50) {
        return {
            isValid: false,
            message: i18n.t('FILTERS.FILTER_NAME_CHARACTER_LENGTH_EXCEEDED').toString(),
        };
    }

    const filterExistsWithSameName = savedFilters.some((f: any) => f.name === filterName);
    if (filterExistsWithSameName) {
        return {
            isValid: false,
            message: i18n.t('FILTERS.FILTER_NAME_EXISTS').toString(),
        };
    }

    return { isValid: true };
}
