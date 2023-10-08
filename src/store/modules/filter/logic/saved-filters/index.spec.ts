import { getDefaultFilter, getFormattedSavedFilters } from '.';
import { ISavedFilterItem } from '@/interfaces';

describe('Saved filter logic', () => {
    describe('getFormattedSavedFilters', () => {
        it('returns an array of formatted saved filters', () => {
            const result = [
                {
                    definition: '{"field1": "value1", "field2": "value2"}',
                    filterId: 1,
                    name: 'Filter 1',
                    isUserDefault: true,
                    isSystemDefault: false,
                },
                {
                    definition: '{"field3": "value3", "field4": "value4"}',
                    filterId: 2,
                    name: 'Filter 2',
                    isUserDefault: false,
                    isSystemDefault: true,
                },
            ];

            const expectedOutput = [
                {
                    id: '1',
                    name: 'Filter 1',
                    fields: [{ field1: 'value1' }, { field2: 'value2' }],
                    isUserDefault: true,
                    isSystemDefault: false,
                },
                {
                    id: '2',
                    name: 'Filter 2',
                    fields: [{ field3: 'value3' }, { field4: 'value4' }],
                    isUserDefault: false,
                    isSystemDefault: true,
                },
            ];

            const formattedFilters = getFormattedSavedFilters({ result });

            expect(formattedFilters).toEqual(expectedOutput);
        });
    });

    describe('getDefaultFilter', () => {
        it('returns the default filter', () => {
            const savedFilters: ISavedFilterItem[] = [
                {
                    id: '1',
                    name: 'Filter 1',
                    fields: [],
                    isUserDefault: false,
                    isSystemDefault: false,
                },
                {
                    id: '2',
                    name: 'Filter 2',
                    fields: [],
                    isUserDefault: false,
                    isSystemDefault: true,
                },
            ];

            const expectedOutput: ISavedFilterItem = {
                id: '2',
                name: 'Filter 2',
                fields: [],
                isUserDefault: false,
                isSystemDefault: true,
            };

            const defaultFilter = getDefaultFilter({ savedFilters });

            expect(defaultFilter).toEqual(expectedOutput);
        });
    });
});
