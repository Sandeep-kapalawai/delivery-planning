<template>
    <div v-if="field" class="filter-field">
        <template v-if="field.type === FilterTypeEnum.text && !field.hidden">
            <mc-input
                :data-test="`filter-field/${field.id}`"
                type="text"
                :fit="mdsComponentFit.input"
                :clearbutton="true"
                :name="field.id"
                :hint="isHintVisible && field.hint"
                :label="field.label"
                :placeholder="field.placeholder || undefined"
                :value.prop="filterState && filterState[field.id]"
                @input="onTextFilterChange"
                @paste="onPastefromClipboard"
                @focus="setHintVisibility(true)"
                @blur="setHintVisibility(false)"
            />
        </template>

        <template v-if="field.type === FilterTypeEnum.date">
            <mc-input-date
                :data-test="`filter-field/${field.id}`"
                :fit="MDSFitTypeEnum.medium"
                :name="field.id"
                :format="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                :label="field.label"
                :placeholder="field.placeholder || $t('CONFIGURATION.INPUT_DATE_FORMAT')"
                :value="filterState && filterState[field.id]"
                @input="onDateFilterChange"
            />
        </template>

        <template v-if="field.type === FilterTypeEnum.number">
            <mc-input
                :data-test="`filter-field/${field.id}`"
                type="number"
                inputmode="numeric"
                :fit="mdsComponentFit.input"
                :name="field.id"
                :label="field.label"
                :placeholder="field.placeholder || undefined"
                :value="filterState && filterState[field.id]"
                @input="onNumberFilterChange"
            />
        </template>

        <template v-if="field.type === FilterTypeEnum.dropdown">
            <mc-select
                :data-test="`filter-field/${field.id}`"
                :fit="mdsComponentFit.select"
                :name="field.id"
                :label="field.label"
                :placeholder="field.placeholder || undefined"
                :options.prop="field.dropdown && field.dropdown.options"
                :value.prop="(filterState && filterState[field.id]) || []"
                @change="onDropDownFilterChange"
            />
        </template>

        <template v-if="field.type === FilterTypeEnum.multiselect">
            <div v-click-outside="() => setMultiselectListVisible(false)">
                <mc-input
                    :data-test="`filter-field/${field.id}`"
                    type="text"
                    :fit="mdsComponentFit.input"
                    :icon="field.icon"
                    :iconposition="field.iconPosition"
                    :clearbutton="field.isClearButtonVisible !== false"
                    :name="field.id"
                    :label="field.label"
                    :placeholder="field.placeholder || undefined"
                    :loading="isLoading"
                    :value="multiselectInputValue"
                    @input="onMultiselectFilterInput"
                    @click="setMultiselectListVisible(true)"
                    @focus="setMultiselectListVisible(true)"
                />

                <div v-if="field.multiselect" class="filter-field_multiselect_list-container">
                    <mc-c-list v-if="isMultiselectListVisible" ref="multiselectList" :data-test="`filter-field/${field.id}/list`">
                        <template v-if="field.multiselect.options && field.multiselect.options.length">
                            <mc-c-list-item
                                v-for="(option, index) of field.multiselect.options"
                                :key="index"
                                :data-test="`filter-field/${field.id}/list-item/${option.value}`"
                                @click="onMultiselectFilterValueAdd(option.value)"
                            >
                                {{ option.value }}

                                <span slot="secondary">{{ option.secondary }}</span>
                            </mc-c-list-item>
                        </template>
                        <template v-else>
                            <mc-c-list-item :data-test="`filter-field/${field.id}/list-item/empty-options-message`" disabled>
                                {{ multiSelectDefaultMessage ? multiSelectDefaultMessage : field.multiselect.emptyOptionsMessage }}
                            </mc-c-list-item>
                        </template>
                    </mc-c-list>
                </div>

                <div class="filter-field_multiselect_tags-container">
                    <mc-tag
                        v-for="(value, index) of (filterState && filterState[field.id]) || []"
                        :key="index"
                        :data-test="`filter-field/${field.id}/tag/${value}`"
                        :fit="mdsComponentFit.tag"
                        :label="value"
                        withaction
                        @dismiss="onMultiselectFilterValueRemove(value)"
                    />
                </div>
            </div>
        </template>

        <template v-if="field.type === FilterTypeEnum.switch">
            <mc-switch
                :data-test="`filter-field/${field.id}`"
                :name="field.id"
                :fit="mdsComponentFit.input"
                :label="field.label"
                :checked="filterState && filterState[field.id]"
                @change="onSwitchFilterChange"
            >
            </mc-switch>
        </template>

        <template v-if="field.type === FilterTypeEnum.datePicker">
            <SCMDatePicker
                :data-test="`filter-field/${field.id}`"
                :range-options="[7, 14]"
                has-days-range-stepper
                has-custom-date-range-picker
                :stack-controls="true"
                :placeholder="field.placeholder || undefined"
                :label="field.label"
                :stepper-option-label="$t('DATE_PICKER_STEPPER')"
                :picker-option-label="$t('DATE_PICKER_SPECIFIC_DATE')"
                :predefined-option-label="{ start: '±', end: $t('DAYS_FROM_TODAY') }"
                :selected-index="datePickerSelectedIndex"
                :default-days-before-after="{ before: datePickerDaysDifference.from, after: datePickerDaysDifference.to }"
                :default-from-to-date-picker="{ from: datePickerSelectedDateRange.from, to: datePickerSelectedDateRange.to }"
                @get-range-date="onDatePickerFilterChange"
            />
        </template>

        <template v-if="field.type === FilterTypeEnum.radio">
            <mc-radio-group
                :legend="field.label"
                :value="filterState && filterState[field.id]"
                :data-test="`filter-field/${field.id}`"
                @change="onRadioOrCheckboxFilterChange"
                :fit="mdsComponentFit.radio"
                orientation="horizontal"
            >
                <mc-radio
                    v-for="option of (field.radioOptions && field.radioOptions.options) || []"
                    :data-test="`filter-field/${field.id}/radio-option/${option.value}`"
                    :key="`radio-option-${field.id}-${option.value}`"
                    :name="field.id"
                    :value="option.value"
                    :label="option.label"
                    :checked="isRadioOptionChecked(option.value)"
                    :fit="mdsComponentFit.radio"
                />
            </mc-radio-group>
        </template>

        <template v-if="field.type === FilterTypeEnum.checkbox">
            <mc-checkbox-group
                :v-mc-model="filterState && filterState[field.id]"
                :data-test="`filter-field/${field.id}`"
                :fit="mdsComponentFit.checkbox"
                :value="filterState && filterState[field.id]"
                :legend="field.label"
                @change="onRadioOrCheckboxFilterChange"
            >
                <mc-checkbox
                    v-for="option of (field.checkboxOptions && field.checkboxOptions.options) || []"
                    :key="`checkbox-option-${field.id}-${option.value}`"
                    :data-test="`filter-field/${field.id}/checkbox-option/${option.value}`"
                    :name="field.id"
                    :value="option.value"
                    :label="option.label"
                    :checked="isCheckboxOptionSelected(option.value)"
                    :fit="mdsComponentFit.checkbox"
                />
            </mc-checkbox-group>
        </template>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-input';
import '@maersk-global/mds-components-core/mc-input-date';
import '@maersk-global/mds-components-core/mc-select';
import '@maersk-global/mds-components-core/mc-tag';
import '@maersk-global/mds-components-core/mc-switch';
import '@maersk-global/mds-components-community/mc-c-list';
import '@maersk-global/mds-components-community/mc-c-list-item';
import '@maersk-global/mds-components-core/mc-radio-group';
import '@maersk-global/mds-components-core/mc-radio';
import '@maersk-global/mds-components-core/mc-checkbox';

import { DatePicker as SCMDatePicker } from '@scm-ui/date-picker';
import Vue, { PropType } from 'vue';
import { debounce } from 'lodash';
import i18n from '@/i18n';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import { FilterTypeEnum, IAppliedFilters, IDatePicker, IDaysDifference, IFilterField, ISelectedDateRange, ISelectedDropdownValue } from '@/interfaces';
import { FilterEventBus, FilterEventBusEventName } from '../../utilities/event-bus';
import { MDS_COMPONENT_FIT, MDS_COMPONENT_FIT_TYPE } from '@/static';

import { CombinedVueInstance } from 'vue/types/vue';
import { DATE_PICKER_DEFAULT_DAYS_DIFFERENCE, DATE_PICKER_DEFAULT_SELECTED_DATE_RANGE, DATE_PICKER_DEFAULT_SELECTED_INDEX } from '@/static/filter';
import { getDatePickerValuesFromFilterState } from './logic';

import './styles/filter-field.scss';

enum EventNameEnum {
    filterFieldChange = 'filterFieldChange',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'filter-field',
    i18n,
    props: {
        field: {
            type: Object as PropType<IFilterField>,
            required: true,
        },
        filterState: {
            type: Object as PropType<IAppliedFilters>,
            required: false,
            default: () => {},
        },
    },

    components: {
        SCMDatePicker,
    },

    data() {
        return {
            FilterTypeEnum: FilterTypeEnum,
            isLoading: false,
            isMultiselectListVisible: false,
            multiselectInputValue: '',
            multiSelectDefaultMessage: '',
            MDSFitTypeEnum: MDS_COMPONENT_FIT_TYPE,
            isHintVisible: false,
            datePickerSelectedIndex: DATE_PICKER_DEFAULT_SELECTED_INDEX,
            datePickerDaysDifference: DATE_PICKER_DEFAULT_DAYS_DIFFERENCE,
            datePickerSelectedDateRange: DATE_PICKER_DEFAULT_SELECTED_DATE_RANGE,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
    },

    created() {
        if (this.field.type === FilterTypeEnum.multiselect) {
            FilterEventBus.$on(FilterEventBusEventName.FILTER_CLEAR, () => {
                this.setMultiselectInputValue('');
            });

            this.fetchMultiselectFilterOptions(this.multiselectInputValue);
        }
        if (this.field.type === FilterTypeEnum.datePicker) {
            this.initializeDefaultValuesForDatePicker();
        }
    },

    async updated() {
        if (this.field.type === FilterTypeEnum.multiselect) {
            await this.$nextTick();
            this.setMultiselectListHeight();
        }
    },

    destroyed() {
        if (this.field.type === FilterTypeEnum.multiselect) {
            FilterEventBus.$off(FilterEventBusEventName.FILTER_CLEAR);
        }
    },

    methods: {
        isRadioOptionChecked(optionValue: string | boolean) {
            return this.filterState && this.filterState[this.field.id] && this.filterState[this.field.id].toString() === optionValue.toString();
        },
        isCheckboxOptionSelected(optionValue: string | boolean) {
            const filterStateArrayList = this.filterState && this.filterState[this.field.id] && this.filterState[this.field.id].toString().split(',');
            return filterStateArrayList?.includes(optionValue);
        },
        setHintVisibility(isVisible: boolean) {
            this.isHintVisible = isVisible;
        },
        onTextFilterChange(event: InputEvent) {
            this.$emit(EventNameEnum.filterFieldChange, { id: this.field.id, value: (event.target as HTMLInputElement).value.split(',').map((v) => v.trim()) });
        },
        onDateFilterChange(event: InputEvent) {
            this.$emit(EventNameEnum.filterFieldChange, { id: this.field.id, value: (event.target as HTMLInputElement).value });
        },
        onDatePickerFilterChange(selectedDateRange: ISelectedDateRange, daysDifference: IDaysDifference, selectedDropdownValue: ISelectedDropdownValue) {
            const details: IDatePicker = {
                selectedDateRange: selectedDateRange,
                daysDifference: daysDifference,
                selectedDropdownValue: selectedDropdownValue,
            };
            this.$emit(EventNameEnum.filterFieldChange, { id: this.field.id, value: details });
        },
        onRadioOrCheckboxFilterChange(event: CustomEvent) {
            this.$emit(EventNameEnum.filterFieldChange, { id: this.field.id, value: event.detail });
        },
        initializeDefaultValuesForDatePicker() {
            if (this.filterState && this.filterState[this.field.id]) {
                const { daysDifference, selectedDateRange, datePickerSelectedIndex } = getDatePickerValuesFromFilterState(this.filterState[this.field.id]);
                this.datePickerDaysDifference = daysDifference;
                this.datePickerSelectedDateRange = selectedDateRange;
                this.datePickerSelectedIndex = datePickerSelectedIndex;
            }
        },
        onNumberFilterChange(event: InputEvent) {
            this.$emit(EventNameEnum.filterFieldChange, { id: this.field.id, value: (event.target as HTMLInputElement).value });
        },
        onDropDownFilterChange(event: CustomEvent) {
            this.$emit(EventNameEnum.filterFieldChange, { id: this.field.id, value: event.detail.selectedOptions });
        },
        onSwitchFilterChange(event: CustomEvent) {
            this.$emit(EventNameEnum.filterFieldChange, { id: this.field.id, value: (event.target as HTMLInputElement).checked });
        },
        async setMultiselectInputValue(value: string) {
            if (this.multiselectInputValue === value) {
                return;
            }

            this.multiselectInputValue = value;
            await this.fetchMultiselectFilterOptions(this.multiselectInputValue);
        },
        setMultiselectListVisible(isVisible: boolean) {
            this.isMultiselectListVisible = isVisible;
        },
        setMultiselectListHeight() {
            const multiselectListHost = (this.$refs.multiselectList as Element)?.shadowRoot?.firstElementChild as HTMLElement;
            if (!multiselectListHost) {
                return;
            }

            multiselectListHost.style.overflow = 'auto';
            multiselectListHost.style.maxHeight = this.field.multiselect?.listMaxHeight || '400px';
        },
        async fetchMultiselectFilterOptions(searchText: string) {
            if (!this.field.multiselect) {
                return;
            }
            if ((this.field.multiselect.minCharacter && this.field.multiselect.minCharacter <= searchText.length) || !this.field.multiselect.minCharacter) {
                this.isLoading = true;
                await this.field.multiselect.fetchOptions?.callback?.({ id: this.field.id, searchText }).catch(() => {
                    // This is Intentional
                });
                this.multiSelectDefaultMessage = '';
            } else {
                this.multiSelectDefaultMessage = this.field.multiselect.minCharacterMessage;
            }
            this.isLoading = false;
        },
        onMultiselectFilterInput: debounce(async function (this: CombinedVueInstance<Vue, IData, IMethods, IComputed, Readonly<IProps>>, event: InputEvent) {
            this.setMultiselectListVisible(true);
            await this.setMultiselectInputValue((event.target as HTMLInputElement).value);
            this.$forceUpdate();
        }, 300),
        onMultiselectFilterValueAdd(value: string) {
            const selectedValues: Array<string> = (this.filterState && this.filterState[this.field.id]) || [];
            const updatedSelectedValues: Array<string> = selectedValues.indexOf(value) < 0 ? [...selectedValues, value] : selectedValues;
            this.$emit(EventNameEnum.filterFieldChange, { id: this.field.id, value: updatedSelectedValues });
            this.setMultiselectInputValue('');
            this.setMultiselectListVisible(false);
            this.$forceUpdate();
        },
        onMultiselectFilterValueRemove(value: string | unknown) {
            const selectedValues: Array<string> = (this.filterState && this.filterState[this.field.id]) || [];
            const updatedSelectedValues: Array<string> = selectedValues.filter((v: string) => v !== value);
            this.$emit(EventNameEnum.filterFieldChange, { id: this.field.id, value: updatedSelectedValues });
            this.setMultiselectListVisible(false);
            this.$forceUpdate();
        },

        onPastefromClipboard(event: ClipboardEvent) {
            if (event && event.clipboardData) {
                const clipboardText: string = event.clipboardData.getData('text/plain');
                const inputElement = event.target as HTMLInputElement;
                let existingValues = (inputElement.value || '').split('\n').map((v) => v.trim());
                const newValues = Array.from(
                    new Set(
                        clipboardText.split('\n').reduce((acc: Array<string>, curr: string) => {
                            curr.split('\t').forEach((p: string) => {
                                if (!p || p.trim() === '') {
                                    return;
                                }
                                acc.push(p.trim());
                            });
                            return acc;
                        }, []),
                    ),
                );
                if (inputElement) {
                    let allValues: string[] = [];
                    if (existingValues.length === 0) {
                        allValues = [...newValues];
                    } else {
                        let lastValue = existingValues[existingValues.length - 1];
                        if (lastValue[lastValue.length - 1] === ',') {
                            existingValues[existingValues.length - 1] = lastValue.slice(0, -1);
                        }
                        allValues = [...existingValues];
                        newValues.forEach((value: string) => {
                            if (!allValues.includes(value)) {
                                allValues.push(value);
                            }
                        });
                    }
                    if (allValues.length > 0 && allValues[0].trim() === '') {
                        allValues.splice(0, 1);
                    }
                    inputElement.value = allValues.join(',');
                    this.$emit(EventNameEnum.filterFieldChange, {
                        id: this.field.id,
                        value: allValues,
                    });
                }
                event.preventDefault();
            }
        },
    },
});
</script>
