<template>
    <div class="empty-return-leg">
        <ValidationObserver ref="validationObserver" v-slot="{ errors: validationObserverErrors }">
            <Row v-show="isLegSent" class="empty-return-leg_header_info">
                <Column :xs="12" :md="6" :lg="3">
                    <TextField data-test="empty-return-leg/header/delivery-order" :label="$t('FIELD.DELIVERY_ORDER')" :value="leg.deliveryOrder" />
                </Column>
                <Column :xs="12" :md="6" :lg="3">
                    <TextField data-test="empty-return-leg/header/version" :label="$t('FIELD.VERSION')" :value="leg.version" />
                </Column>
            </Row>

            <Row class="empty-return-leg_row">
                <Column :xs="12" :md="6" :lg="3">
                    <Row class="empty-return-leg_row">
                        <Column :xs="10">
                            <mc-checkbox
                                data-test="empty-return-leg/empty-return/location/same-as-checkbox"
                                name="isSameAsPickupLocation"
                                :label="$t('FIELD.SAME_AS_PICK_UP_LOCATION')"
                                :checked="isSameAsPickupLocation"
                                :value="isSameAsPickupLocation"
                                @change="onSameAsPickupLocationChange"
                            />
                        </Column>
                    </Row>

                    <Row class="empty-return-leg_row">
                        <Column class="justify-content-center" :xs="10">
                            {{ $t('FIELD.OR').toString().toUpperCase() }}
                        </Column>
                    </Row>

                    <Row class="empty-return-leg_row">
                        <Column :xs="10">
                            <LocationPicker
                                id="empty-return-leg/empty-return/location"
                                data-test="empty-return-leg/empty-return/location/location-picker"
                                :label="$t('FIELD.EMPTY_RETURN_LOCATION')"
                                :disabled="isSameAsPickupLocation"
                                :required="true"
                                :value="leg.deliveryData.deliveryAddress.beCode"
                                @change="onEmptyReturnLocationChange"
                            />
                        </Column>
                    </Row>

                    <Row v-if="leg.deliveryData.deliveryAddress.beCode" class="empty-return-leg_row">
                        <Column :xs="12">
                            <LocationField
                                data-test="empty-return-leg/empty-return/location/location-field"
                                :name="leg.deliveryData.deliveryAddress.displayName"
                                :address="leg.deliveryData.deliveryAddress.displayText"
                            />
                        </Column>
                    </Row>
                </Column>

                <Column :xs="12" :md="6" :lg="3">
                    <Row class="empty-return-leg_row">
                        <Column :xs="10">
                            <mc-checkbox
                                data-test="empty-return-leg/empty-return/provider/same-as-checkbox"
                                name="isSameAsLastLegProvider"
                               
                                :label="$t('FIELD.SAME_AS_LAST_LEG_PROVIDER')"
                                :disabled="isLegSent"
                                :checked="isSameAsLastLegProvider"
                                :value="isSameAsLastLegProvider"
                                @change="onSameAsLastLegProviderChange"
                            />
                        </Column>
                    </Row>

                    <Row class="empty-return-leg_row">
                        <Column class="justify-content-center" :xs="10">
                            {{ $t('FIELD.OR').toString().toUpperCase() }}
                        </Column>
                    </Row>

                    <Row class="empty-return-leg_row">
                        <Column :xs="10">
                            <TransportProviderPicker
                                id="empty-return-leg/empty-return/provider"
                                data-test="empty-return-leg/empty-return/provider/transport-provider-picker"
                                :label="$t('FIELD.EMPTY_RETURN_PROVIDER')"
                                :disabled="isLegSent || isSameAsLastLegProvider"
                                :required="true"
                                :value="leg.transportData.provider.providerBECode"
                                @change="onEmptyReturnProviderChange"
                            />
                        </Column>
                    </Row>

                    <Row v-if="leg.transportData.provider.providerBECode" class="empty-return-leg_row">
                        <Column :xs="12">
                            <TransportProviderField
                                data-test="empty-return-leg/empty-return/provider/transport-provider-field"
                                :name="leg.transportData.provider.providerName"
                                :code="leg.transportData.provider.providerBECode"
                            />
                        </Column>
                    </Row>
                </Column>

                <Column :xs="12" :md="6" :lg="3">
                    <div>{{ $t('FIELD.EMPTY_RETURN_REF') }}</div>
                    <div data-test="empty-return-leg/empty-return/reference" >{{ emptyReturnReference ? emptyReturnReference : '-' }}</div>
                </Column>

                <Column :xs="12" :md="6" :lg="3">
                    <div>{{ $t('FIELD.EMPTY_RETURN_REF_EXPIRY') }}</div>
                    <div data-test="empty-return-leg/empty-return/expiry">{{ emptyReturnReferenceExpiry ? emptyReturnReferenceExpiry : '-' }}</div>
                </Column>
            </Row>

            <Row class="empty-return-leg_row">
                <Column :xs="12" :md="6" :lg="3">
                    <Row class="empty-return-leg_row">
                        <Column :xs="7">
                            <ValidationProvider
                                v-slot="{ errors }"
                                ref="collectionDateValidationProvider"
                                mode="eager"
                                name="empty-return-leg/empty-return/collection-date"
                                :rules="{
                                    deliveryDateTimeRequired: {
                                        date: leg.deliveryData.deliveryOnDate,
                                        timeOption: leg.deliveryData.deliveryTimeOption,
                                        fromTime: leg.deliveryData.deliveryFromTime,
                                        toTime: leg.deliveryData.deliveryToTime,
                                    },
                                    minimumDate: {
                                        date: deliveryDateMinimumValue,
                                    },
                                }"
                            >
                                <mc-input-date
                                    data-test="empty-return-leg/empty-return/collection-date"
                                    :fit="mdsComponentFit.inputDate"
                                    :format="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                                    :label="`${$t('FIELD.COLLECTION_DATE')} ${$t('FIELD.OPTIONAL')}`"
                                    :placeholder="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                                    :min="deliveryDateMinimumValue"
                                    :invalid="errors && errors.length > 0"
                                    :errormessage="errors && errors[0]"
                                    :value.prop="leg.deliveryData.deliveryOnDate"
                                    @input="
                                        setDeliveryOnDate({ leg, date: $event.target.value });
                                        setDeliveryTimeZoneAndOffset({ leg, date: $event.target.value });
                                        validateCollectionDateTimeFields();
                                    "
                                />
                            </ValidationProvider>
                        </Column>
                    </Row>
                </Column>

                <Column :xs="12" :md="6" :lg="3">
                    <Row class="empty-return-leg_row">
                        <Column :xs="12">
                            <ButtonGroupSwitch
                                data-test="empty-return-leg/empty-return/collection-time-option"
                                :label="`${$t('FIELD.COLLECTION_TIME_OPTION')} ${$t('FIELD.OPTIONAL')}`"
                                :options="deliveryTimeOptions"
                                :value="leg.deliveryData.deliveryTimeOption"
                                @change="
                                    setDeliveryTimeOption({ leg, deliveryTimeOption: $event.value });
                                    validateCollectionDateTimeFields();
                                "
                            />
                        </Column>
                    </Row>
                </Column>

                <Column :xs="12" :md="6" :lg="3">
                    <Row class="empty-return-leg_row">
                        <Column :xs="12">
                            <div class="empty-return-leg_time">
                                <span class="empty-return-leg_time_label">{{ $t('DELIVERY_PLAN.TIME_HH_MM') }}</span>

                                <div class="empty-return-leg_time_picker">
                                    <ValidationProvider
                                        v-slot="{ errors }"
                                        ref="collectionFromTimeValidationProvider"
                                        mode="eager"
                                        name="empty-return-leg/empty-return/collection-from-time"
                                        :rules="{
                                            deliveryDateTimeRequired: {
                                                date: leg.deliveryData.deliveryOnDate,
                                                timeOption: leg.deliveryData.deliveryTimeOption,
                                                fromTime: leg.deliveryData.deliveryFromTime,
                                                toTime: leg.deliveryData.deliveryToTime,
                                            },
                                        }"
                                    >
                                        <TimeInput
                                            :id="`empty-return-leg/empty-return/collection-from-time`"
                                            data-test="empty-return-leg/empty-return/collection-from-time"
                                            :value="leg.deliveryData.deliveryFromTime"
                                            :label="isTimeSlotOptionSelected ? $t('FIELD.FROM') : ''"
                                            :is-invalid="errors && errors.length > 0"
                                            @change="
                                                setDeliveryFromTime({ leg, time: $event.displayTime });
                                                validateCollectionDateTimeFields();
                                            "
                                        />
                                    </ValidationProvider>
                                </div>

                                <template v-if="isTimeSlotOptionSelected">
                                    <div class="empty-return-leg_time_separator">-</div>
                                    <div class="empty-return-leg_time_picker">
                                        <ValidationProvider
                                            v-slot="{ errors }"
                                            ref="collectionToTimeValidationProvider"
                                            mode="eager"
                                            name="empty-return-leg/empty-return/collection-to-time"
                                            :rules="{
                                                deliveryDateTimeRequired: {
                                                    date: leg.deliveryData.deliveryOnDate,
                                                    timeOption: leg.deliveryData.deliveryTimeOption,
                                                    fromTime: leg.deliveryData.deliveryFromTime,
                                                    toTime: leg.deliveryData.deliveryToTime,
                                                },
                                            }"
                                        >
                                            <TimeInput
                                                :id="`empty-return-leg/empty-return/collection-to-time`"
                                                data-test="empty-return-leg/empty-return/collection-to-time"
                                                :value="leg.deliveryData.deliveryToTime"
                                                :label="isTimeSlotOptionSelected ? $t('FIELD.TO') : ''"
                                                :is-invalid="errors && errors.length > 0"
                                                @change="
                                                    setDeliveryToTime({ leg, time: $event.displayTime });
                                                    validateCollectionDateTimeFields();
                                                "
                                            />
                                        </ValidationProvider>
                                    </div>
                                </template>

                                <div class="empty-return-leg_time_zone" :class="{ 'empty-return-leg_time_zone_margin-top': isTimeSlotOptionSelected }">
                                    <mc-input
                                        data-test="empty-return-leg/empty-return/collection-time-zone"
                                        :fit="mdsComponentFit.input"
                                        type="text"
                                        disabled
                                        :label="''"
                                        :value="leg.deliveryData.deliveryTimeZone || 'UTC'"
                                    />
                                </div>
                            </div>
                            <div class="empty-return-leg_time_error">
                                {{ getDeliveryPlanTimeValidationError(validationObserverErrors) }}
                            </div>
                        </Column>
                    </Row>
                </Column>

                <Column :xs="12" :md="6" :lg="3">
                    <Row class="empty-return-leg_row">
                        <Column :xs="12">
                            <mc-textarea
                                data-test="empty-return-leg/empty-return/instruction"
                                :fit="mdsComponentFit.textarea"
                                :rows="5"
                                :maxlength="2000"
                                name="additionalInstruction"
                                :label="`${$t('FIELD.INSTRUCTIONS')} ${$t('FIELD.OPTIONAL')}`"
                                :value="leg.transportData.additionalInstruction || ''"
                                @input="setAdditionalInstruction({ leg, additionalInstruction: $event.target.value })"
                            />
                        </Column>
                    </Row>
                </Column>
            </Row>
        </ValidationObserver>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-checkbox';
import '@maersk-global/mds-components-core/mc-input';
import '@maersk-global/mds-components-core/mc-input-date';
import '@maersk-global/mds-components-core/mc-textarea';
import Vue, { PropType } from 'vue';
import { mapMutations } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { isEmpty } from 'lodash';
import { Row, Column } from '@scm-ui/grid-system';
import TextField from 'destination/components/text-field';
import TimeInput from 'destination/components/time-input';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { getEmptyReturnReferenceValue, getEmptyReturnReferenceExpiryValue } from './logic';
import { getDeliveryTimeOptions } from '@/components/delivery-plan/static';
import { getDeliveryPlanMinimumDate, getDeliveryPlanTimeValidationError } from '@/components/delivery-plan/logic';
import i18n from '@/i18n';
import ButtonGroupSwitch from '@/components/button-group-switch/button-group-switch.vue';
import LocationField from '@/components/location-field/location-field.vue';
import LocationPicker from '@/components/location-picker/location-picker.vue';
import TransportProviderField from '@/components/transport-provider-field/transport-provider-field.vue';
import TransportProviderPicker from '@/components/transport-provider-picker/transport-provider-picker.vue';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanMutationEnum } from '@/store/modules/delivery-plan/static';
import { isServiceLegSent } from '@/store/modules/delivery-plan/logic';
import { locationCache } from '@/store/modules/delivery-plan/utilities';
import { MDS_COMPONENT_FIT, ServiceLegDeliveryTimeOptionEnum, PlanningStatusEnum } from '@/static';
import { ICargoStuffingDetails, IServicePlan, IServiceLeg, ILocationFullAddress, ITransportProvider } from '@/interfaces';

import './styles/empty-return-leg.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'empty-return-leg',

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
        TransportProviderField,
        TransportProviderPicker,
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
        firstActiveLeg: {
            type: Object as PropType<IServiceLeg>,
            required: true,
        },
        lastActiveLeg: {
            type: Object as PropType<IServiceLeg>,
            required: true,
        },
    },

    data() {
        return {
            isSameAsPickupLocation: false,
            isSameAsLastLegProvider: false,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        isLegSent(): boolean {
            return isServiceLegSent(this.leg);
        },
        emptyReturnReference() {
            return getEmptyReturnReferenceValue(this.details);
        },
        emptyReturnReferenceExpiry() {
            return getEmptyReturnReferenceExpiryValue(this.details);
        },
        deliveryDateMinimumValue() {
            return getDeliveryPlanMinimumDate(this.details);
        },
        deliveryTimeOptions() {
            return getDeliveryTimeOptions();
        },
        firstActiveLegPickupAddress() {
            return this.firstActiveLeg.pickupData.pickUpAddress;
        },
        lastActiveLegTransportProvider() {
            return this.lastActiveLeg.transportData.provider;
        },
        isTimeSlotOptionSelected() {
            return this.leg.deliveryData.deliveryTimeOption === ServiceLegDeliveryTimeOptionEnum.TIME_SLOT;
        },
    },

    watch: {
        firstActiveLegPickupAddress() {
            if (this.isSameAsPickupLocation) {
                this.setEmptyReturnLocationFromFirstLeg();
            } else {
                this.checkAndSetIsSameAsPickupLocation();
            }
        },
        lastActiveLegTransportProvider() {
            if (this.isSameAsLastLegProvider) {
                this.setEmptyReturnProviderFromLastLeg();
            } else {
                this.checkAndSetIsSameAsLastLegProvider();
            }
        },
    },

    created() {
        const planningStatus = this.deliveryPlan.response.planningStatus;
        if (planningStatus === PlanningStatusEnum.INITIAL || planningStatus === PlanningStatusEnum.READY_TO_PLAN) {
            // Set location checkbox as default selected and set empty return location from first leg
            this.isSameAsPickupLocation = true;
            this.setEmptyReturnLocationFromFirstLeg();

            // Set provider checkbox as default selected and set empty return provider from last leg
            this.isSameAsLastLegProvider = true;
            this.setEmptyReturnProviderFromLastLeg();
        } else {
            // Check and set location and provider checkboxes
            this.checkAndSetIsSameAsPickupLocation();
            this.checkAndSetIsSameAsLastLegProvider();
        }
    },

    methods: {
        ...mapMutations(DELIVERY_PLAN_NAMESPACE, {
            setDeliveryTimeZoneAndOffset: DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET,
            setDeliveryLocation: DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION,
            setDeliveryOnDate: DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE,
            setDeliveryTimeOption: DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION,
            setDeliveryFromTime: DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME,
            setDeliveryToTime: DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME,
            setTransportProvider: DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER,
            setAdditionalInstruction: DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION,
        }),
        getDeliveryPlanTimeValidationError,
        validateCollectionDateTimeFields() {
            this.$nextTick(() => {
                [
                    {
                        provider: this.$refs.collectionDateValidationProvider as InstanceType<typeof ValidationProvider>,
                        value: this.leg.deliveryData.deliveryOnDate,
                    },
                    {
                        provider: this.$refs.collectionFromTimeValidationProvider as InstanceType<typeof ValidationProvider>,
                        value: this.leg.deliveryData.deliveryFromTime,
                    },
                    {
                        provider: this.$refs.collectionToTimeValidationProvider as InstanceType<typeof ValidationProvider>,
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
        checkAndSetIsSameAsPickupLocation() {
            const beCode = this.leg.deliveryData.deliveryAddress.beCode;
            const firstActiveLegBeCode = this.firstActiveLegPickupAddress.beCode;
            this.isSameAsPickupLocation = !isEmpty(beCode) && !isEmpty(firstActiveLegBeCode) && beCode === firstActiveLegBeCode;
        },
        checkAndSetIsSameAsLastLegProvider() {
            if (this.isLegSent) {
                this.isSameAsLastLegProvider = false;
            } else {
                const providerBECode = this.leg.transportData.provider.providerBECode;
                const lastActiveLegProviderBECode = this.lastActiveLegTransportProvider.providerBECode;
                this.isSameAsLastLegProvider =
                    !isEmpty(providerBECode) && !isEmpty(lastActiveLegProviderBECode) && providerBECode === lastActiveLegProviderBECode;
            }
        },
        async setEmptyReturnLocationFromFirstLeg() {
            const location: ILocationFullAddress = (await locationCache.getLocation(this.firstActiveLegPickupAddress.beCode as string)) as ILocationFullAddress;
            this.setDeliveryLocation({ leg: this.leg, location });
            this.setDeliveryTimeZoneAndOffset({ leg: this.leg, location });
        },
        setEmptyReturnProviderFromLastLeg() {
            const provider: ITransportProvider = {
                partyCode: this.lastActiveLegTransportProvider.providerBECode as string,
                partyName: this.lastActiveLegTransportProvider.providerName as string,
            };
            this.setTransportProvider({ leg: this.leg, provider });
        },
        onSameAsPickupLocationChange(event: CustomEvent) {
            this.isSameAsPickupLocation = (event.target as HTMLInputElement).checked;
            if (this.isSameAsPickupLocation) {
                this.setEmptyReturnLocationFromFirstLeg();
            }
        },
        onSameAsLastLegProviderChange(event: CustomEvent) {
            this.isSameAsLastLegProvider = (event.target as HTMLInputElement).checked;
            if (this.isSameAsLastLegProvider) {
                this.setEmptyReturnProviderFromLastLeg();
            }
        },
        onEmptyReturnLocationChange(location: ILocationFullAddress) {
            this.setDeliveryLocation({ leg: this.leg, location });
            this.setDeliveryTimeZoneAndOffset({ leg: this.leg, location });
            this.checkAndSetIsSameAsPickupLocation();
        },
        onEmptyReturnProviderChange(provider: ITransportProvider) {
            this.setTransportProvider({ leg: this.leg, provider });
            this.checkAndSetIsSameAsLastLegProvider();
        },
    },
});
</script>
