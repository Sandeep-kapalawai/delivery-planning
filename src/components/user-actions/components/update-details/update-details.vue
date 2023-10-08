<template>
    <PreviewPanel
        class="update-details"
        panel-width="1220px"
        :is-open="showUpdateDetails"
        :title="$t('FIELD.UPDATE_DETAILS')"
        @close-panel="closeUpdateDetails"
    >
        <DestinationNotifications :component="notificationComponentEnum.DP_UPDATE_DETAILS" :position="notificationPositionEnum.absolute" />

        <div v-if="selectedRows.size > 1" class="update-details_mc-notification-wrapper">
            <mc-notification
                data-test="update-details/mc-notification/warning-message-for-updating-multiple-rows"
                appearance="warning"
                icon="info-circle"
                :body="$t('MESSAGE.WARNING_FOR_UPDATING_MULTIPLE_EQUIPMENTS')"
            />
        </div>

        <Row :md="12" :lg="12" :xs="12" :gutter="28" :columns="12">
            <Column :xs="12" :md="3" :lg="3" :columns="12" :gutter="28">
                <div v-if="selectedRows.size > 1" class="container-number" data-test="update-details/container-number">
                    {{ $t('FIELD.N0_OF_EQUIPMENTS') }}: <span class="selected-value"> {{ selectedRows && selectedRows.size }}</span>
                </div>
                <div v-else class="container-number" data-test="update-details/container-number">
                    {{ $t('FIELD.EQUIPMENT_NUMBER') }}: <span class="selected-value"> {{ cargoStuffingNumber }}</span>
                </div>
            </Column>
        </Row>

        <div class="fields">
            <ValidationObserver ref="observer" v-slot="{ dirty, invalid }">
                <ValidationProvider ref="changeDetectionValidationProvider" name="deliveryLocations" :slim="true" />

                <UpdateDetailsSection :title="$t('FIELD.PICK_UP_DETAILS')">
                    <Row :md="3" :lg="3" :xs="12" :gutter="28" :columns="12">
                        <Column :xs="12" :md="3" :lg="3" :columns="12" :gutter="28">
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="pickupReference"
                                :rules="{
                                    pickupReferenceRule: {
                                        disabled: selectedRows.size > 1,
                                        pickupReference: '@pickupReference',
                                        pickupReferenceExpiry: '@pickupReferenceExpiry',
                                    },
                                }"
                                :skip-if-empty="false"
                            >
                                <mc-input
                                    data-test="update-details/field-pickupRef"
                                    :fit="mdsComponentFit.input"
                                    :name="$t('FIELD.PICK_UP_REF')"
                                    :value.prop="form.pickupReference"
                                    :label="$t('FIELD.PICK_UP_REF')"
                                    :placeholder="updateDetailsObject.isMultiplePickupReference ? $t('PLACEHOLDERS.MULTIPLE') : ''"
                                    :disabled="loaders.isFetchingDetails || isSaving"
                                    :clearbutton="true"
                                    :invalid="errors && errors.length > 0"
                                    :errormessage="errors && errors[0]"
                                    @input="setPickupReference"
                                />
                            </ValidationProvider>
                        </Column>

                        <Column :xs="12" :md="3" :lg="3" :columns="12" :gutter="28">
                            <ValidationProvider
                                v-slot="{ errors }"
                                vid="pickupReferenceExpiry"
                                :rules="{
                                    pickupReferenceRule: {
                                        disabled: selectedRows.size > 1,
                                        pickupReference: '@pickupReference',
                                        pickupReferenceExpiry: '@pickupReferenceExpiry',
                                    },
                                }"
                                :skip-if-empty="false"
                            >
                                <mc-input-date
                                    data-test="update-details/field-pickupRefExpiry"
                                    :fit="mdsComponentFit.inputDate"
                                    :name="$t('FIELD.PICK_UP_REF_EXPIRY')"
                                    :format="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                                    :label="$t('FIELD.PICK_UP_REF_EXPIRY')"
                                    :placeholder="updateDetailsObject.isMultiplePickupReferenceExpiryDateTime ? $t('PLACEHOLDERS.MULTIPLE') : $t('CONFIGURATION.INPUT_DATE_FORMAT')"
                                    :disabled="loaders.isFetchingDetails || isSaving"
                                    :required="true"
                                    :value.prop="form.pickupReferenceExpiryDateTimeLocal"
                                    :clearbutton="true"
                                    :invalid="errors && errors.length > 0"
                                    :errormessage="errors && errors[0]"
                                    @input="setPickupRefExpiry"
                                />
                            </ValidationProvider>
                        </Column>

                        <template v-if="isEmptyReturnReferenceFieldsEnabled">
                            <Column :xs="12" :md="3" :lg="3" :columns="12" :gutter="28">
                                <ValidationProvider
                                    v-slot="{ errors }"
                                    vid="emptyReturnReference"
                                    :rules="{
                                        emptyReturnReferenceRule: {
                                            disabled: selectedRows.size > 1,
                                            emptyReturnReference: '@emptyReturnReference',
                                            emptyReturnReferenceExpiry: '@emptyReturnReferenceExpiry',
                                        },
                                    }"
                                    :skip-if-empty="false"
                                >
                                    <mc-input
                                        data-test="update-details/field-emptyReturnRef"
                                        :fit="mdsComponentFit.input"
                                        :value.prop="form.emptyReturnReference"
                                        :name="$t('FIELD.EMPTY_RETURN_REF')"
                                        :label="$t('FIELD.EMPTY_RETURN_REF')"
                                        :placeholder="updateDetailsObject.isMultipleEmptyReturnReference ? $t('PLACEHOLDERS.MULTIPLE') : ''"
                                        :disabled="loaders.isFetchingDetails || isSaving"
                                        :invalid="errors && errors.length > 0"
                                        :errormessage="errors && errors[0]"
                                        :clearbutton="true"
                                        @input="setEmptyReturnReference"
                                    />
                                </ValidationProvider>
                            </Column>

                            <Column :xs="12" :md="3" :lg="3" :columns="12" :gutter="28">
                                <ValidationProvider
                                    v-slot="{ errors }"
                                    vid="emptyReturnReferenceExpiry"
                                    :rules="{
                                        emptyReturnReferenceRule: {
                                            disabled: selectedRows.size > 1,
                                            emptyReturnReference: '@emptyReturnReference',
                                            emptyReturnReferenceExpiry: '@emptyReturnReferenceExpiry',
                                        },
                                    }"
                                    :skip-if-empty="false"
                                >
                                    <mc-input-date
                                        data-test="update-details/field-emptyReturnExpiry"
                                        :fit="mdsComponentFit.inputDate"
                                        :name="$t('FIELD.EMPTY_RETURN_REF_EXPIRY')"
                                        :format="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                                        :label="$t('FIELD.EMPTY_RETURN_REF_EXPIRY')"
                                        :placeholder="updateDetailsObject.isMultipleEmptyReturnReferenceExpiryDateTime ? $t('PLACEHOLDERS.MULTIPLE') : $t('CONFIGURATION.INPUT_DATE_FORMAT')"
                                        :disabled="loaders.isFetchingDetails || isSaving"
                                        :required="true"
                                        :clearbutton="true"
                                        :value.prop="form.emptyReturnReferenceExpiryDateTimeLocal"
                                        :invalid="errors && errors.length > 0"
                                        :errormessage="errors && errors[0]"
                                        @input="setEmptyRefExpiry"
                                    />
                                </ValidationProvider>
                            </Column>
                        </template>
                    </Row>
                </UpdateDetailsSection>

                <UpdateDetailsSection :title="$t('FIELD.PROGRAM_DETAILS')">
                    <Row :md="3" :lg="3" :xs="12" :gutter="28" :columns="12">
                        <Column :xs="12" :md="3" :lg="3" :columns="12" :gutter="28">
                            <mc-select
                                data-test="update-details/field-program"
                                :name="$t('FIELD.PROGRAM')"
                                :label="$t('FIELD.PROGRAM')"
                                :placeholder="updateDetailsObject.isMultipleDeliveryPrograms ? $t('PLACEHOLDERS.MULTIPLE') : $t('SELECT')"
                                :fit="mdsComponentFit.select"
                                :value.prop="[form.program]"
                                :options.prop="programDropdownOptions"
                                :disabled="loaders.isDeliveryProgramsLoading || loaders.isFetchingDetails || isSaving"
                                @change="setProgram"
                            />
                        </Column>

                        <Column :xs="12" :md="3" :lg="3" :columns="12" :gutter="28">
                            <mc-select
                                data-test="update-details/field-priority"
                                :name="$t('FIELD.PRIORITY')"
                                :label="$t('FIELD.PRIORITY')"
                                :placeholder="updateDetailsObject.isMultipleDeliveryPriorities ? $t('PLACEHOLDERS.MULTIPLE') : $t('SELECT')"
                                :fit="mdsComponentFit.select"
                                :options.prop="priorityDropdownOptions"
                                :value.prop="[form.deliveryPriorityId]"
                                :disabled="form.program.value === undefined || loaders.isDeliveryProgramsLoading || loaders.isFetchingDetails || isSaving "
                                @change="setPriority"
                            />
                        </Column>

                        <Column :xs="12" :md="3" :lg="3" :columns="12" :gutter="28">
                            <mc-select
                                data-test="update-details/field-specialProgram"
                                :name="$t('FIELD.SPECIAL_PROGRAM')"
                                :label="$t('FIELD.SPECIAL_PROGRAM')"
                                :placeholder="updateDetailsObject.isMultipleSpecialPrograms ? $t('PLACEHOLDERS.MULTIPLE') : $t('SELECT')"
                                :fit="mdsComponentFit.select"
                                :options.prop="specialProgramDropdownOptions"
                                :value.prop="[form.specialProgramId]"
                                :disabled="loaders.isSpecialProgramLoading || loaders.isFetchingDetails || isSaving"
                                @change="setSpecialProgramId"
                            />
                        </Column>
                    </Row>
                </UpdateDetailsSection>

                <UpdateDetailsSection :title="$t('FIELD.GAS_CHECK_DETAILS')">
                    <Row :md="3" :lg="3" :xs="12" :gutter="28" :columns="12">
                        <Column :xs="12" :md="4" :lg="3" :columns="12" :gutter="28">
                            <mc-select
                                data-test="update-details/field-gas-check-required"
                                :fit="mdsComponentFit.select"
                                :name="$t('FIELD.GC_REQUIRED')"
                                :label="$t('FIELD.GC_REQUIRED')"
                                :placeholder="updateDetailsObject.gasCheckDetails.isMultipleGasCheckRequired ? $t('PLACEHOLDERS.MULTIPLE') : $t('SELECT')"
                                :options.prop="gasCheckRequiredOptions"
                                :value.prop="[form.gasCheckRequired]"
                                :disabled="updateDetailsObject.gasCheckDetails.isDisabledGasCheckRequired || loaders.isFetchingDetails || isSaving"
                                :required="false"
                                @change="setGcRequired"
                            />
                        </Column>

                        <Column :xs="12" :md="4" :lg="3" :columns="12" :gutter="28">
                            <mc-select
                                data-test="update-details/field-gas-check-result"
                                :fit="mdsComponentFit.select"
                                :name="$t('FIELD.GC_RESULT')"
                                :label="$t('FIELD.GC_RESULT')"
                                :placeholder="updateDetailsObject.gasCheckDetails.isMultipleGasCheckResult ? $t('PLACEHOLDERS.MULTIPLE') : $t('SELECT')"
                                :options.prop="gasCheckResultOptions"
                                :value.prop="[form.gasCheckResult]"
                                :disabled="updateDetailsObject.gasCheckDetails.isDisabledGasCheckResult || loaders.isFetchingDetails || isSaving"
                                :required="false"
                                @change="setGcResult"
                            />
                        </Column>

                        <Column :xs="12" :md="4" :lg="3" :columns="12" :gutter="28">
                            <mc-input-date
                                data-test="update-details/field-gas-check-requested-by"
                                :fit="mdsComponentFit.inputDate"
                                :name="$t('FIELD.GC_REQUESTED_DATE')"
                                :format="$t('CONFIGURATION.INPUT_DATE_FORMAT')"
                                :label="$t('FIELD.GC_REQUESTED_DATE')"
                                :placeholder="
                                    updateDetailsObject.gasCheckDetails.isMultipleGasCheckRequestedDate
                                        ? $t('PLACEHOLDERS.MULTIPLE')
                                        : $t('CONFIGURATION.INPUT_DATE_FORMAT')
                                "
                                :disabled="updateDetailsObject.gasCheckDetails.isDisabledGasCheckRequestedDate || loaders.isFetchingDetails || isSaving"
                                :clearbutton="true"
                                :value.prop="form.gasCheckRequestedDate"
                                :required="false"
                                @input="setGcRequestDate"
                            />
                        </Column>

                        <Column :xs="12" :md="4" :lg="3" :columns="12" :gutter="28">
                            <mc-input
                                data-test="update-details/field-gas-check-requested-by"
                                :fit="mdsComponentFit.input"
                                :name="$t('FIELD.GC_REQUESTED_BY')"
                                :label="$t('FIELD.GC_REQUESTED_BY')"
                                :placeholder="updateDetailsObject.gasCheckDetails.isMultipleGasCheckRequestedBy ? $t('PLACEHOLDERS.MULTIPLE') : ''"
                                :disabled="updateDetailsObject.gasCheckDetails.isDisabledGasCheckRequestedBy || loaders.isFetchingDetails || isSaving"
                                :clearbutton="true"
                                :value.prop="form.gasCheckRequestedBy"
                                :required="false"
                                @input="setGcRequestedBy"
                            />
                        </Column>
                    </Row>
                </UpdateDetailsSection>

                <Row v-if="selectedRows.size === 1" data-test="update-details/edit-location-details-area" class="edit-location-details">
                    <Column :xs="12" :md="12" :lg="12" :gutter="28">
                        <UpdateDetailsSection :title="$t('FIELD.LOCATION_DETAILS')">
                            <Row v-if="loaders.isFetchingDetails" class="loading-indicator">
                                <mc-loading-indicator :label="$t('MESSAGE.LOADING')" />
                            </Row>
                            <template v-else>
                                <Row :gutter="28">
                                    <Column
                                        v-for="(location, index) in form.finalDeliveryLocations"
                                        :key="'delivery-location-field-' + index"
                                        :xs="12"
                                        :md="3"
                                        :lg="3"
                                        :gutter="28"
                                        class="delivery-location"
                                    >
                                        <div class="location-name">
                                            <div>Location {{ index + 1 }}</div>
                                            <mc-icon
                                                v-if="form.finalDeliveryLocations.length > 1"
                                                data-test="update-details/remove-final-delivery-location-button"
                                                color="#E0280F"
                                                icon="trash"
                                                @click="removeFinalDeliveryLocationField(index)"
                                            />
                                        </div>
                                        <location-picker
                                            :id="'location-picker-' + index"
                                            :value="location.beCode"
                                            :hide-label="true"
                                            :disabled="loaders.isFetchingDetails || isSaving"
                                            :required="true"
                                            :skip-if-empty="false"
                                            :placeholder="$t('PLACEHOLDERS.DELIVERY_LOCATION_SINGLE')"
                                            data-test="update-details/location-picker"
                                            @change="handleLocationChange(index, $event)"
                                        />

                                        <location-field :name="location.name" :address="location.addressLines.join('\n')" />
                                    </Column>
                                </Row>
                                <Row>
                                    <mc-button
                                        class="add-location-button"
                                        variant="secondary"
                                        data-test="update-details/add-final-delivery-location-button"
                                        :label="$t('BUTTONS.ADD_FINAL_DELIVERY_LOCATION')"
                                        icon="plus"
                                        :disabled="form.finalDeliveryLocations.length > 4"
                                        :fit="mdsComponentFit.button"
                                        @click="addFinalDeliveryLocationField"
                                    />
                                </Row>
                            </template>
                        </UpdateDetailsSection>
                    </Column>
                </Row>

                <Row class="submit_row" :gutter="16" :columns="12" :lg="12" :md="12" :xs="12">
                    <Column class="submit_column" :xs="6" :md="6" :lg="6" :columns="12" :gutter="0">
                        <mc-button
                            data-test="update-details/save"
                            :fit="mdsComponentFit.button"
                            :label="$t('BUTTONS.SAVE')"
                            :loading="isSaving"
                            :disabled="!dirty || (dirty && invalid)"
                            @click="save"
                        />
                        <mc-button
                            data-test="update-details/cancel"
                            :fit="mdsComponentFit.button"
                            :label="$t('BUTTONS.CLOSE')"
                            variant="secondary"
                            @click="closeUpdateDetails"
                        />
                    </Column>
                </Row>
            </ValidationObserver>
        </div>

        <mc-modal
            v-if="displayConfirmationModal"
            :heading="$t('MESSAGE.SAVE_CHANGE')"
            open
            backdropcloseactiondisabled
            :escapecloseactiondisabled="isRequestInProgress"
            :zindex="9999"
            dimension="small"
            data-test="update-details/confirmation"
            @closed="onCancelConfirmation"
        >
            <p>{{ $t('MESSAGE.SAVE_MESSAGE_CONFIRMATION') }}</p>
            <mc-button
                slot="primaryAction"
                data-test="update-details/confirmationModal-save"
                :fit="mdsComponentFit.button"
                focusstartanchor
                variant="primary"
                dialog-action="save"
                :loading="isRequestInProgress"
                @click="save"
            >
                {{ $t('BUTTONS.SAVE') }}
            </mc-button>

            <mc-button
                slot="secondaryAction"
                data-test="update-details/confirmationModal-discard"
                :fit="mdsComponentFit.button"
                focusendanchor
                variant="secondary"
                dialog-action="cancel"
                :disabled="isRequestInProgress"
                @click="onCancelConfirmation"
            >
                {{ $t('BUTTONS.DISCARD') }}
            </mc-button>
        </mc-modal>
    </PreviewPanel>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-icon';
import '@maersk-global/mds-components-core/mc-input-date';
import '@maersk-global/mds-components-core/mc-input';
import '@maersk-global/mds-components-core/mc-loading-indicator';
import '@maersk-global/mds-components-core/mc-modal';
import '@maersk-global/mds-components-core/mc-notification';
import '@maersk-global/mds-components-core/mc-select';
import Vue, { PropType } from 'vue';
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { Row, Column } from '@scm-ui/grid-system';
import { PreviewPanel } from '@scm-ui/preview-panel';
import DestinationNotifications from 'destination/components/notifications';
import {
    isFeatureEnabled,
    getFormattedDate,
    getFormattedDateInISO8601,
    getNotificationMessageFromAPIErrors,
    addNotification,
    clearNotifications,
    clearAllNotifications,
} from 'destination/utilities';
import { IData, IMethods, IComputed, IProps, IAllPriorities, IPriorityProgram, ISpecialProgram } from './interfaces';
import { getFormDataforMultiSelect, sortPriorities, serializeBeCodes } from './logic';
import UpdateDetailsSection from './components/update-details-section/update-details-section.vue';
import i18n from '@/i18n';
import { MDS_COMPONENT_FIT, ListViewTypeEnum, FeatureToggleEnum, NotificationPositionEnum, NotificationComponentEnum } from '@/static';
import { IFclListItem, ILclListItem } from '@/interfaces';
import { getMultipleDeliveryPlanIdQueryParam, getMultipleObjectIdQueryParam, parseAddressLines } from '@/logic';
import { parseFinalDeliveryLocationFromApiResponse } from '@/utilities';
import api from '@/data/api';
import LocationPicker from '@/components/location-picker/location-picker.vue';
import LocationField from '@/components/location-field/location-field.vue';
import { GasCheckRequiredOptions, GasCheckResultOptions } from './static/gas-check-options';

import './styles/update-details.scss';

extend('emptyReturnReferenceRule', {
    validate(value: string, args: any) {
        const {
            disabled,
            emptyReturnReference,
            emptyReturnReferenceExpiry,
        }: { disabled: boolean; emptyReturnReference: string; emptyReturnReferenceExpiry: Date } = args;
        if (disabled) {
            return true;
        }

        const isEmptyReturnReferenceExist = emptyReturnReference != null && emptyReturnReference != '';
        const isEmptyReturnReferenceExpiryExists = emptyReturnReferenceExpiry != null;
        const required = isEmptyReturnReferenceExist || isEmptyReturnReferenceExpiryExists;
        const valid = required ? value != '' && value != null : true;
        return {
            valid,
            data: {
                required,
            },
        };
    },
    params: ['disabled', 'emptyReturnReference', 'emptyReturnReferenceExpiry'],
    message: i18n.t('MESSAGE.FIELD_REQUIRED').toString(),
    computesRequired: true,
});

extend('pickupReferenceRule', {
    validate(value: string, args: any) {
        const { disabled, pickupReference, pickupReferenceExpiry }: { disabled: boolean; pickupReference: string; pickupReferenceExpiry: Date } = args;
        if (disabled) {
            return true;
        }

        const isPickupReferencexist = pickupReference != null && pickupReference != '';
        const isPickupReferencExpiryExists = pickupReferenceExpiry != null;
        const required = isPickupReferencexist || isPickupReferencExpiryExists;
        const valid = required ? value != '' && value != null : true;
        return {
            valid,
            data: {
                required,
            },
        };
    },
    params: ['disabled', 'pickupReference', 'pickupReferenceExpiry'],
    message: i18n.t('MESSAGE.FIELD_REQUIRED').toString(),
    computesRequired: true,
});

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'update-details',

    i18n,

    components: {
        ValidationObserver,
        ValidationProvider,
        Row,
        Column,
        PreviewPanel,
        DestinationNotifications,
        UpdateDetailsSection,
        LocationPicker,
        LocationField,
    },

    props: {
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            required: true,
        },
        selectedRows: {
            type: Map as PropType<Map<number | string, IFclListItem | ILclListItem>>,
            required: true,
            default: new Map(),
        },
    },

    data() {
        return {
            gasCheckRequiredOptions: undefined,
            gasCheckResultOptions: undefined,
            notificationPositionEnum: NotificationPositionEnum,
            notificationComponentEnum: NotificationComponentEnum,
            formValidationObserver: undefined,
            programDropdownOptions: [],
            specialProgramDropdownOptions: [],
            priorityDropdownOptions: [],
            isSaving: false,
            updateDetailsObject: {
                gasCheckDetails: {},
            } as any,
            allPrioritiesMap: [],
            allPrioritiesArray: [],
            allPrograms: [],
            showUpdateDetails: true,
            form: {
                program: {
                    value: '',
                    label: '',
                },
                deliveryPriorityId: {
                    value: undefined as number | undefined,
                    label: '',
                    priorityLevel: 0,
                },
                specialProgramId: {
                    value: undefined as number | undefined,
                    label: '',
                },
                pickupReference: '',
                pickupReferenceExpiryDateTimeLocal: '',
                emptyReturnReference: '',
                emptyReturnReferenceExpiryDateTimeLocal: '',
                finalDeliveryLocations: [],
                gasCheckRequired: undefined,
                gasCheckResult: undefined,
                gasCheckRequestedBy: undefined,
                gasCheckRequestedDate: undefined,
            },
            loaders: {
                isDeliveryProgramsLoading: true,
                isSpecialProgramLoading: true,
                isFetchingDetails: true,
            },
            isRequestInProgress: false,
            displayConfirmationModal: false,
            finalDeliveryLocations: [],
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        selectedItems() {
            return [...this.selectedRows.keys()];
        },
        cargoStuffingNumber() {
            const [firstValue] = this.selectedRows?.values();
            return firstValue?.cargoStuffingNumber;
        },
        isEmptyReturnReferenceFieldsEnabled(): boolean {
            return isFeatureEnabled(FeatureToggleEnum.DS_EMPTY_RETURN_REFERENCE_FIELDS_TEMP) && this.listViewType === ListViewTypeEnum.fcl;
        },
    },

    created() {
        clearAllNotifications();
        this.clearForm();
        this.initialize?.();
    },

    mounted() {
        this.formValidationObserver = this.$refs.observer as any;
    },

    destroyed() {
        clearNotifications(this.notificationComponentEnum.DP_UPDATE_DETAILS);
    },
    methods: {
        initializeGasCheckFields() {
            this.gasCheckRequiredOptions = GasCheckRequiredOptions.map((option) => {
                return { ...option, label: i18n.t(`GAS_CHECK_REQUIRED_OPTIONS.${option.label}`) as string };
            });
            this.gasCheckResultOptions = GasCheckResultOptions.map((option) => {
                return { ...option, label: i18n.t(`GAS_CHECK_RESULT_OPTIONS.${option.label}`) as string };
            });

            const gasCheckDetails = this.updateDetailsObject?.gasCheckDetails;
            const gasCheckRequired = this.gasCheckRequiredOptions.find((option) => option.value === gasCheckDetails?.gasCheckRequired);

            const gasCheckResult = this.gasCheckResultOptions.find(
                (option) => option.value === (gasCheckDetails?.gasCheckResult ? gasCheckDetails.gasCheckResult.toUpperCase() : null),
            );

            this.form = {
                ...this.form,
                gasCheckRequired: gasCheckRequired,
                gasCheckResult: gasCheckResult,
                gasCheckRequestedBy: gasCheckDetails?.gasCheckRequestedBy,
                gasCheckRequestedDate: getFormattedDate({ date: gasCheckDetails?.gasCheckRequestedDate }),
            };
        },
        setGcRequired(event: CustomEvent) {
            const selectedOptions = event.detail.selectedOptions[0];
            this.form.gasCheckRequired = selectedOptions;
            this.markFormAsDirty();
        },
        setGcResult(event: CustomEvent) {
            const selectedOptions = event.detail.selectedOptions[0];
            this.form.gasCheckResult = selectedOptions;
            this.markFormAsDirty();
        },
        setGcRequestedBy(event: InputEvent) {
            this.form.gasCheckRequestedBy = (event.target as HTMLInputElement).value;
            this.markFormAsDirty();
        },
        setGcRequestDate(event: InputEvent) {
            this.form.gasCheckRequestedDate = (event.target as HTMLInputElement).value.trim();
            this.markFormAsDirty();
        },
        async initialize() {
            await this.fetchDetails();
            this.initializeFinalDeliveryLocations();
            await this.fetchDeliveryPrograms();
            await this.fetchSpecialPrograms();
            this.initializePickupandEmptyReturnFields();
            this.initializeGasCheckFields();
        },
        clearForm() {
            this.form = {
                pickupReference: '',
                pickupReferenceExpiryDateTimeLocal: undefined,
                emptyReturnReference: '',
                emptyReturnReferenceExpiryDateTimeLocal: undefined,
                deliveryPriorityId: {
                    value: undefined,
                    label: '',
                    priorityLevel: 0,
                },
                specialProgramId: {
                    value: undefined,
                    label: '',
                },
                program: {
                    value: '',
                    label: '',
                },
                finalDeliveryLocations: [],
                gasCheckRequired: undefined,
                gasCheckResult: undefined,
                gasCheckRequestedBy: undefined,
                gasCheckRequestedDate: undefined,
            };
        },
        closeUpdateDetails() {
            if (this.formValidationObserver?.flags?.dirty) {
                this.displayConfirmationModal = true;
            } else {
                this.onCancelConfirmation();
            }
        },
        onCancelConfirmation() {
            this.showUpdateDetails = false;
            this.$emit('update-details-closed');
        },
        async fetchDetails() {
            try {
                this.loaders.isFetchingDetails = true;
                const params = getMultipleDeliveryPlanIdQueryParam(this.listViewType, this.selectedItems);
                const data = await api.userActions.getDetails({ params });
                this.updateDetailsObject = getFormDataforMultiSelect(data, this.selectedRows);
            } catch (error: any) {
                addNotification(this.notificationComponentEnum.DP_UPDATE_DETAILS, getNotificationMessageFromAPIErrors({ error }));
            } finally {
                this.loaders.isFetchingDetails = false;
            }
        },
        async fetchDeliveryPrograms() {
            try {
                this.loaders.isDeliveryProgramsLoading = true;
                const params = getMultipleObjectIdQueryParam(this.listViewType, this.selectedItems);
                const data = await api.userActions.getDeliveryPrograms({ params });
                let savedDeliveryProgram = {} as IAllPriorities;
                this.allPrioritiesArray = [];
                this.programDropdownOptions = [];

                data.deliveryProgramGroups.forEach((program: any) => {
                    this.programDropdownOptions.push({
                        value: program.programName,
                        label: program.programName,
                    });

                    this.allPrograms.push(program);
                    this.allPrioritiesMap[program.programName] = [];
                    program.priorities.forEach((priority: IPriorityProgram) => {
                        const mappedPriority = {
                            value: priority.deliveryPriorityId,
                            label: priority.displayName,
                            priorityLevel: priority.priorityLevel,
                        };
                        this.allPrioritiesArray.push(mappedPriority);
                        this.allPrioritiesMap[program.programName].push(mappedPriority);

                        if (priority.deliveryPriorityId === this.updateDetailsObject.deliveryPriorityId) {
                            savedDeliveryProgram = program;
                        }
                    });
                });

                this.allPrioritiesArray = [...this.allPrioritiesArray].sort(sortPriorities('label', 'priorityLevel'));
                if (savedDeliveryProgram) {
                    this.form.program = {
                        value: savedDeliveryProgram.programName,
                        label: savedDeliveryProgram.programName,
                    };
                }

                this.refreshPriorityDropdown({ updateSelectedPriority: true });
            } catch (error: any) {
                addNotification(this.notificationComponentEnum.DP_UPDATE_DETAILS, getNotificationMessageFromAPIErrors({ error }));
            } finally {
                this.loaders.isDeliveryProgramsLoading = false;
            }
        },
        async fetchSpecialPrograms() {
            try {
                this.loaders.isSpecialProgramLoading = true;
                const params = getMultipleObjectIdQueryParam(this.listViewType, this.selectedItems);
                const data = await api.userActions.getSpecialPrograms({ params });
                this.specialProgramDropdownOptions = [];
                let savedSpecialProgram = {} as ISpecialProgram;
                data.forEach((program: ISpecialProgram) => {
                    this.specialProgramDropdownOptions.push({
                        value: program.specialProgramId,
                        label: program.specialProgramName,
                    });

                    if (program.specialProgramId == this.updateDetailsObject.specialProgramId) {
                        savedSpecialProgram = program;
                    }
                });

                if (savedSpecialProgram) {
                    this.form.specialProgramId = {
                        value: savedSpecialProgram.specialProgramId,
                        label: savedSpecialProgram.specialProgramName,
                    };
                }
            } catch (error: any) {
                addNotification(this.notificationComponentEnum.DP_UPDATE_DETAILS, getNotificationMessageFromAPIErrors({ error }));
            } finally {
                this.loaders.isSpecialProgramLoading = false;
            }
        },
        initializePickupandEmptyReturnFields() {
            this.form.pickupReference = this.updateDetailsObject.pickupReference;
            this.form.emptyReturnReference = this.updateDetailsObject.emptyReturnReference;
            if (this.updateDetailsObject.pickupReferenceExpiryDateTime) {
                this.form.pickupReferenceExpiryDateTimeLocal = getFormattedDate({ date: this.updateDetailsObject.pickupReferenceExpiryDateTime });
            }
            if (this.updateDetailsObject.emptyReturnReferenceExpiryDateTime) {
                this.form.emptyReturnReferenceExpiryDateTimeLocal = getFormattedDate({ date: this.updateDetailsObject.emptyReturnReferenceExpiryDateTime });
            }
        },
        initializeFinalDeliveryLocations() {
            if (!this.selectedRows || this.selectedRows.size !== 1) {
                return;
            }

            const data = this.selectedRows.values().next().value;
            const locations = parseFinalDeliveryLocationFromApiResponse(data.customerFinalPlaceOfDeliveryFacilityDetails);
            this.setFinalDeliveryLocations(locations);

            // Initialize the validation provider with state equal to valid
            (this.$refs.changeDetectionValidationProvider as any)?.applyResult({
                valid: true,
                errors: [],
            });
            this.formValidationObserver.reset();
        },
        async save() {
            if (this.isSaving) {
                return;
            }

            clearNotifications(this.notificationComponentEnum.DP_UPDATE_DETAILS);

            this.markFormAsDirty();
            await this.formValidationObserver.validate();
            if (this.formValidationObserver.flags.invalid) {
                return;
            }

            const isMultipleRowsSelected = this.selectedItems.length > 1;
            const deliveryPlanIds = getMultipleDeliveryPlanIdQueryParam(this.listViewType, this.selectedItems);

            const payload = {
                ...deliveryPlanIds,
                pickupReference: this.form.pickupReference || null,
                pickupReferenceExpiryDateTime: getFormattedDateInISO8601({ date: this.form.pickupReferenceExpiryDateTimeLocal }),
                emptyReturnReference: this.form.emptyReturnReference || null,
                emptyReturnReferenceExpiryDateTime: getFormattedDateInISO8601({ date: this.form.emptyReturnReferenceExpiryDateTimeLocal }),
                deliveryPriorityId: this.form.deliveryPriorityId ? this.form.deliveryPriorityId.value : null,
                specialProgramId: this.form.specialProgramId ? this.form.specialProgramId.value : null,
                finalDeliveryLocationCodes: serializeBeCodes(this.form.finalDeliveryLocations),
                gasCheckDetails: {
                    gasCheckRequired: this.form.gasCheckRequired ? this.form.gasCheckRequired.value : isMultipleRowsSelected ? undefined : '',
                    gasCheckResult: this.form.gasCheckResult ? this.form.gasCheckResult.value : isMultipleRowsSelected ? undefined : '',
                    gasCheckRequestedBy: this.form.gasCheckRequestedBy ? this.form.gasCheckRequestedBy : isMultipleRowsSelected ? undefined : '',
                    gasCheckRequestedDate: this.form.gasCheckRequestedDate
                        ? getFormattedDateInISO8601({ date: this.form.gasCheckRequestedDate })
                        : isMultipleRowsSelected
                        ? undefined
                        : '',
                },
            };
            try {
                this.isSaving = true;
                await api.userActions.saveDetails(payload);
                this.clearForm();
                this.$emit('update-details');
            } catch (error: any) {
                addNotification(this.notificationComponentEnum.DP_UPDATE_DETAILS, getNotificationMessageFromAPIErrors({ error }));
            } finally {
                this.isSaving = false;
            }
        },
        refreshPriorityDropdown({ updateSelectedPriority }: { updateSelectedPriority: boolean }) {
            this.priorityDropdownOptions = [];
            if (!this.form.program.value) {
                this.priorityDropdownOptions = [...this.priorityDropdownOptions, ...this.allPrioritiesArray];
                return;
            }

            const programPriorities = this.allPrioritiesMap[this.form.program.value] || [];
            this.priorityDropdownOptions = [...this.priorityDropdownOptions, ...programPriorities];
            if (updateSelectedPriority) {
                const selectedProgram = this.allPrograms.find((program: IAllPriorities) => {
                    return program.programName === this.form.program.value;
                });
                if (selectedProgram) {
                    const selectedPriority = selectedProgram.priorities.find(
                        (id: any) => id.deliveryPriorityId === this.updateDetailsObject.deliveryPriorityId,
                    );
                    if (selectedPriority) {
                        this.form.deliveryPriorityId = {
                            value: selectedPriority.deliveryPriorityId,
                            label: selectedPriority.displayName,
                            priorityLevel: selectedPriority.priorityLevel,
                        };
                    } 
                    else {
                        this.form.deliveryPriorityId = {
                            value:'',
                            label:'',
                            priorityLevel: undefined,
                        };
                    }
                }
            }
        },
        refreshProgramsDropdown() {
            const programToSelect = this.allPrograms.find((program: IAllPriorities) =>
                program.priorities.some((priority: IPriorityProgram) => {
                    return priority.deliveryPriorityId === this.form.deliveryPriorityId.value;
                }),
            );

            if (programToSelect) {
                this.form.program = {
                    value: programToSelect.programName,
                    label: programToSelect.programName,
                };
            }
        },
        setProgram(event: CustomEvent) {
            const selectedOptions = event.detail.selectedOptions[0];

            this.form.program = {
                label: selectedOptions.label,
                value: selectedOptions.value,
            };

            this.refreshPriorityDropdown({ updateSelectedPriority: true });
            this.markFormAsDirty();
        },
        setSpecialProgramId(event: CustomEvent) {
            const selectedOptions = event.detail.selectedOptions[0];
            this.form.specialProgramId = {
                label: selectedOptions.label,
                value: selectedOptions.value,
            };
            this.markFormAsDirty();
        },
        setPriority(event: CustomEvent) {
            const selectedOptions = event.detail.selectedOptions[0];
            this.form.deliveryPriorityId = {
                label: selectedOptions.label,
                value: selectedOptions.value,
                priorityLevel: selectedOptions.value,
            };

            this.refreshProgramsDropdown();
            this.refreshPriorityDropdown({ updateSelectedPriority: false });
            this.markFormAsDirty();
        },
        setPickupReference(event: InputEvent) {
            this.form.pickupReference = (event.target as HTMLInputElement).value;
            this.markFormAsDirty();
        },
        setEmptyReturnReference(event: InputEvent) {
            this.form.emptyReturnReference = (event.target as HTMLInputElement).value;
            this.markFormAsDirty();
        },
        setPickupRefExpiry(event: InputEvent) {
            this.form.pickupReferenceExpiryDateTimeLocal = (event.target as HTMLInputElement).value;
            this.markFormAsDirty();
        },
        setEmptyRefExpiry(event: InputEvent) {
            this.form.emptyReturnReferenceExpiryDateTimeLocal = (event.target as HTMLInputElement).value;
            this.markFormAsDirty();
        },
        setFinalDeliveryLocations(finalDeliveryLocations: any[]) {
            this.form = { ...this.form, finalDeliveryLocations };
            this.markFormAsDirty();
        },
        addFinalDeliveryLocationField() {
            const emptyLocation = { location: '', beCode: '', addressLines: [] };
            const locations = (this.form.finalDeliveryLocations = [...this.form.finalDeliveryLocations, emptyLocation]);
            this.setFinalDeliveryLocations(locations);
        },
        removeFinalDeliveryLocationField(index: number) {
            const locations = (this.form.finalDeliveryLocations = this.form.finalDeliveryLocations.filter((_, itemIndex) => itemIndex !== index));
            this.setFinalDeliveryLocations(locations);
        },
        handleLocationChange(index: number, location: any) {
            const newLocation = { name: location.displayName, beCode: location.facilityCode, addressLines: parseAddressLines(location.displayText) };
            const locations = this.form.finalDeliveryLocations.map((item, itemIndex) => (itemIndex === index ? newLocation : item));
            this.setFinalDeliveryLocations(locations);
        },
        markFormAsDirty() {
            const validationProvider = this.$refs.changeDetectionValidationProvider as any;
            validationProvider?.validate();
            validationProvider?.setFlags({ dirty: true });
        },
    },
});
</script>
