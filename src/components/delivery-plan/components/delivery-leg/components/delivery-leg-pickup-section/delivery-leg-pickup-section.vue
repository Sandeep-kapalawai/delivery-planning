<template>
    <div class="delivery-leg-pickup-section">
        <ValidationObserver>
            <div class="delivery-leg-pickup-section_header">{{ $t('FIELD.PICK_UP') }}</div>

            <Row class="delivery-leg-pickup-section_row">
                <Column :xs="10">
                    <LocationPicker
                        :id="`leg/${legIndex}/pickup/location`"
                        ref="pickupLocationPicker"
                        :data-test="`leg/${legIndex}/pickup/location/location-picker`"
                        :required="true"
                        :rules="{
                            uniquePickUpAndDeliveryLocation: {
                                pickUpLocation: leg.pickupData.pickUpAddress.beCode,
                                deliveryLocation: leg.deliveryData.deliveryAddress.beCode,
                            },
                        }"
                        :value="leg.pickupData.pickUpAddress.beCode"
                        :disabled="disabled"
                        @change="
                            setPickupLocation({ leg, location: $event });
                            setPickupTimeZoneAndOffset({ leg, location: $event });
                        "
                    />
                </Column>
            </Row>

            <Row v-if="leg.pickupData.pickUpAddress.beCode" class="delivery-leg-pickup-section_row">
                <Column :xs="12">
                    <LocationField
                        :data-test="`leg/${legIndex}/pickup/location/location-field`"
                        :name="leg.pickupData.pickUpAddress.displayName"
                        :address="leg.pickupData.pickUpAddress.displayText"
                        :disabled="disabled"
                    />
                </Column>
            </Row>

            <Row class="delivery-leg-pickup-section_row">
                <Column :xs="6">
                    <ValidationProvider
                        v-slot="{ errors }"
                        ref="pickupOnDateValidationProvider"
                        mode="eager"
                        :name="`leg/${legIndex}/pickup/pickup-on-date`"
                        :rules="{
                            required: isPickupDateRequired,
                            minimumDate: {
                                disabled: isLegStatusSentOrAccepted,
                                date: pickupDateMinimumValue,
                            },
                        }"
                    >
                        <mc-input-date
                            :data-test="`leg/${legIndex}/pickup/pickup-on-date`"
                            :fit="mdsComponentFit.inputDate"
                            :format="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                            :label="$t('FIELD.PICK_UP_ON')"
                            :placeholder="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                            :required="isPickupDateRequired"
                            :min="pickupDateMinimumValue"
                            :invalid="errors && errors.length > 0"
                            :errormessage="errors && errors[0]"
                            :value.prop="leg.pickupData.pickupOnDate"
                            :disabled="disabled"
                            @input="
                                setPickupOnDate({ leg, date: $event.target.value });
                                setPickupTimeZoneAndOffset({ leg, date: $event.target.value });
                                validatePickupDateTimeFields();
                            "
                        />
                    </ValidationProvider>
                </Column>
            </Row>

            <Row class="delivery-leg-pickup-section_row">
                <Column :xs="12">
                    <div class="delivery-leg-pickup-section_time">
                        <span class="delivery-leg-pickup-section_time_label">{{ $t('DELIVERY_PLAN.TIME_HH_MM') }}</span>

                        <div class="delivery-leg-pickup-section_time_picker">
                            <ValidationProvider ref="pickupFromTimeValidationProvider" mode="eager" :name="`leg/${legIndex}/pickup/pickup-from-time`">
                                <TimeInput
                                    :id="`leg/${legIndex}/pickup/pickup-from-time`"
                                    :data-test="`leg/${legIndex}/pickup/pickup-from-time`"
                                    :value="leg.pickupData.pickupFromTime"
                                    :disabled="disabled"
                                    @change="
                                        setPickupFromTime({ leg, time: $event.displayTime });
                                        validatePickupDateTimeFields();
                                    "
                                />
                            </ValidationProvider>
                        </div>

                        <div class="delivery-leg-pickup-section_time_zone">
                            <mc-input
                                :data-test="`leg/${legIndex}/pickup/pickup-time-zone`"
                                :fit="mdsComponentFit.input"
                                type="text"
                                disabled
                                :label="''"
                                :value="leg.pickupData.pickupDateTimeZone || 'UTC'"
                            />
                        </div>
                    </div>
                </Column>
            </Row>

            <template v-if="isFirstLeg">
                <Row class="delivery-leg-pickup-section_row">
                    <Column :xs="6">
                        <TextField :data-test="`leg/${legIndex}/pickup/last-free-date`" :label="$t('FIELD.LAST_FREE_DATE')" :value="lastFreeDate" />
                    </Column>
                    <Column :xs="6">
                        <TextField :data-test="`leg/${legIndex}/pickup/expiry`" :label="$t('FIELD.EXPIRY')" :value="pickupReferenceExpiry" />
                    </Column>
                </Row>
                <Row class="delivery-leg-pickup-section_row">
                    <Column :xs="6">
                        <TextField :data-test="`leg/${legIndex}/pickup/reference`" :label="$t('FIELD.PICK_UP_REF')" :value="pickupReference" />
                    </Column>
                </Row>
            </template>

            <Row v-if="isFirstLeg" class="delivery-leg-pickup-section_row">
                <Column :xs="12">
                    <ButtonGroupSwitch
                        :data-test="`leg/${legIndex}/pickup/special-instruction`"
                        :label="$t('FIELD.SPECIAL_INSTRUCTION')"
                        :options="specialInstructionOptions"
                        :value="leg.pickupData.specialInstruction"
                        :disabled="disabled"
                        @change="setSpecialInstruction({ leg, specialInstruction: $event.value })"
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
import TextField from 'destination/components/text-field';
import TimeInput from 'destination/components/time-input';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { getLastFreeDateValue, getPickupReferenceExpiryValue, getPickupReferenceValue } from './logic';
import { getSpecialInstructionOptions } from '@/components/delivery-plan/static';
import { getDeliveryPlanMinimumDate } from '@/components/delivery-plan/logic';
import i18n from '@/i18n';
import ButtonGroupSwitch from '@/components/button-group-switch/button-group-switch.vue';
import LocationField from '@/components/location-field/location-field.vue';
import LocationPicker from '@/components/location-picker/location-picker.vue';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanMutationEnum } from '@/store/modules/delivery-plan/static';
import { isServiceLegStatusSentOrAccepted } from '@/store/modules/delivery-plan/logic';
import { MDS_COMPONENT_FIT, ServicePlanTransportModeEnum } from '@/static';
import { ICargoStuffingDetails, IServicePlan, IServiceLeg } from '@/interfaces';

import './styles/delivery-leg-pickup-section.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'delivery-leg-pickup-section',

    i18n,

    components: {
        TimeInput,
        ValidationObserver,
        ValidationProvider,
        Row,
        Column,
        TextField,
        ButtonGroupSwitch,
        LocationField,
        LocationPicker,
    },

    props: {
        details: {
            type: Object as PropType<{ result: ICargoStuffingDetails }>,
            required: true,
        },
        deliveryPlan: {
            type: Object as PropType<{ response: IServicePlan }>,
            required: true,
        },
        leg: {
            type: Object as PropType<IServiceLeg>,
            required: true,
        },
        legIndex: {
            type: Number,
            required: true,
        },
        isFirstLeg: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        isLegStatusSentOrAccepted() {
            return isServiceLegStatusSentOrAccepted(this.leg);
        },
        isPickupDateRequired() {
            return this.leg.transportData.transportMode !== ServicePlanTransportModeEnum.ROAD;
        },
        pickupDateMinimumValue() {
            return getDeliveryPlanMinimumDate(this.details);
        },
        specialInstructionOptions() {
            return getSpecialInstructionOptions();
        },
        lastFreeDate() {
            return getLastFreeDateValue(this.deliveryPlan);
        },
        pickupReferenceExpiry() {
            return getPickupReferenceExpiryValue(this.details);
        },
        pickupReference() {
            return getPickupReferenceValue(this.details);
        },
    },

    watch: {
        'leg.deliveryData.deliveryAddress.beCode'() {
            const pickupLocationPicker = this.$refs.pickupLocationPicker as any;
            if (!pickupLocationPicker) {
                return;
            }

            pickupLocationPicker.validate();
        },
    },

    methods: {
        ...mapMutations(DELIVERY_PLAN_NAMESPACE, {
            setPickupTimeZoneAndOffset: DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET,
            setPickupLocation: DeliveryPlanMutationEnum.SET_PICKUP_LOCATION,
            setPickupOnDate: DeliveryPlanMutationEnum.SET_PICKUP_ON_DATE,
            setPickupFromTime: DeliveryPlanMutationEnum.SET_PICKUP_FROM_TIME,
            setSpecialInstruction: DeliveryPlanMutationEnum.SET_SPECIAL_INSTRUCTION,
        }),
        validatePickupDateTimeFields() {
            this.$nextTick(() => {
                [
                    {
                        provider: this.$refs.pickupOnDateValidationProvider as InstanceType<typeof ValidationProvider>,
                        value: this.leg.pickupData.pickupOnDate,
                    },
                    {
                        provider: this.$refs.pickupFromTimeValidationProvider as InstanceType<typeof ValidationProvider>,
                        value: this.leg.pickupData.pickupFromTime,
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
