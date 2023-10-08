import { mapAppliedFiltersToBrowserQueryParams, mapBrowserQueryParamsToAppliedFilters } from '.';
import { keyBy } from 'lodash';
import { FilterTypeEnum, IAppliedFilters, IFilterField, IFilterSection } from '@/interfaces';
import { DATE_PICKER_DEFAULT_SELECTED_DATE_RANGE } from '@/static';

function getFiltersArrayAndMap(filters: Array<IFilterSection>): {
    filtersArray: Array<IFilterSection>;
    filtersMap: { [key: string]: IFilterSection };
    fieldMap: { [key: string]: IFilterField };
} {
    return {
        filtersArray: filters,
        filtersMap: keyBy(filters, 'id'),
        fieldMap: filters.reduce((acc, curr) => {
            return { ...acc, ...keyBy(curr.fields, 'id') };
        }, {}),
    };
}

describe('browser-query-params-mapping logic', () => {
    describe('mapAppliedFiltersToBrowserQueryParams', () => {
        it('return browser query params with only valid filters', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
                INVALID_FILTER_FIELD: 'INVALID_FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return browser query params when browserQueryMappingRules is empty', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return browser query params when browserQueryMappingRules has invalid rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            browserQueryMappingRules: ['INVALID_RULE'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return browser query params when browserQueryMappingRules has DROPDOWN rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            browserQueryMappingRules: ['DROPDOWN'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: [
                    {
                        label: 'OPTION_1_LABEL',
                        value: 'OPTION_1_VALUE',
                    },
                ],
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'OPTION_1_LABEL:OPTION_1_VALUE',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return browser query params when browserQueryMappingRules has MULTISELECT rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.multiselect,
                            browserQueryMappingRules: ['MULTISELECT'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: ['OPTION_1_VALUE', 'OPTION_2_VALUE'],
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'OPTION_1_VALUE,OPTION_2_VALUE',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return browser query params when browserQueryMappingRules has DATE_PICKER rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.datePicker,
                            browserQueryMappingRules: ['DATE_PICKER'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: {
                    selectedDateRange: {
                        from: '21 APR 2023',
                        to: '05 MAY 2023',
                    },
                    daysDifference: {
                        from: 7,
                        to: 7,
                    },
                    selectedDropdownValue: {
                        label: '± 7 days from today',
                        value: 7,
                    },
                },
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: '7,7,7',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
        it('return browser query params when browserQueryMappingRules has RADIO rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.radio,
                            browserQueryMappingRules: ['RADIO'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: 'PASS',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'PASS',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
        it('return browser query params when browserQueryMappingRules has DATE_PICKER rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.datePicker,
                            browserQueryMappingRules: ['DATE_PICKER'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: {
                    selectedDateRange: {
                        from: '21 APR 2023',
                        to: '05 MAY 2023',
                    },
                    daysDifference: {
                        from: 7,
                        to: 7,
                    },
                    selectedDropdownValue: {
                        label: '± 7 days from today',
                        value: 7,
                    },
                },
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: '7,7,7',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
        it('return browser query params when browserQueryMappingRules has DATE_PICKER rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.datePicker,
                            browserQueryMappingRules: ['DATE_PICKER'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: {
                    selectedDateRange: {
                        from: '21 APR 2023',
                        to: '05 MAY 2023',
                    },
                    daysDifference: {
                        from: 7,
                        to: 7,
                    },
                    selectedDropdownValue: {
                        label: '± 7 days from today',
                        value: 7,
                    },
                },
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: '7,7,7',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return browser query params when browserQueryMappingRules has DATE_PICKER rule for custom_datepicker', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.datePicker,
                            browserQueryMappingRules: ['DATE_PICKER'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: {
                    selectedDateRange: {
                        from: '21 APR 2023',
                        to: '05 MAY 2023',
                    },
                    daysDifference: {
                        from: 0,
                        to: 7,
                    },
                    selectedDropdownValue: {
                        label: 'Specific date range...',
                        value: 'custom_datepicker',
                    },
                },
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'custom_datepicker,21 APR 2023,05 MAY 2023',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        describe('return browser query params when browserQueryMappingRules has SWITCH rule', () => {
            it('does not append query when switch is toggled off', () => {
                const filters = getFiltersArrayAndMap([
                    {
                        id: 'FILTER_SECTION_ID',
                        title: 'FILTER_SECTION_TITLE',
                        slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                        expanded: false,
                        indicator: 999,
                        fields: [
                            {
                                id: 'FILTER_FIELD',
                                label: 'FILTER_FIELD_LABEL',
                                type: FilterTypeEnum.datePicker,
                                browserQueryMappingRules: ['SWITCH'],
                            },
                        ],
                    },
                ]);
                const appliedFilters: IAppliedFilters = {
                    FILTER_FIELD: false,
                };
                const expectedOutput: IAppliedFilters = {};

                const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

                expect(actualOutput).toStrictEqual(expectedOutput);
            });

            it('append query when switch is toggled on', () => {
                const filters = getFiltersArrayAndMap([
                    {
                        id: 'FILTER_SECTION_ID',
                        title: 'FILTER_SECTION_TITLE',
                        slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                        expanded: false,
                        indicator: 999,
                        fields: [
                            {
                                id: 'FILTER_FIELD',
                                label: 'FILTER_FIELD_LABEL',
                                type: FilterTypeEnum.datePicker,
                                browserQueryMappingRules: ['SWITCH'],
                            },
                        ],
                    },
                ]);
                const appliedFilters: IAppliedFilters = {
                    FILTER_FIELD: true,
                };
                const expectedOutput: IAppliedFilters = {
                    FILTER_FIELD: true,
                };

                const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

                expect(actualOutput).toStrictEqual(expectedOutput);
            });
        });

        it('return browser query params when browserQueryMappingRules has TEXT rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            browserQueryMappingRules: ['TEXT'],
                        },
                    ],
                },
            ]);
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: ['OPTION_1_VALUE', 'OPTION_2_VALUE'],
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'OPTION_1_VALUE,OPTION_2_VALUE',
            };

            const actualOutput = mapAppliedFiltersToBrowserQueryParams({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });

    describe('mapBrowserQueryParamsToAppliedFilters', () => {
        it('return applied filters with only valid filters', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                        },
                    ],
                },
            ]);
            const browserQueryParams: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
                INVALID_FILTER_FIELD: 'INVALID_FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when browserQueryMappingRules is empty', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                        },
                    ],
                },
            ]);
            const browserQueryParams: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when browserQueryMappingRules has invalid rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            browserQueryMappingRules: ['INVALID_RULE'],
                        },
                    ],
                },
            ]);
            const browserQueryParams: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when browserQueryMappingRules has DROPDOWN rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.dropdown,
                            browserQueryMappingRules: ['DROPDOWN'],
                        },
                    ],
                },
            ]);
            const browserQueryParams: IAppliedFilters = {
                FILTER_FIELD: 'OPTION_1_LABEL:OPTION_1_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: [
                    {
                        label: 'OPTION_1_LABEL',
                        value: 'OPTION_1_VALUE',
                    },
                ],
            };

            const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when browserQueryMappingRules has RADIO rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.radio,
                            browserQueryMappingRules: ['RADIO'],
                        },
                    ],
                },
            ]);
            const browserQueryParams: IAppliedFilters = {
                FILTER_FIELD: true,
            };

            const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

            expect(actualOutput).toStrictEqual(browserQueryParams);
        });

        it('return applied filters when browserQueryMappingRules has MULTISELECT rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.multiselect,
                            browserQueryMappingRules: ['MULTISELECT'],
                        },
                    ],
                },
            ]);
            const browserQueryParams: IAppliedFilters = {
                FILTER_FIELD: 'OPTION_1_VALUE,OPTION_2_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: ['OPTION_1_VALUE', 'OPTION_2_VALUE'],
            };

            const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when browserQueryMappingRules has DATE_PICKER rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.datePicker,
                            browserQueryMappingRules: ['DATE_PICKER'],
                        },
                    ],
                },
            ]);
            const browserQueryParams: IAppliedFilters = {
                FILTER_FIELD: '7,7,7',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: {
                    daysDifference: {
                        from: 7,
                        to: 7,
                    },
                    selectedDateRange: DATE_PICKER_DEFAULT_SELECTED_DATE_RANGE,
                    selectedDropdownValue: {
                        label: '7',
                        value: '7',
                    },
                },
            };

            const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when browserQueryMappingRules has DATE_PICKER rule and dropdown value is custom_datepicker', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.datePicker,
                            browserQueryMappingRules: ['DATE_PICKER'],
                        },
                    ],
                },
            ]);
            const browserQueryParams: IAppliedFilters = {
                FILTER_FIELD: 'custom_datepicker,27 APR 2023,28 APR 2023',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: {
                    daysDifference: {
                        from: 0,
                        to: 7,
                    },
                    selectedDateRange: {
                        from: '27 APR 2023',
                        to: '28 APR 2023',
                    },
                    selectedDropdownValue: {
                        label: 'Specific date range...',
                        value: 'custom_datepicker',
                    },
                },
            };

            const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        describe('return applied filters whens when browserQueryMappingRules has SWITCH rule', () => {
            it('does not append query when switch is toggled off', () => {
                const filters = getFiltersArrayAndMap([
                    {
                        id: 'FILTER_SECTION_ID',
                        title: 'FILTER_SECTION_TITLE',
                        slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                        expanded: false,
                        indicator: 999,
                        fields: [
                            {
                                id: 'FILTER_FIELD',
                                label: 'FILTER_FIELD_LABEL',
                                type: FilterTypeEnum.switch,
                                browserQueryMappingRules: ['SWITCH'],
                            },
                        ],
                    },
                ]);
                const browserQueryParams: IAppliedFilters = {
                    FILTER_FIELD: false,
                };
                const expectedOutput: IAppliedFilters = {};

                const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

                expect(actualOutput).toStrictEqual(expectedOutput);
            });

            it('append query when switch is toggled on', () => {
                const filters = getFiltersArrayAndMap([
                    {
                        id: 'FILTER_SECTION_ID',
                        title: 'FILTER_SECTION_TITLE',
                        slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                        expanded: false,
                        indicator: 999,
                        fields: [
                            {
                                id: 'FILTER_FIELD',
                                label: 'FILTER_FIELD_LABEL',
                                type: FilterTypeEnum.datePicker,
                                browserQueryMappingRules: ['SWITCH'],
                            },
                        ],
                    },
                ]);
                const browserQueryParams: IAppliedFilters = {
                    FILTER_FIELD: true,
                };
                const expectedOutput: IAppliedFilters = {
                    FILTER_FIELD: true,
                };

                const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

                expect(actualOutput).toStrictEqual(expectedOutput);
            });
        });

        it('return browser query params when browserQueryMappingRules has TEXT rule', () => {
            const filters = getFiltersArrayAndMap([
                {
                    id: 'FILTER_SECTION_ID',
                    title: 'FILTER_SECTION_TITLE',
                    slotReference: 'FILTER_SECTION_SLOT_REFERENCE',
                    expanded: false,
                    indicator: 999,
                    fields: [
                        {
                            id: 'FILTER_FIELD',
                            label: 'FILTER_FIELD_LABEL',
                            type: FilterTypeEnum.text,
                            browserQueryMappingRules: ['TEXT'],
                        },
                    ],
                },
            ]);
            const browserQueryParams: IAppliedFilters = {
                FILTER_FIELD: 'OPTION_1_VALUE,OPTION_2_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: ['OPTION_1_VALUE', 'OPTION_2_VALUE'],
            };

            const actualOutput = mapBrowserQueryParamsToAppliedFilters({ filters, browserQueryParams });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });
});
