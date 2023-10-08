import { mapAppliedFiltersToSaveFiltersPayload, mapSavedFiltersToAppliedFilters } from '.';
import { keyBy } from 'lodash';
import { FilterTypeEnum, IAppliedFilters, IFilterField, IFilterSection } from '@/interfaces';

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

describe('save-filter-mapping logic', () => {
    describe('mapAppliedFiltersToSaveFiltersPayload', () => {
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
            const appliedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
                INVALID_FILTER_FIELD: 'INVALID_FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapAppliedFiltersToSaveFiltersPayload({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
        it('return applied filters when savedFilterMappingRules is empty', () => {
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

            const actualOutput = mapAppliedFiltersToSaveFiltersPayload({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when savedFilterMappingRules has invalid rule', () => {
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
                            savedFilterMappingRules: ['INVALID_RULE'],
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

            const actualOutput = mapAppliedFiltersToSaveFiltersPayload({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when savedFilterMappingRules has DROPDOWN rule', () => {
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
                            savedFilterMappingRules: ['DROPDOWN'],
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
                FILTER_FIELD: [
                    {
                        label: 'OPTION_1_LABEL',
                        value: 'OPTION_1_VALUE',
                    },
                ],
            };

            const actualOutput = mapAppliedFiltersToSaveFiltersPayload({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when savedFilterMappingRules has MULTISELECT rule', () => {
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
                            savedFilterMappingRules: ['MULTISELECT'],
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

            const actualOutput = mapAppliedFiltersToSaveFiltersPayload({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when savedFilterMappingRules has DATE_PICKER rule', () => {
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
                            savedFilterMappingRules: ['DATE_PICKER'],
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

            const actualOutput = mapAppliedFiltersToSaveFiltersPayload({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
        describe('return applied filters when savedFilterMappingRules has SWITCH rule', () => {
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
                                savedFilterMappingRules: ['SWITCH'],
                            },
                        ],
                    },
                ]);
                const appliedFilters: IAppliedFilters = {
                    FILTER_FIELD: false,
                };
                const expectedOutput: IAppliedFilters = {};

                const actualOutput = mapAppliedFiltersToSaveFiltersPayload({ filters, appliedFilters });

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
                                savedFilterMappingRules: ['SWITCH'],
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

                const actualOutput = mapAppliedFiltersToSaveFiltersPayload({ filters, appliedFilters });

                expect(actualOutput).toStrictEqual(expectedOutput);
            });
        });

        it('return applied filters when savedFilterMappingRules has TEXT rule', () => {
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
                            savedFilterMappingRules: ['TEXT'],
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

            const actualOutput = mapAppliedFiltersToSaveFiltersPayload({ filters, appliedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });

    describe('mapSavedFiltersToAppliedFilters', () => {
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
            const savedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
                INVALID_FILTER_FIELD: 'INVALID_FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapSavedFiltersToAppliedFilters({ filters, savedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when savedFilterMappingRules is empty', () => {
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
            const savedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapSavedFiltersToAppliedFilters({ filters, savedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when savedFilterMappingRules has invalid rule', () => {
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
                            savedFilterMappingRules: ['INVALID_RULE'],
                        },
                    ],
                },
            ]);
            const savedFilters: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: 'FILTER_FIELD_VALUE',
            };

            const actualOutput = mapSavedFiltersToAppliedFilters({ filters, savedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when savedFilterMappingRules has DROPDOWN rule', () => {
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
                            savedFilterMappingRules: ['DROPDOWN'],
                        },
                    ],
                },
            ]);
            const savedFilters: IAppliedFilters = {
                FILTER_FIELD: [
                    {
                        label: 'OPTION_1_LABEL',
                        value: 'OPTION_1_VALUE',
                    },
                ],
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: [
                    {
                        label: 'OPTION_1_LABEL',
                        value: 'OPTION_1_VALUE',
                    },
                ],
            };

            const actualOutput = mapSavedFiltersToAppliedFilters({ filters, savedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when savedFilterMappingRules has MULTISELECT rule', () => {
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
                            savedFilterMappingRules: ['MULTISELECT'],
                        },
                    ],
                },
            ]);
            const savedFilters: IAppliedFilters = {
                FILTER_FIELD: 'OPTION_1_VALUE,OPTION_2_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: ['OPTION_1_VALUE', 'OPTION_2_VALUE'],
            };

            const actualOutput = mapSavedFiltersToAppliedFilters({ filters, savedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('return applied filters when savedFilterMappingRules has DATE_PICKER rule', () => {
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
                            savedFilterMappingRules: ['DATE_PICKER'],
                        },
                    ],
                },
            ]);
            const savedFilters: IAppliedFilters = {
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

            const actualOutput = mapSavedFiltersToAppliedFilters({ filters, savedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        describe('return applied filters whens when savedFilterMappingRules has SWITCH rule', () => {
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
                                savedFilterMappingRules: ['SWITCH'],
                            },
                        ],
                    },
                ]);
                const savedFilters: IAppliedFilters = {
                    FILTER_FIELD: false,
                };
                const expectedOutput: IAppliedFilters = {};

                const actualOutput = mapSavedFiltersToAppliedFilters({ filters, savedFilters });

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
                                savedFilterMappingRules: ['SWITCH'],
                            },
                        ],
                    },
                ]);
                const savedFilters: IAppliedFilters = {
                    FILTER_FIELD: true,
                };
                const expectedOutput: IAppliedFilters = {
                    FILTER_FIELD: true,
                };

                const actualOutput = mapSavedFiltersToAppliedFilters({ filters, savedFilters });

                expect(actualOutput).toStrictEqual(expectedOutput);
            });
        });

        it('return applied filters when savedFilterMappingRules has TEXT rule', () => {
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
                            savedFilterMappingRules: ['TEXT'],
                        },
                    ],
                },
            ]);
            const savedFilters: IAppliedFilters = {
                FILTER_FIELD: 'OPTION_1_VALUE,OPTION_2_VALUE',
            };
            const expectedOutput: IAppliedFilters = {
                FILTER_FIELD: ['OPTION_1_VALUE', 'OPTION_2_VALUE'],
            };

            const actualOutput = mapSavedFiltersToAppliedFilters({ filters, savedFilters });

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });
});
