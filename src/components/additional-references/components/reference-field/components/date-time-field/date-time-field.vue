<template>
    <div class="date-time-field">
        <ValidationObserver v-slot="{ errors: validationObserverErrors }">
            <div class="date-time-field_date-time-wrapper">
                <div class="date-time-field_date-picker">
                    <ValidationProvider
                        v-slot="{ errors }"
                        ref="dateValidationProvider"
                        mode="eager"
                        :rules="{
                            required: field.isMandatory,
                            dateTimeRequired:
                                field.format === CustomizableFieldFormatEnum.DATETIME
                                    ? {
                                          date: vModelDateValue,
                                          time: vModelTimeValue,
                                      }
                                    : false,
                        }"
                    >
                        <mc-input-date
                            :id="`${field.fieldId}/date-time-field/date`"
                            :data-test="`${field.fieldId}/date-time-field/date`"
                            :fit="mdsComponentFit.inputDate"
                            :format="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                            :label="`${field.referenceName} ${field.isMandatory ? '' : $t('FIELD.OPTIONAL')}`"
                            :placeholder="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                            :required="field.isMandatory"
                            :invalid="errors && errors.length > 0"
                            :value.prop="vModelDateValue"
                            @input="
                                onDateInput($event);
                                validateDateTimeFields();
                            "
                        />
                    </ValidationProvider>
                </div>

                <div v-if="field.format === CustomizableFieldFormatEnum.DATETIME" class="date-time-field_time-picker">
                    <ValidationProvider
                        v-slot="{ errors }"
                        ref="timeValidationProvider"
                        mode="eager"
                        :rules="{
                            required: field.isMandatory,
                            dateTimeRequired: {
                                date: vModelDateValue,
                                time: vModelTimeValue,
                            },
                        }"
                    >
                        <TimeInput
                            :id="`${field.fieldId}/date-time-field/time`"
                            :data-test="`${field.fieldId}/date-time-field/time`"
                            :value="vModelTimeValue"
                           :is-invalid="errors && errors.length > 0 ? true: false"
                            @change="
                                onTimeInput($event.displayTime);
                                validateDateTimeFields();
                            "
                        />
                    </ValidationProvider>
                </div>

                <div class="date-time-field_error-hint-wrapper">
                    <div class="date-time-field_error">
                        {{ getValidationObserverError(validationObserverErrors) }}
                    </div>

                    <div class="date-time-field_hint">
                        {{ field.referenceDescription }}
                    </div>
                </div>
            </div>
        </ValidationObserver>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-input';
import '@maersk-global/mds-components-core/mc-input-date';
import Vue, { PropType } from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { getFormattedDate } from 'destination/utilities';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import { MDS_COMPONENT_FIT, CustomizableFieldFormatEnum } from '@/static';
import { ICustomizableField } from '@/interfaces';
import { getValidationObserverError } from '@/utilities';
import { getTimeFromDateTimeString, getDateTimeStringFromDateAndTimeValues } from '@/store/modules/delivery-plan/logic';

import './styles/date-time-field.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'date-time-field',

    i18n,

    components: {
        ValidationObserver,
        ValidationProvider,
    },

    props: {
        field: {
            type: Object as PropType<ICustomizableField>,
            required: true,
        },
    },

    data() {
        const value: string = this.field.value ? this.field.value.replaceAll('"', '') : '';
        const vModelDateValue = getFormattedDate({ date: value });
        const vModelTimeValue = this.field.format === CustomizableFieldFormatEnum.DATETIME ? getTimeFromDateTimeString({ date: value }) : '00:00:00';

        return {
            CustomizableFieldFormatEnum,
            vModelDateValue,
            vModelTimeValue,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
    },

    methods: {
        getValidationObserverError,
        onDateInput(event: InputEvent) {
            this.vModelDateValue = (event.target as HTMLInputElement).value;
            this.$emit('change', getDateTimeStringFromDateAndTimeValues({ date: this.vModelDateValue, time: this.vModelTimeValue as string }));
        },
        onTimeInput(time: string) {
            this.vModelTimeValue = time;
            this.$emit('change', getDateTimeStringFromDateAndTimeValues({ date: this.vModelDateValue as string, time: this.vModelTimeValue }));
        },
        validateDateTimeFields() {
            this.$nextTick(() => {
                [
                    this.$refs.dateValidationProvider as InstanceType<typeof ValidationProvider>,
                    this.$refs.timeValidationProvider as InstanceType<typeof ValidationProvider>,
                ]
                    .filter((provider) => provider)
                    .forEach((provider) => provider.validate());
            });
        },
    },
});
</script>
