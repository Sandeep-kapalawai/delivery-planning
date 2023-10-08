<template>
    <div class="delivery-leg" :class="{ disabled }">
        <div class="delivery-leg_timeline">
            <div class="delivery-leg_timeline_icon">
                <mc-icon icon="pin" />
            </div>
            <div class="delivery-leg_timeline_line"></div>
        </div>

        <div class="delivery-leg_leg">
            <div class="delivery-leg_leg_header">
                <div class="delivery-leg_leg_header_index">{{ $t('DELIVERY_PLAN.LEG') }} {{ legIndex }}</div>

                <div v-if="isLegSent" class="delivery-leg_leg_header_info">
                    <TextField :data-test="`leg/${legIndex}/header/delivery-order`" :label="$t('FIELD.DELIVERY_ORDER')" :value="leg.deliveryOrder" />

                    <TextFieldWithColor
                        :data-test="`leg/${legIndex}/header/status`"
                        :label="$t('FIELD.DELIVERY_ORDER_STATUS')"
                        :value="getServiceLegStatusDisplayName(leg.status)"
                        :color="colorForStatus"
                    />

                    <mc-button
                        :data-test="`leg/${legIndex}/header/status`"
                        :fit="mdsComponentFit.button"
                        variant="secondary"
                        class="delivery-leg_leg_update-status-link"
                        :label="$t('BUTTONS.ACCEPT_DO')"
                        :disabled="disableUpdateStatusAction"
                        @click="onUpdateStatusFieldClick(leg)"
                    />

                    <UpdateStatus
                        v-if="isUpdateStatusModalOpen"
                        :leg="leg"
                        :data-test="`delivery-leg/UpdateStatusModal`"
                        :delivery-order="leg.deliveryOrder"
                        @close="onCloseStatusModal"
                        @updateStatusConfirmed="updateStatusConfirm"
                    />

                    <TextField :data-test="`leg/${legIndex}/header/version`" :label="$t('FIELD.VERSION')" :value="leg.version" />
                </div>

                <div class="delivery-leg_leg_header_actions">
                    <mc-tooltip :fit="mdsComponentFit.tooltip" appearance="default" position="top-center">
                        <mc-button
                            :data-test="`leg/${legIndex}/header/actions/copy-leg-button`"
                            class="delivery-leg_leg_header_actions_copy-leg-button"
                            :fit="mdsComponentFit.button"
                            hiddenlabel
                            variant="plain"
                            icon="file-copy"
                            :disabled="disabled"
                            @click="copyDeliveryLeg({ leg })"
                        />
                        <span slot="content">{{ $t('DELIVERY_PLAN.COPY_LEG') }}</span>
                    </mc-tooltip>

                    <mc-tooltip v-if="isLegSent" :fit="mdsComponentFit.tooltip" appearance="default" position="top-center">
                        <mc-button
                            :data-test="`leg/${legIndex}/header/actions/cancel-leg-button`"
                            class="delivery-leg_leg_header_actions_cancel-leg-button"
                            :fit="mdsComponentFit.button"
                            hiddenlabel
                            variant="plain"
                            icon="times-circle"
                            :disabled="disabled"
                            @click="showCancelLegConfirmationModal = true"
                        />
                        <span slot="content">{{ $t('DELIVERY_PLAN.CANCEL_LEG') }}</span>
                    </mc-tooltip>

                    <mc-tooltip v-else :fit="mdsComponentFit.tooltip" appearance="default" position="top-center">
                        <mc-button
                            :data-test="`leg/${legIndex}/header/actions/remove-leg-button`"
                            class="delivery-leg_leg_header_actions_remove-leg-button"
                            :fit="mdsComponentFit.button"
                            hiddenlabel
                            variant="plain"
                            icon="trash"
                            :disabled="disabled"
                            @click="removeDeliveryLeg({ leg })"
                        />
                        <span slot="content">{{ $t('DELIVERY_PLAN.REMOVE_LEG') }}</span>
                    </mc-tooltip>

                    <mc-tooltip :fit="mdsComponentFit.tooltip" appearance="default" position="top-center">
                        <mc-button
                            :data-test="`leg/${legIndex}/header/actions/move-leg-up-button`"
                            class="delivery-leg_leg_header_actions_move-leg-up-button"
                            :fit="mdsComponentFit.button"
                            hiddenlabel
                            variant="plain"
                            icon="arrow-up"
                            :disabled="isFirstLeg || disabled"
                            @click="moveDeliveryLeg({ leg, direction: ServiceLegDirectionToMoveEnum.UP })"
                        />
                        <span slot="content">{{ $t('DELIVERY_PLAN.MOVE_LEG_UP') }}</span>
                    </mc-tooltip>

                    <mc-tooltip :fit="mdsComponentFit.tooltip" appearance="default" position="top-center">
                        <mc-button
                            :data-test="`leg/${legIndex}/header/actions/move-leg-down-button`"
                            class="delivery-leg_leg_header_actions_move-leg-down-button"
                            :fit="mdsComponentFit.button"
                            hiddenlabel
                            variant="plain"
                            icon="arrow-down"
                            :disabled="isLastLeg || disabled"
                            @click="moveDeliveryLeg({ leg, direction: ServiceLegDirectionToMoveEnum.DOWN })"
                        />
                        <span slot="content">{{ $t('DELIVERY_PLAN.MOVE_LEG_DOWN') }}</span>
                    </mc-tooltip>
                </div>
            </div>

            <Row>
                <Column :xs="12" :md="6" :lg="4">
                    <div class="delivery-leg_leg_section">
                        <DeliveryLegPickupSection
                            :details="details"
                            :delivery-plan="deliveryPlan"
                            :leg="leg"
                            :leg-index="legIndex"
                            :is-first-leg="isFirstLeg"
                            :disabled="disabled"
                        />
                    </div>
                </Column>
                <Column :xs="12" :md="6" :lg="4">
                    <div class="delivery-leg_leg_section">
                        <DeliveryLegDeliverySection :details="details" :leg="leg" :leg-index="legIndex" :disabled="disabled" />
                    </div>
                </Column>
                <Column :xs="12" :md="6" :lg="4">
                    <div class="delivery-leg_leg_section">
                        <DeliveryLegTransportSection :leg="leg" :leg-index="legIndex" :is-leg-sent="isLegSent" :disabled="disabled" />
                    </div>
                </Column>
            </Row>

            <confirmation-modal
                :open="showCancelLegConfirmationModal"
                :heading="$t('MODAL.CANCEL_DELIVERY_ORDER')"
                @confirm="onCancelLegConfirm"
                @cancel="onCancelLegCancel"
            >
                <p>{{ cancelLegModalMessage }}</p>
            </confirmation-modal>
        </div>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-button';
import '@maersk-global/mds-components-core/mc-icon';
import '@maersk-global/mds-components-core/mc-tooltip';
import Vue, { PropType } from 'vue';
import { mapActions } from 'vuex';
import { Row, Column } from '@scm-ui/grid-system';
import TextField from 'destination/components/text-field';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { getColorForStatus } from './logic';
import i18n from '@/i18n';
import DeliveryLegPickupSection from './components/delivery-leg-pickup-section/delivery-leg-pickup-section.vue';
import DeliveryLegDeliverySection from './components/delivery-leg-delivery-section/delivery-leg-delivery-section.vue';
import DeliveryLegTransportSection from './components/delivery-leg-transport-section/delivery-leg-transport-section.vue';
import UpdateStatus from './components/update-status/update-status.vue';
import TextFieldWithColor from '@/components/text-field-with-color/text-field-with-color.vue';
import ConfirmationModal from '@/components/confirmation-modal/confirmation-modal.vue';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanActionEnum } from '@/store/modules/delivery-plan/static';
import { isServiceLegSent } from '@/store/modules/delivery-plan/logic';
import { MDS_COMPONENT_FIT, ServiceLegDirectionToMoveEnum, ServiceLegStatusEnum, getServiceLegStatusDisplayName } from '@/static';
import { ICargoStuffingDetails, IServicePlan, IServiceLeg } from '@/interfaces';

import './styles/delivery-leg.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'delivery-leg',

    i18n,

    components: {
        Row,
        Column,
        UpdateStatus,
        TextField,
        TextFieldWithColor,
        ConfirmationModal,
        DeliveryLegPickupSection,
        DeliveryLegDeliverySection,
        DeliveryLegTransportSection,
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
        isLastLeg: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            ServiceLegDirectionToMoveEnum: ServiceLegDirectionToMoveEnum,
            isUpdateStatusModalOpen: false,
            legToUpdateStatus: {},
            showCancelLegConfirmationModal: false,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        isLegSent(): boolean {
            return isServiceLegSent(this.leg);
        },
        colorForStatus() {
            return getColorForStatus(this.leg.status);
        },
        cancelLegModalMessage() {
            const number = this.leg.deliveryOrder;
            return i18n.t('MESSAGE.CANCEL_LEG_CONFIRMATION_MESSAGE', { number }).toString();
        },
        disableUpdateStatusAction(){
            return this.leg.status !== ServiceLegStatusEnum.SENT;
        },
    },

    methods: {
        getServiceLegStatusDisplayName: getServiceLegStatusDisplayName,
        onUpdateStatusFieldClick(leg: IServiceLeg) {
            this.legToUpdateStatus = leg;
            this.isUpdateStatusModalOpen = true;
        },
        onCloseStatusModal(refreshData = false) {
            this.isUpdateStatusModalOpen = false;
            this.legToUpdateStatus = {};
        },
        updateStatusConfirm(updateStatus: string) {
            if (updateStatus == ServiceLegStatusEnum.ACCEPTED) {
                this.acceptDeliveryLeg({ leg: this.leg });
            }
            if (updateStatus == ServiceLegStatusEnum.REJECTED) {
                this.rejectDeliveryLeg({ leg: this.leg });
            }
            this.isUpdateStatusModalOpen = false;
        },

        showUpdateStatusAction() {
            return (
                (this.leg?.status == ServiceLegStatusEnum.SENT ||
                    this.leg.status === ServiceLegStatusEnum.ACCEPTED ||
                    this.leg.status === ServiceLegStatusEnum.REJECTED) &&
                !this.leg.isLastUpdateFromITM
            );
        },

        onCancelLegConfirm() {
            this.cancelDeliveryLeg({ leg: this.leg });
            this.showCancelLegConfirmationModal = false;
        },

        onCancelLegCancel() {
            this.showCancelLegConfirmationModal = false;
        },

        ...mapActions(DELIVERY_PLAN_NAMESPACE, {
            copyDeliveryLeg: DeliveryPlanActionEnum.COPY_DELIVERY_LEG,
            cancelDeliveryLeg: DeliveryPlanActionEnum.CANCEL_DELIVERY_LEG,
            removeDeliveryLeg: DeliveryPlanActionEnum.REMOVE_DELIVERY_LEG,
            moveDeliveryLeg: DeliveryPlanActionEnum.MOVE_DELIVERY_LEG,
            acceptDeliveryLeg: DeliveryPlanActionEnum.ACCEPT_DELIVERY_LEG,
            rejectDeliveryLeg: DeliveryPlanActionEnum.REJECT_DELIVERY_LEG,
        }),
    },
});
</script>
