<template>
    <div class="header-section">
        <Row class="header-section_row">
            <Column :xs="12" :md="12" :lg="3" class="header-section_column">
                <Row class="header-section_row_container">
                    <Column :xs="12" :md="12" :lg="12" class="header-section_column_container multiple-rows">
                        <div class="equipment">
                            <div class="text-grey">{{ $t('FIELD.EQUIPMENT') }}</div>
                            <div class="equipment_number">
                                {{ details.result.cargoStuffingNumber }}
                                <div class="equipment_comments" @click="navigateToComments"><mc-icon icon="comments"></mc-icon></div>
                            </div>
                        </div>
                        <TextField :label="$t('FIELD.CONTAINER_TYPE')" :value="details.result.cargoStuffingType" icon="container" />
                        <TextField :label="$t('FIELD.SEAL_NUMBER')" :value="sealNumber" />
                    </Column>
                </Row>

                <Row class="header-section_row_container">
                    <Column :xs="12" :md="12" :lg="12" class="header-section_column_container multiple-rows">
                        <!-- TODO: Display status with color -->
                        <TextField :label="$t('FIELD.SHIPMENT_STATUS')" :value="shipmentStatus" />
                        <TextField :label="$t('FIELD.PRIORITY')"><priority :level="priority.level" :display-name="priority.displayName" /></TextField>
                        <TextField :label="$t('FIELD.PROGRAM')" :value="program" />
                        <Row v-if="showIndicatorFlags">
                            <Column :xs="12" :md="4" :lg="4">
                                <flag-field-indicator :label="$t('FIELD.DG')" :value="details.result.hasDangerousGoods" />
                            </Column>
                            <Column :xs="12" :md="4" :lg="4">
                                <flag-field-indicator :label="$t('FIELD.GOH')" :value="details.result.hasGarmentOnHanger" />
                            </Column>
                            <Column :xs="12" :md="4" :lg="4">
                                <flag-field-indicator :label="$t('FIELD.RFR')" :value="details.result.isReefer" />
                            </Column>
                        </Row>
                    </Column>

                    <Column :xs="12" :md="12" :lg="12" class="header-section_column_container multiple-rows multiple-rows_two-columns">
                        <TextField :label="$t('FIELD.GC_REQUIRED')" :value="gasCheckRequiredValue()" />
                        <TextField :label="$t('FIELD.GC_RESULT')" :value="gasCheckResultValue()" />
                        <TextField :label="$t('FIELD.GC_REQUESTED_BY')" :value="gasCheckRequestedByValue()" />
                        <TextField :label="$t('FIELD.GC_REQUESTED_DATE')" :value="gasCheckRequestedDateValue()" />
                        <div class="update-details-button-container">
                            <mc-button
                                v-if="!isSICancelled"
                                :label="$t('FIELD.UPDATE_DETAILS')"
                                data-test="header-section/update-details-button"
                                variant="secondary"
                                :fit="mdsComponentFit.button"
                                @click="isUpdateDetailsPanelVisible = true"
                            />
                        </div>
                    </Column>
                </Row>
            </Column>

            <Column :xs="12" :md="12" :lg="9" class="header-section_column">
                <Row class="header-section_row_container">
                    <Column :xs="12" :md="12" :lg="12" class="header-section_column_container">
                        <Row :gutter="24">
                            <Column :xs="6" :md="6" :lg="6">
                                <TextField
                                    :label="$t('FIELD.CONSIGNEE') + '/' + $t('FIELD.BE_CODE')"
                                    :value="details.result.consigneeName"
                                    :secondary-value="details.result.consigneeBECode"
                                />
                            </Column>

                            <Column :xs="6" :md="6" :lg="6">
                                <TextField
                                    :label="$t('FIELD.CARRIER') + '/' + $t('FIELD.SCAC')"
                                    :value="details.result.carrierName"
                                    :secondary-value="details.result.carrierCode"
                                />
                            </Column>
                        </Row>
                    </Column>
                </Row>

                <Row class="header-section_row_container">
                    <Column :xs="12" :md="12" :lg="12" class="header-section_column_container">
                        <Row :gutter="24">
                            <Column v-for="(item, index) of headerSectionFields" :key="index" :xs="6" :md="4" :lg="4">
                                <TextField :label="item.label" :value="item.value" :secondary-value="item.secondaryValue" />
                            </Column>
                        </Row>
                    </Column>
                </Row>

                <Row class="header-section_row_container">
                    <Column :xs="12" :md="12" :lg="12" class="header-section_column_container">
                        <Row :gutter="24">
                            <Column :xs="12" :md="12" :lg="12" class="text-grey">{{ $t('FIELD.FDL') }}</Column>
                        </Row>

                        <Row v-if="finalDeliveryLocations && finalDeliveryLocations.length > 0" :gutter="24">
                            <Column v-for="(item, index) of finalDeliveryLocations" :key="index" :xs="6" :md="3" :lg="3">
                                <delivery-location :label="item.label" :be-code="item.beCode" :address-lines="item.addressLines"></delivery-location>
                            </Column>
                        </Row>

                        <Row v-else>-</Row>
                    </Column>
                </Row>
            </Column>
        </Row>

        <update-details
            v-if="isUpdateDetailsPanelVisible"
            :list-view-type="viewType"
            :selected-rows="selectedRows"
            data-test="header-section/update-details-panel"
            @update-details-closed="isUpdateDetailsPanelVisible = false"
            @update-details="handleUpdateDetails"
        />
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-button';
import Vue, { PropType } from 'vue';
import { Row, Column } from '@scm-ui/grid-system';
import TextField from 'destination/components/text-field';
import { isFeatureEnabled, getFormattedDate } from 'destination/utilities';
import DeliveryLocation from '../delivery-location/delivery-location.vue';
import Priority from '../priority/priority.vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { getDetailsPageHeaderSectionFields } from './static';
import i18n from '@/i18n';
import { DetailsGetterEnum } from '@/store/static/details-module-enum';
import {
    MDS_COMPONENT_FIT,
    ListViewTypeEnum,
    FeatureToggleEnum,
    PrimaryExecutiveStatus,
    getPrimaryExecutiveStatusDisplayName,
    SecondaryExecutiveStatus,
    getSecondaryExecutiveStatusDisplayName,
} from '@/static';
import { ICargoStuffingDetails } from '@/interfaces';
import { getDeliveryPlanId, parseFinalDeliveryLocation } from '@/logic';
import { EventBus, EventBusEventName } from '@/utilities';
import UpdateDetails from '@/components/user-actions/components/update-details/update-details.vue';
import FlagFieldIndicator from '../flag-field-indicator/flag-field-indicator.vue';
import './styles/header-section.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'header-section',

    i18n,

    components: {
        Row,
        Column,
        TextField,
        DeliveryLocation,
        Priority,
        UpdateDetails,
        FlagFieldIndicator,
    },

    props: {
        viewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
        viewModule: {
            type: String,
            required: true,
        },
        isSICancelled: {
            type: Boolean,
            required: true,
            default: false,
        },
    },

    data() {
        return {
            isUpdateDetailsPanelVisible: false,
            showUserActionsList: false,
            userActionComponent: undefined,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        details() {
            return this.$store.getters[`${this.viewModule}/${DetailsGetterEnum.GET_DETAILS}`];
        },
        sealNumber() {
            const sealNumberValue = this.details?.result?.sealNumber;
            if (!sealNumberValue) {
                return sealNumberValue;
            }

            return sealNumberValue.split(',').join(', ');
        },
        shipmentStatus() {
            const { primaryExecutiveStatus, secondaryExecutiveStatus } = this.details.result;
            const primaryExecutiveStatusDisplayName: string = getPrimaryExecutiveStatusDisplayName(primaryExecutiveStatus as PrimaryExecutiveStatus);
            const secondaryExecutiveStatusDisplayName: string = getSecondaryExecutiveStatusDisplayName(secondaryExecutiveStatus as SecondaryExecutiveStatus);

            return secondaryExecutiveStatusDisplayName
                ? `${primaryExecutiveStatusDisplayName} (${secondaryExecutiveStatusDisplayName})`
                : primaryExecutiveStatusDisplayName;
        },
        priority() {
            const priority = this.details?.result?.cargoStuffingPriority as any;
            return { level: priority?.level, displayName: priority?.name };
        },
        program() {
            return (this.details?.result?.cargoStuffingPriority as any)?.programName;
        },
        headerSectionFields() {
            return getDetailsPageHeaderSectionFields({ listViewType: this.viewType, details: this.details.result });
        },
        finalDeliveryLocations() {
            return parseFinalDeliveryLocation(this.details?.result?.customerFinalPlaceOfDeliveryFacilityDetails);
        },
        selectedRows() {
            const detailsResult: ICargoStuffingDetails = this.details?.result;
            return new Map([[getDeliveryPlanId(this.viewType, detailsResult), detailsResult]]);
        },
        showIndicatorFlags() {
            return !isFeatureEnabled(FeatureToggleEnum.HIDE_DG_GOH_RFR);
        },
    },

    methods: {
        handleUpdateDetails() {
            this.isUpdateDetailsPanelVisible = false;
            this.$emit('update-details');
        },
        navigateToComments() {
            EventBus.$emit(EventBusEventName.SCROLL_COMMENTS_SECTION_INTO_VIEW);
        },
        gasCheckRequiredValue() {
            if (this.details.result.gasCheckDetails && typeof this.details.result.gasCheckDetails.gasCheckRequired == 'boolean') {
                return (
                    this.details.result.gasCheckDetails.gasCheckRequired ? i18n.t('GAS_CHECK_REQUIRED_OPTIONS.YES') : i18n.t('GAS_CHECK_REQUIRED_OPTIONS.NO')
                ) as string;
            }
            return undefined;
        },
        gasCheckResultValue() {
            return this.details.result.gasCheckDetails?.gasCheckResult
                ? (i18n.t(`GAS_CHECK_RESULT_OPTIONS.${this.details.result.gasCheckDetails.gasCheckResult.toUpperCase()}`) as string)
                : undefined;
        },
        gasCheckRequestedByValue() {
            return this.details.result?.gasCheckDetails?.gasCheckRequestedBy;
        },
        gasCheckRequestedDateValue() {
            return this.details.result?.gasCheckDetails?.gasCheckRequestedDate
                ? getFormattedDate({ date: this.details.result?.gasCheckDetails?.gasCheckRequestedDate })
                : undefined;
        },
    },
});
</script>
