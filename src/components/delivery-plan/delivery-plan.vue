<template>
    <div class="delivery-plan">
        <ValidationObserver ref="validationObserver">
            <ValidationProvider ref="dirtyValidationProvider" name="dirtyValidationProvider" :slim="true" />

            <Row :columns="16" class="delivery-plan_row">
                <Column :xs="16" :md="16" :lg="12" :lg-offset="2">
                    <DeliveryPlanSection :title="$t('DELIVERY_PLAN.SELECT_TRANSPORT_DETAILS')">
                        <DeliveryPlanTransportDetails :delivery-plan="deliveryPlan" />
                    </DeliveryPlanSection>

                    <DeliveryPlanSection :title="$t('DELIVERY_PLAN.SELECT_TRANSPORT_LEG(S)')">
                        <DeliveryLeg
                            v-for="(leg, index) in activeDeliveryLegs"
                            :key="index"
                            class="delivery-plan_delivery-leg"
                            :details="details"
                            :delivery-plan="deliveryPlan"
                            :leg="leg"
                            :leg-index="index + 1"
                            :is-first-leg="index === 0"
                            :is-last-leg="index === activeDeliveryLegs.length - 1"
                        />

                        <div class="delivery-plan_add-leg-button-wrapper">
                            <mc-button
                                data-test="delivery-plan/add-leg-button"
                                :label="activeDeliveryLegs.length ? $t('DELIVERY_PLAN.ADD_ANOTHER_LEG') : $t('DELIVERY_PLAN.ADD_LEG')"
                                icon="plus"
                                variant="secondary"
                                :fit="mdsComponentFit.button"
                                @click="addDeliveryLeg"
                            />
                        </div>
                    </DeliveryPlanSection>

                    <DeliveryPlanSection
                        v-if="isStopOffLocationEnable"
                        :title="$t('DELIVERY_PLAN.STOP_OFF_LOCATION')"
                        :info-text="$t('DELIVERY_PLAN.STOP_OFF_LOCATION_INFO_TEXT')"
                    >
                        <mc-checkbox
                            name="isStopOffLocation"
                            :label="$t('FIELD.STOP_OFF_LOCATION')"
                            :disabled="!activeDeliveryLegs || !activeDeliveryLegs.length"
                            :checked="isStopOffLocation"
                            :value="isStopOffLocation"
                            @change="setIsStopOffLocation({ isStopOffLocation: $event.target.checked })"
                        />
                    </DeliveryPlanSection>

                    <DeliveryPlanSection v-if="showEmptyReturnLeg" :title="$t('DELIVERY_PLAN.ADD_EMPTY_RETURN_DETAILS')">
                        <EmptyReturnLeg
                            :details="details"
                            :delivery-plan="deliveryPlan"
                            :leg="activeEmptyReturnLeg"
                            :first-active-leg="firstActiveDeliveryLeg"
                            :last-active-leg="lastActiveDeliveryLeg"
                        />
                    </DeliveryPlanSection>

                    <DeliveryPlanSection v-if="additionalReference.response.length" :title="$t('DELIVERY_PLAN.ADDITIONAL_REFERENCE(S)')">
                        <AdditionalReferences
                            :fields="additionalReference.response"
                            @change="setAdditionalReferenceField({ relatedObjectId: id, relatedObjectType, field: $event })"
                        />
                    </DeliveryPlanSection>

                    <DeliveryPlanSection v-if="cancelledLegs.length">
                        <div class="delivery-plan_mc-notification-wrapper">
                            <mc-notification
                                data-test="delivery-plan/mc-notification/cancelled-legs-info-message"
                                :fit="mdsComponentFit.notification"
                                appearance="info"
                                icon="info-circle"
                                :heading="cancelledLegsInfoMessage"
                            />
                        </div>

                        <SCMTable
                            table-id="cancelled-legs-table"
                            :is-loading="(deliveryPlan && deliveryPlan.isFetching) || false"
                            :row-lines="2"
                            :default-col-def="cancelledLegsDefaultColDef"
                            :column-defs="cancelledLegsColumnDefs"
                            :row-data="cancelledLegsRowData"
                        />
                    </DeliveryPlanSection>

                    <DeliveryPlanSection v-if="rejectedLegs.length">
                        <div class="delivery-plan_mc-notification-wrapper">
                            <mc-notification
                                data-test="delivery-plan/mc-notification/rejected-legs-info-message"
                                :fit="mdsComponentFit.notification"
                                appearance="info"
                                icon="info-circle"
                                :heading="rejectedLegsInfoMessage"
                            />
                        </div>

                        <SCMTable
                            table-id="rejected-legs-table"
                            :is-loading="(deliveryPlan && deliveryPlan.isFetching) || false"
                            :row-lines="2"
                            :default-col-def="rejectedLegsDefaultColDef"
                            :column-defs="rejectedLegsColumnDefs"
                            :row-data="rejectedLegsRowData"
                        />
                    </DeliveryPlanSection>
                </Column>
            </Row>

            <Row :columns="16" class="delivery-plan_row delivery-plan_row_actions">
                <Column :xs="16" :md="16" :lg="12" :lg-offset="2">
                    <mc-button
                        data-test="delivery-plan/send-plan-button"
                        :fit="mdsComponentFit.button"
                        :loading="isSendingPlan"
                        :label="$t('SEND_PLAN')"
                        :disabled="isDeliveryLegsNotPresent || isSaveOrSendPlanInProgress"
                        @click="onSendPlanButtonClick"
                    />
                    <mc-button
                        data-test="delivery-plan/save-plan-button"
                        :fit="mdsComponentFit.button"
                        variant="secondary"
                        :loading="isSavingPlan"
                        :label="$t('SAVE_PLAN')"
                        :disabled="isDeliveryLegsNotPresent || isSaveOrSendPlanInProgress"
                        @click="onSavePlanButtonClick"
                    />
                    <mc-button
                        data-test="delivery-plan/cancel-plan-button"
                        :fit="mdsComponentFit.button"
                        variant="secondary"
                        :label="$t('CANCEL_PLAN')"
                        :disabled="isSaveOrSendPlanInProgress || isCancelPlanButtonDisabled"
                        @click="showCancelPlanConfirmationModal = true"
                    />
                </Column>
            </Row>
        </ValidationObserver>

        <SendPlan
            v-if="showSendPlanConfirmationModal"
            data-test="delivery-plan/send-plan-confirmation-modal"
            :list-view-type="viewType"
            :selected-rows="selectedRows"
            @send-do="onSendPlanSuccess"
            @send-do-closed="onSendPlanClosed"
        />

        <ConfirmationModal
            size="medium"
            :open="showCancelPlanConfirmationModal"
            :heading="$t('MODAL.CANCEL_DELIVERY_PLAN')"
            @confirm="
                cancelDeliveryPlan();
                showCancelPlanConfirmationModal = false;
            "
            @cancel="showCancelPlanConfirmationModal = false"
        >
            <p>{{ $t('MESSAGE.CANCEL_PLAN_CONFIRMATION_MESSAGE_HEADER') }}</p>
            <ul>
                <li v-for="(order, index) in deliveryOrders" :key="'delivery-order-' + index">{{ order }}</li>
            </ul>
            <p>{{ $t('MESSAGE.CANCEL_PLAN_CONFIRMATION_MESSAGE_BODY') }}</p>
        </ConfirmationModal>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-button';
import '@maersk-global/mds-components-core/mc-notification';
import Vue, { PropType } from 'vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { uniq } from 'lodash';
import { Row, Column } from '@scm-ui/grid-system';
import { Table as SCMTable } from '@scm-ui/table';
import { getNotificationMessageFromAPIErrors, addNotification, removeNotification, clearNotifications } from 'destination/utilities';
import { getCancelledLegsDefaultColDef, getCancelledLegsColumnDefs, getRejectedLegsDefaultColDef, getRejectedLegsColumnDefs } from './static';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { mapCancelledServiceLegToDataRow, mapRejectedServiceLegToDataRow, validateDeliveryPlan } from './logic';
import i18n from '@/i18n';
import DeliveryPlanSection from './components/delivery-plan-section/delivery-plan-section.vue';
import DeliveryPlanTransportDetails from './components/delivery-plan-transport-details/delivery-plan-transport-details.vue';
import DeliveryLeg from './components/delivery-leg/delivery-leg.vue';
import EmptyReturnLeg from './components/empty-return-leg/empty-return-leg.vue';
import AdditionalReferences from '@/components/additional-references/additional-references.vue';
import SendPlan from '@/components/user-actions/components/send-plan/send-plan.vue';
import ConfirmationModal from '@/components/confirmation-modal/confirmation-modal.vue';
import { NAMESPACE as CUSTOMER_CONFIGURATION_NAMESPACE, CustomerConfigurationGetterEnum } from '@/store/modules/customer-configuration/static';
import {
    NAMESPACE as DELIVERY_PLAN_NAMESPACE,
    DeliveryPlanGetterEnum,
    DeliveryPlanActionEnum,
    DeliveryPlanMutationEnum,
} from '@/store/modules/delivery-plan/static';
import {
    MDS_COMPONENT_FIT,
    ListViewTypeEnum,
    RelatedObjectTypeEnum,
    DeliveryPlanningViewNameEnum,
    NotificationAppearanceEnum,
    NotificationComponentEnum,
} from '@/static';
import { ICargoStuffingDetails, INotificationConfig } from '@/interfaces';
import { listViewTypeSpecificAction } from '@/logic';
import { RouteNameEnum } from '@/router/routes';

import './styles/delivery-plan.scss';

enum NOTIFICATION_ID {
    FETCH_DELIVERY_PLAN_DATA = 'DP_DETAILS_FETCH_DELIVERY_PLAN_DATA',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'delivery-plan',

    i18n,

    components: {
        ValidationObserver,
        ValidationProvider,
        Row,
        Column,
        SCMTable,
        DeliveryPlanSection,
        DeliveryPlanTransportDetails,
        DeliveryLeg,
        EmptyReturnLeg,
        AdditionalReferences,
        SendPlan,
        ConfirmationModal,
    },

    props: {
        id: {
            type: [Number, String],
            required: true,
        },
        viewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
        viewName: {
            type: String as PropType<DeliveryPlanningViewNameEnum>,
            required: true,
            default: DeliveryPlanningViewNameEnum.DP_ManagePlan,
        },
        details: {
            type: Object as PropType<{ result: ICargoStuffingDetails }>,
            required: true,
        },
    },

    data() {
        return {
            isSavingPlan: false,
            isSendingPlan: false,
            showSendPlanConfirmationModal: false,
            showCancelPlanConfirmationModal: false,
            sentLegsDisabled: false,
        };
    },

    computed: {
        ...mapGetters(CUSTOMER_CONFIGURATION_NAMESPACE, {
            isStopOffLocationEnable: CustomerConfigurationGetterEnum.GET_IS_STOP_OFF_LOCATION_ENABLED,
        }),
        ...mapGetters(DELIVERY_PLAN_NAMESPACE, {
            deliveryPlan: DeliveryPlanGetterEnum.GET_DELIVERY_PLAN,
            activeDeliveryLegs: DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS,
            firstActiveDeliveryLeg: DeliveryPlanGetterEnum.GET_FIRST_ACTIVE_DELIVERY_LEG,
            lastActiveDeliveryLeg: DeliveryPlanGetterEnum.GET_LAST_ACTIVE_DELIVERY_LEG,
            activeEmptyReturnLeg: DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG,
            cancelledLegs: DeliveryPlanGetterEnum.GET_CANCELLED_LEGS,
            rejectedLegs: DeliveryPlanGetterEnum.GET_REJECTED_LEGS,
            additionalReference: DeliveryPlanGetterEnum.GET_ADDITIONAL_REFERENCE,
            isStopOffLocation: DeliveryPlanGetterEnum.GET_IS_STOP_OFF_LOCATION,
        }),
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        relatedObjectType() {
            return listViewTypeSpecificAction<RelatedObjectTypeEnum>(this.viewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return RelatedObjectTypeEnum.CargoStuffing;
                },
                [ListViewTypeEnum.lcl]: () => {
                    return RelatedObjectTypeEnum.TransportDocument;
                },
            });
        },
        selectedRows() {
            return new Map([[this.id, this.details?.result]]);
        },
        validationObserver() {
            return this.$refs.validationObserver as InstanceType<typeof ValidationObserver>;
        },
        cancelledLegsInfoMessage() {
            const isPendingSave = this.cancelledLegs.some((leg) => leg.statusBeforeAction);
            return isPendingSave
                ? i18n.t('MESSAGE.CANCELLED_LEGS_PENDING_SAVE_INFO_MESSAGE').toString()
                : i18n.t('MESSAGE.CANCELLED_LEGS_INFO_MESSAGE').toString();
        },
        cancelledLegsDefaultColDef() {
            return getCancelledLegsDefaultColDef({ viewType: this.viewType });
        },
        cancelledLegsColumnDefs() {
            return getCancelledLegsColumnDefs({ viewType: this.viewType });
        },
        cancelledLegsRowData() {
            return this.cancelledLegs.map((leg) =>
                mapCancelledServiceLegToDataRow(leg, {
                    copyLegActionMethod: () => this.copyDeliveryLeg({ leg }),
                    undoCancelLegActionMethod: () => this.undoCancelRejectDeliveryLeg({ leg }),
                }),
            );
        },
        rejectedLegsInfoMessage() {
            const isPendingSave = this.rejectedLegs.some((leg) => leg.statusBeforeAction);
            return isPendingSave
                ? i18n.t('MESSAGE.REJECTED_LEGS_PENDING_SAVE_INFO_MESSAGE').toString()
                : i18n.t('MESSAGE.REJECTED_LEGS_INFO_MESSAGE').toString();
        },
        rejectedLegsDefaultColDef() {
            return getRejectedLegsDefaultColDef({ viewType: this.viewType });
        },
        rejectedLegsColumnDefs() {
            return getRejectedLegsColumnDefs({ viewType: this.viewType });
        },
        rejectedLegsRowData() {
            return this.rejectedLegs.map((leg) =>
                mapRejectedServiceLegToDataRow(leg, {
                    copyLegActionMethod: () => this.copyDeliveryLeg({ leg }),
                    undoRejectLegActionMethod: () => this.undoCancelRejectDeliveryLeg({ leg }),
                }),
            );
        },
        isDeliveryLegsNotPresent(): boolean {
            return !this.activeDeliveryLegs.length && !this.cancelledLegs.length && !this.rejectedLegs.length;
        },
        showEmptyReturnLeg(): boolean {
            const isEmptyReturnLegApplicable = listViewTypeSpecificAction<boolean>(this.viewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return true;
                },
                [ListViewTypeEnum.lcl]: () => {
                    return false;
                },
            });

            return isEmptyReturnLegApplicable && this.activeDeliveryLegs.length > 0 && this.activeEmptyReturnLeg && !this.isStopOffLocation;
        },
        isSaveOrSendPlanInProgress(): boolean {
            return this.isSavingPlan || this.isSendingPlan;
        },
        deliveryOrders() {
            const orders = (this.activeDeliveryLegs?.map((l) => l.deliveryOrder).filter((d) => d) as string[]) || [];
            return uniq(orders);
        },
        isCancelPlanButtonDisabled() {
            return this.activeDeliveryLegs ? this.activeDeliveryLegs.every((l) => !l.deliveryOrder) : true;
        },
    },

    created() {
        this.fetchDeliveryPlanData();
    },

    destroyed() {
        this.resetDeliveryPlanState();
    },

    methods: {
        ...mapActions(DELIVERY_PLAN_NAMESPACE, {
            resetDeliveryPlanState: DeliveryPlanActionEnum.RESET_STATE,
            fetchDeliveryPlan: DeliveryPlanActionEnum.FETCH_DELIVERY_PLAN,
            fetchAdditionalReference: DeliveryPlanActionEnum.FETCH_ADDITIONAL_REFERENCE,
            saveDeliveryPlan: DeliveryPlanActionEnum.SAVE_DELIVERY_PLAN,
            cancelDeliveryPlan: DeliveryPlanActionEnum.CANCEL_DELIVERY_PLAN,
            setIsStopOffLocation: DeliveryPlanActionEnum.SET_IS_STOP_OFF_LOCATION,
            addDeliveryLeg: DeliveryPlanActionEnum.ADD_DELIVERY_LEG,
            copyDeliveryLeg: DeliveryPlanActionEnum.COPY_DELIVERY_LEG,
            undoCancelRejectDeliveryLeg: DeliveryPlanActionEnum.UNDO_CANCEL_REJECT_DELIVERY_LEG,
        }),
        ...mapMutations(DELIVERY_PLAN_NAMESPACE, {
            setAdditionalReferenceField: DeliveryPlanMutationEnum.SET_ADDITIONAL_REFERENCE_FIELD,
        }),
        navigateToListPage() {
            const routeName = listViewTypeSpecificAction<string>(this.viewType, {
                [ListViewTypeEnum.fcl]: () => RouteNameEnum.Fcl,
                [ListViewTypeEnum.lcl]: () => RouteNameEnum.Lcl,
            });

            this.$router.push({ name: routeName });
        },
        markFormAsDirty() {
            const dirtyValidationProvider = this.$refs.dirtyValidationProvider as InstanceType<typeof ValidationProvider>;
            dirtyValidationProvider?.setFlags({ dirty: true });
        },
        async fetchDeliveryPlanData() {
            removeNotification(NotificationComponentEnum.DP_DETAILS_PAGE, NOTIFICATION_ID.FETCH_DELIVERY_PLAN_DATA);

            try {
                await Promise.all([
                    this.fetchDeliveryPlan({ deliveryPlanId: this.id }),
                    this.fetchAdditionalReference({ params: { relatedObjectId: this.id, relatedObjectType: this.relatedObjectType, screen: this.viewName } }),
                ]);
            } catch (error: any) {
                addNotification(
                    NotificationComponentEnum.DP_DETAILS_PAGE,
                    getNotificationMessageFromAPIErrors({ id: NOTIFICATION_ID.FETCH_DELIVERY_PLAN_DATA, error }),
                );
            }
        },
        async onSavePlanButtonClick() {
            clearNotifications(NotificationComponentEnum.DP_DETAILS_PAGE);

            const { isValid, error } = validateDeliveryPlan({
                isSavePlanOperation: true,
                details: this.details.result,
                deliveryPlan: this.deliveryPlan.response,
                activeDeliveryLegs: this.activeDeliveryLegs,
                firstActiveDeliveryLeg: this.firstActiveDeliveryLeg,
                lastActiveDeliveryLeg: this.lastActiveDeliveryLeg,
                activeEmptyReturnLeg: this.activeEmptyReturnLeg,
            });
            if (!isValid) {
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, {
                    appearance: NotificationAppearanceEnum.error,
                    heading: error,
                } as INotificationConfig);
                return;
            }

            try {
                this.isSavingPlan = true;
                await this.saveDeliveryPlan({ deliveryPlanId: this.id, isSendServicePlanRequest: false });
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, {
                    appearance: NotificationAppearanceEnum.success,
                    heading: i18n.t('MESSAGE.DELIVERY_PLAN_SAVE_FOR_EQUIPMENT_SUCCCESS', { number: this.details.result.cargoStuffingNumber }).toString(),
                } as INotificationConfig);

                this.fetchDeliveryPlanData();
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, getNotificationMessageFromAPIErrors({ error }));
            } finally {
                this.isSavingPlan = false;
            }
        },
        async onSendPlanButtonClick() {
            clearNotifications(NotificationComponentEnum.DP_DETAILS_PAGE);

            this.markFormAsDirty();
            await this.validationObserver.validate();
            if (this.validationObserver.flags.invalid) {
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, {
                    appearance: NotificationAppearanceEnum.error,
                    heading: i18n.t('MESSAGE.VALIDATION_ERROR_MESSAGE').toString(),
                } as INotificationConfig);
                return;
            }

            const { isValid, error } = validateDeliveryPlan({
                isSavePlanOperation: false,
                details: this.details.result,
                deliveryPlan: this.deliveryPlan.response,
                activeDeliveryLegs: this.activeDeliveryLegs,
                firstActiveDeliveryLeg: this.firstActiveDeliveryLeg,
                lastActiveDeliveryLeg: this.lastActiveDeliveryLeg,
                activeEmptyReturnLeg: this.activeEmptyReturnLeg,
            });
            if (!isValid) {
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, {
                    appearance: NotificationAppearanceEnum.error,
                    heading: error,
                } as INotificationConfig);
                return;
            }

            try {
                this.isSendingPlan = true;
                await this.saveDeliveryPlan({ deliveryPlanId: this.id, isSendServicePlanRequest: true });
                this.showSendPlanConfirmationModal = true;
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, getNotificationMessageFromAPIErrors({ error }));
            } finally {
                this.isSendingPlan = false;
            }
        },
        onSendPlanSuccess() {
            this.showSendPlanConfirmationModal = false;
            addNotification(NotificationComponentEnum.DP_LIST_PAGE, {
                appearance: NotificationAppearanceEnum.success,
                heading: i18n.t('MESSAGE.DELIVERY_PLAN_SEND_FOR_EQUIPMENT_SUCCCESS', { number: this.details.result.cargoStuffingNumber }).toString(),
            } as INotificationConfig);
            this.navigateToListPage();
        },
        onSendPlanClosed() {
            this.showSendPlanConfirmationModal = false;
            this.fetchDeliveryPlanData();
        },
    },
});
</script>
