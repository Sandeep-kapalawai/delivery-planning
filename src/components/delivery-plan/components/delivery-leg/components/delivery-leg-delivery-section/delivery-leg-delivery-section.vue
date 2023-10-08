<template>
    <div class="delivery-leg-delivery-section">
        <ValidationObserver v-slot="{ errors: validationObserverErrors }">
            <div class="delivery-leg-delivery-section_header">{{ $t('FIELD.DELIVERY') }}</div>

            <Row class="delivery-leg-delivery-section_row">
                <Column :xs="10">
                    <LocationPicker
                        :id="`leg/${legIndex}/delivery/location`"
                        ref="deliveryLocationPicker"
                        :data-test="`leg/${legIndex}/delivery/location/location-picker`"
                        :required="true"
                        :rules="{
                            uniquePickUpAndDeliveryLocation: {
                                pickUpLocation: leg.pickupData.pickUpAddress.beCode,
                                deliveryLocation: leg.deliveryData.deliveryAddress.beCode,
                            },
                        }"
                        :value="leg.deliveryData.deliveryAddress.beCode"
                        :disabled="disabled"
                        @change="
                            setDeliveryLocation({ leg, location: $event });
                            setDeliveryTimeZoneAndOffset({ leg, location: $event });
                        "
                    />
                </Column>
            </Row>

            <Row v-if="leg.deliveryData.deliveryAddress.beCode" class="delivery-leg-delivery-section_row">
                <Column :xs="12">
                    <LocationField
                        :data-test="`leg/${legIndex}/delivery/location/location-field`"
                        :name="leg.deliveryData.deliveryAddress.displayName"
                        :address="leg.deliveryData.deliveryAddress.displayText"
                        :disabled="disabled"
                    />
                </Column>
            </Row>

            <Row class="delivery-leg-delivery-section_row">
                <Column :xs="6">
                    <ValidationProvider
                        v-slot="{ errors }"
                        ref="deliveryOnDateValidationProvider"
                        mode="eager"
                        :name="`leg/${legIndex}/delivery/delivery-on-date`"
                        :rules="{
                            required: true,
                            deliveryDateTimeRequired: {
                                date: leg.deliveryData.deliveryOnDate,
                                timeOption: leg.deliveryData.deliveryTimeOption,
                                fromTime: leg.deliveryData.deliveryFromTime,
                                toTime: leg.deliveryData.deliveryToTime,
                            },
                            minimumDate: {
                                disabled: isLegStatusSentOrAccepted,
                                date: deliveryDateMinimumValue,
                            },
                        }"
                    >
                        <mc-input-date
                            :data-test="`leg/${legIndex}/delivery/delivery-on-date`"
                            :fit="mdsComponentFit.inputDate"
                            :format="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                            :label="$t('FIELD.DELIVERY_ON')"
                            :placeholder="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                            :required="true"
                            :min="deliveryDateMinimumValue"
                            :invalid="errors && errors.length > 0"
                            :errormessage="errors && errors[0]"
                            :value.prop="leg.deliveryData.deliveryOnDate"
                            :disabled="disabled"
                            @input="
                                setDeliveryOnDate({ leg, date: $event.target.value });
                                setDeliveryTimeZoneAndOffset({ leg, date: $event.target.value });
                                validateDeliveryDateTimeFields();
                            "
                        />
                    </ValidationProvider>
                </Column>
            </Row>

            <Row class="delivery-leg-delivery-section_row">
                <Column :xs="12">
                    <ButtonGroupSwitch
                        :id="`leg/${legIndex}/delivery/delivery-time-option`"
                        :data-test="`leg/${legIndex}/delivery/delivery-time-option`"
                        :label="$t('FIELD.DELIVERY_TIME_OPTION')"
                        :options="deliveryTimeOptions"
                        :value="leg.deliveryData.deliveryTimeOption"
                        :disabled="disabled"
                        @change="
                            setDeliveryTimeOption({ leg, deliveryTimeOption: $event.value });
                            validateDeliveryDateTimeFields();
                        "
                    />
                </Column>
            </Row>

            <Row class="delivery-leg-delivery-section_row">
                <Column :xs="12">
                    <div class="delivery-leg-delivery-section_time">
                        <span class="delivery-leg-delivery-section_time_label">{{ $t('DELIVERY_PLAN.TIME_HH_MM') }}</span>

                        <div class="delivery-leg-delivery-section_time_picker">
                            <ValidationProvider
                                v-slot="{ errors }"
                                ref="deliveryFromTimeValidationProvider"
                                mode="eager"
                                :name="`leg/${legIndex}/delivery/delivery-from-time`"
                                :rules="{
                                    required: isDeliveryTimeRequired,
                                    deliveryDateTimeRequired: isDeliveryTimeRequired
                                        ? {
                                              date: leg.deliveryData.deliveryOnDate,
                                              timeOption: leg.deliveryData.deliveryTimeOption,
                                              fromTime: leg.deliveryData.deliveryFromTime,
                                              toTime: leg.deliveryData.deliveryToTime,
                                          }
                                        : undefined,
                                }"
                            >
                                <TimeInput
                                    :id="`leg/${legIndex}/delivery/delivery-from-time`"
                                    :data-test="`leg/${legIndex}/delivery/delivery-from-time`"
                                    :value="leg.deliveryData.deliveryFromTime"
                                    :label="isTimeSlotOptionSelected ? $t('FIELD.FROM') : ''"
                                    :disabled="disabled"
                                    :is-invalid="errors && errors.length > 0 ? true : false"
                                    @change="
                                        setDeliveryFromTime({ leg, time: $event.displayTime });
                                        validateDeliveryDateTimeFields();
                                    "
                                />
                            </ValidationProvider>
                        </div>

                        <template v-if="isTimeSlotOptionSelected">
                            <div class="delivery-leg-delivery-section_time_separator">-</div>
                            <div class="delivery-leg-delivery-section_time_picker">
                                <ValidationProvider
                                    v-slot="{ errors }"
                                    ref="deliveryToTimeValidationProvider"
                                    mode="eager"
                                    :name="`leg/${legIndex}/delivery/delivery-to-time`"
                                    :rules="{
                                        required: isDeliveryTimeRequired,
                                        deliveryDateTimeRequired: isDeliveryTimeRequired
                                            ? {
                                                  date: leg.deliveryData.deliveryOnDate,
                                                  timeOption: leg.deliveryData.deliveryTimeOption,
                                                  fromTime: leg.deliveryData.deliveryFromTime,
                                                  toTime: leg.deliveryData.deliveryToTime,
                                              }
                                            : undefined,
                                    }"
                                >
                                    <TimeInput
                                        :id="`leg/${legIndex}/delivery/delivery-to-time`"
                                        :data-test="`leg/${legIndex}/delivery/delivery-to-time`"
                                        :value="leg.deliveryData.deliveryToTime"
                                        :label="isTimeSlotOptionSelected ? $t('FIELD.TO') : ''"
                                        :disabled="disabled"
                                        :is-invalid="errors && errors.length > 0 ? true : false"
                                        @change="
                                            setDeliveryToTime({ leg, time: $event.displayTime });
                                            validateDeliveryDateTimeFields();
                                        "
                                    />
                                </ValidationProvider>
                            </div>
                        </template>

                        <div
                            class="delivery-leg-delivery-section_time_zone"
                            :class="{ 'delivery-leg-delivery-section_time_zone_margin-top': isTimeSlotOptionSelected }"
                        >
                            <mc-input
                                :data-test="`leg/${legIndex}/delivery/delivery-time-zone`"
                                :fit="mdsComponentFit.input"
                                type="text"
                                disabled
                                :label="''"
                                :value="leg.deliveryData.deliveryTimeZone || 'UTC'"
                            />
                        </div>
                    </div>
                    <div class="delivery-leg-delivery-section_time_error">
                        {{ getDeliveryPlanTimeValidationError(validationObserverErrors) }}
                    </div>
                </Column>
            </Row>

            <Row class="delivery-leg-delivery-section_row">
                <Column :xs="6">
                    <mc-input
                        :data-test="`leg/${legIndex}/delivery/delivery-reference`"
                        :fit="mdsComponentFit.input"
                        type="text"
                        :clearbutton="true"
                        name="deliveryReference"
                        :label="$t('FIELD.DELIVERY_REFERENCE')"
                        :value="leg.deliveryData.deliveryReference"
                        :disabled="disabled"
                        @input="setDeliveryReference({ leg, deliveryReference: $event.target.value })"
                    />
                </Column>
            </Row>

            <Row class="delivery-leg-delivery-section_row">
                <Column :xs="12">
                    <ButtonGroupSwitch
                        :data-test="`leg/${legIndex}/delivery/delivery-type`"
                        :label="$t('FIELD.DELIVERY_TYPE')"
                        :disabled="isDeliveryTypeDisabled || disabled"
                        :options="deliveryTypeOptions"
                        :value="leg.deliveryData.deliveryType"
                        @change="setDeliveryType({ leg, deliveryType: $event.value })"
                    />
                </Column>
            </Row>
        </ValidationObserver>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-input';
import '@maersk-global/mds-components-core/mc-input-date';
import Vue, { PropType } from 'vue';
import { mapMutations } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { Row, Column } from '@scm-ui/grid-system';
import TimeInput from 'destination/components/time-input';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { getDeliveryTimeOptions, getDeliveryTypeOptions } from '@/components/delivery-plan/static';
import { getDeliveryPlanMinimumDate, getDeliveryPlanTimeValidationError } from '@/components/delivery-plan/logic';
import i18n from '@/i18n';
import ButtonGroupSwitch from '@/components/button-group-switch/button-group-switch.vue';
import LocationField from '@/components/location-field/location-field.vue';
import LocationPicker from '@/components/location-picker/location-picker.vue';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanMutationEnum } from '@/store/modules/delivery-plan/static';
import { isServiceLegStatusSentOrAccepted } from '@/store/modules/delivery-plan/logic';
import { MDS_COMPONENT_FIT, ServiceLegDeliveryTimeOptionEnum, ServicePlanTransportModeEnum } from '@/static';
import { ICargoStuffingDetails, IServiceLeg } from '@/interfaces';

import './styles/delivery-leg-delivery-section.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'delivery-leg-delivery-section',

    i18n,

    components: {
        TimeInput,
        ValidationObserver,
        ValidationProvider,
        Row,
        Column,
        ButtonGroupSwitch,
        LocationField,
        LocationPicker,
    },

    props: {
        details: {
            type: Object as PropType<{ result: ICargoStuffingDetails }>,
            required: true,
        },
        leg: {
            type: Object as PropType<IServiceLeg>,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        legIndex: {
            type: Number,
            required: true,
        },
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        isLegStatusSentOrAccepted() {
            return isServiceLegStatusSentOrAccepted(this.leg);
        },
        deliveryDateMinimumValue() {
            return getDeliveryPlanMinimumDate(this.details);
        },
        deliveryTimeOptions() {
            return getDeliveryTimeOptions();
        },
        deliveryTypeOptions() {
            return getDeliveryTypeOptions();
        },
        isDeliveryTimeRequired() {
            return this.leg.transportData.transportMode === ServicePlanTransportModeEnum.ROAD;
        },
        isDeliveryTypeDisabled() {
            return this.leg.transportData.transportMode !== ServicePlanTransportModeEnum.ROAD;
        },
        isTimeSlotOptionSelected() {
            return this.leg.deliveryData.deliveryTimeOption === ServiceLegDeliveryTimeOptionEnum.TIME_SLOT;
        },
    },

    watch: {
        'leg.pickupData.pickUpAddress.beCode'() {
            const deliveryLocationPicker = this.$refs.deliveryLocationPicker as any;
            if (!deliveryLocationPicker) {
                return;
            }

            deliveryLocationPicker.validate();
        },
        isDeliveryTimeRequired(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.validateDeliveryDateTimeFields();
            }
        },
    },

    methods: {
        ...mapMutations(DELIVERY_PLAN_NAMESPACE, {
            setDeliveryTimeZoneAndOffset: DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET,
            setDeliveryLocation: DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION,
            setDeliveryOnDate: DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE,
            setDeliveryTimeOption: DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION,
            setDeliveryFromTime: DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME,
            setDeliveryToTime: DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME,
            setDeliveryReference: DeliveryPlanMutationEnum.SET_DELIVERY_REFERENCE,
            setDeliveryType: DeliveryPlanMutationEnum.SET_DELIVERY_TYPE,
        }),
        getDeliveryPlanTimeValidationError,
        validateDeliveryDateTimeFields() {
            this.$nextTick(() => {
                [
                    {
                        provider: this.$refs.deliveryOnDateValidationProvider as InstanceType<typeof ValidationProvider>,
                        value: this.leg.deliveryData.deliveryOnDate,
                    },
                    {
                        provider: this.$refs.deliveryFromTimeValidationProvider as InstanceType<typeof ValidationProvider>,
                        value: this.leg.deliveryData.deliveryFromTime,
                    },
                    {
                        provider: this.$refs.deliveryToTimeValidationProvider as InstanceType<typeof ValidationProvider>,
                        value: this.leg.deliveryData.deliveryToTime,
                    },
                ]
                    .filter(({ provider }) => provider)
                    .forEach(({ provider, value }) => {
                        provider.syncValue(value);
                        provider.validate();
                    });
            });
        },
    },
});
</script>
