<template>
    <div class="send-plan-do">
        <mc-modal
            data-spec="send-plan/confirmation"
            :heading="$t('SEND_PLAN')"
            open
            dimension="large"
            height="100vh"
            width="100vw"
            :zindex="9999"
            backdropcloseactiondisabled
            :escapecloseactiondisabled="isLoading"
            @closed="onCloseButtonClick"
        >
            <mc-loading-indicator v-if="isLoading" class="destination_mc-loading-indicator" />

            <DestinationNotifications :component="NotificationComponentEnum.DP_SEND_PLAN" :position="NotificationPositionEnum.absolute" />

            <div v-if="displayinvalidNotification && displayinvalidNotification.length" class="send-plan-notification">
                <mc-notification
                    data-spec="send-plan/invalidPlansMessage-notification"
                    :fit="mdsComponentFit.notification"
                    closable
                    appearance="error"
                    icon="exclamation-circle"
                >
                    <div slot="body">
                        {{ $t('MESSAGE.DO_MANDATORY_FIELDS_ERR_FCL') }} :
                        <div
                            v-for="(msg, index) in displayinvalidNotification"
                            :key="index"
                            data-spec="SendDeliveryOrdersPopup/invalid-plans-list"
                            class="notification-list"
                        >
                            <ul>
                                <li>
                                    {{ msg.equipmentNumber }}, {{ $t('MESSAGE.DO_YOU_WANT_TO_UPDATE') }}

                                    <span slot="actions">
                                        <mc-button
                                            data-spec="send-plan/edit-plan"
                                            :label="$t('EDIT_PLAN')"
                                            justifyitems="left"
                                            icon="pencil"
                                            iconposition="right"
                                            :fit="mdsComponentFit.button"
                                            variant="plain"
                                            appearance="alt"
                                            @click="editPlanRoute(msg.cargoStuffingNumber)"
                                        />
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </mc-notification>
            </div>
            <div v-if="displayFDLNotification && displayFDLNotification.length" class="send-plan-notification">
                <mc-notification
                    data-spec="send-plan/missingFDL-notification"
                    :fit="mdsComponentFit.notification"
                    closable
                    appearance="warning"
                    icon="exclamation-triangle"
                >
                    <div slot="body">
                        {{ $t('MESSAGE.MISSING_FDL') }} {{ renderEQBLText }} :

                        <div
                            v-for="(msg, index) in displayFDLNotification"
                            :key="index"
                            class="notification-list"
                            data-spec="SendDeliveryOrdersPopup/fdl-alert-list"
                        >
                            <ul>
                                <li>
                                    {{ msg.missingFinalDeliveryLocations }}, {{ $t('MESSAGE.DO_YOU_WANT_TO_UPDATE') }}

                                    <span slot="actions">
                                        <mc-button
                                            data-spec="send-plan/edit-plan"
                                            :label="$t('EDIT_PLAN')"
                                            justifyitems="left"
                                            icon="pencil"
                                            iconposition="right"
                                            :fit="mdsComponentFit.button"
                                            variant="plain"
                                            appearance="alt"
                                            @click="editPlanRoute(msg.cargoStuffingNumber)"
                                        />
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </mc-notification>
            </div>

            <p v-if="notChangedNotificationMessage" data-spec="send-plan/notChanged-notification" class="send-plan-notification">
                {{ notChangedNotificationMessage }}
            </p>

            <div v-if="selectedItems.length === 1 && !isLoading" data-spec="send-plan/header-section">
                <Row class="header-section_row">
                    <Column :xs="12" :md="12" :lg="4" class="header-section_col">
                        <div class="label">{{ $t('FIELD.EQUIPMENT_NUMBER') }}</div>
                        <Row> {{ headerInfo && headerInfo.equipmentNumber }}</Row>
                    </Column>
                    <Column :xs="12" :md="12" :lg="4" class="header-section_col">
                        <div class="label">{{ $t('FIELD.CONSIGNEE_BECODE') }}</div>
                        <Row> {{ headerInfo && headerInfo.consigneeName }}</Row>
                        <Row> {{ headerInfo && headerInfo.consigneeBECode }}</Row>
                    </Column>
                    <Column :xs="12" :md="12" :lg="4" class="header-section_col">
                        <div class="label">{{ $t('FIELD.CARRIER_SCAC') }}</div>
                        <Row> {{ headerInfo && headerInfo.carrierName }}</Row>
                        <Row> {{ headerInfo && headerInfo.carrierCode }}</Row>
                    </Column>
                </Row>
            </div>

            <Row v-if="isTransportPlansAvailable">
                <div class="do-confirmation">
                    {{ $t('MESSAGE.DO_CONFIRMATION') }}
                </div>
            </Row>

            <Row v-for="(row, index) in transportPlans" :key="`row${index}`" class="deliveryOrder-table">
                <TransportPlans
                    :list-view-type="listViewType"
                    :transport-plans="transportPlans"
                    :row="row"
                    :selected-items="selectedItems"
                    data-spec="send-plan/transport-plansTable"
                />
            </Row>

            <mc-button
                slot="primaryAction"
                data-spec="send-plan/send-button"
                :fit="mdsComponentFit.button"
                focusstartanchor
                :label="$t('SEND_PLAN')"
                :loading="isProcessingRequest"
                :disabled="disableSendButton"
                @click="onSendButtonClick"
            />

            <mc-button
                slot="secondaryAction"
                data-spec="send-plan/close-button"
                :fit="mdsComponentFit.button"
                focusendanchor
                :label="$t('BUTTONS.CLOSE')"
                variant="secondary"
                @click="onCloseButtonClick"
            />
        </mc-modal>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-community';
import '@maersk-global/mds-components-core/mc-notification';
import '@maersk-global/mds-components-core/mc-modal';
import '@maersk-global/mds-components-core/mc-icon';
import Vue, { PropType } from 'vue';
import { Row, Column } from '@scm-ui/grid-system';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import TransportPlans from './components/transport-plans/transport-plans.vue';
import i18n from '@/i18n';
import { MDS_COMPONENT_FIT, ListViewTypeEnum, NotificationComponentEnum, NotificationPositionEnum, NotificationAppearanceEnum } from '@/static';

import { IFclListItem, ILclListItem } from '@/interfaces';
import { getMultipleDeliveryPlanId, getMultipleDeliveryPlanIdQueryParam, listViewTypeSpecificAction } from '@/logic';
import { getNotificationMessageFromAPIErrors, addNotification, clearNotifications, clearAllNotifications } from 'destination/utilities';
import DestinationNotifications from 'destination/components/notifications';
import { RouteNameEnum } from '@/router/routes';
import {
    NAMESPACE as DELIVERY_ORDERS_NAMESPACE,
    DeliveryOrdersActionEnum,
    DeliveryOrdersGetterEnum,
    DeliveryOrdersMutationEnum,
} from '@/store/modules/delivery-orders/static';

import './styles/send-plan.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'send-plan',

    i18n,

    components: {
        Row,
        Column,
        TransportPlans,
        DestinationNotifications,
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
            isProcessingRequest: false,
            NotificationPositionEnum: NotificationPositionEnum,
            NotificationComponentEnum: NotificationComponentEnum,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        renderEQBLText() {
            return listViewTypeSpecificAction<any>(this.listViewType, {
                [ListViewTypeEnum.lcl]: () => {
                    return i18n.t('FIELD.BL(S)').toString();
                },
                [ListViewTypeEnum.fcl]: () => {
                    return i18n.t('FIELD.EQUIPMENT(S)').toString();
                },
            });
        },
        selectedItems() {
            return [...this.selectedRows.keys()];
        },
        deliveryOrdersInfo() {
            return this.$store.getters[`${DELIVERY_ORDERS_NAMESPACE}/${DeliveryOrdersGetterEnum.GET_DELIVERY_ORDERS}`];
        },
        isLoading() {
            return this.deliveryOrdersInfo.isFetching;
        },
        headerInfo() {
            return this.deliveryOrdersInfo.transportPlansData?.header;
        },
        transportPlans() {
            return this.deliveryOrdersInfo.transportPlansData?.items;
        },
        isTransportPlansAvailable() {
            return this.deliveryOrdersInfo?.transportPlansData?.items?.length > 0;
        },
        displayinvalidNotification() {
            const invalidItemsList = this.deliveryOrdersInfo.transportPlansData?.invalidItems;
            return (
                this.deliveryOrdersInfo.transportPlansData?.invalidItems?.length > 0 &&
                listViewTypeSpecificAction<any>(this.listViewType, {
                    [ListViewTypeEnum.fcl]: () => {
                        return invalidItemsList;
                    },
                    [ListViewTypeEnum.lcl]: () => {
                        return invalidItemsList;
                    },
                })
            );
        },
        displayFDLNotification() {
            const { missingFinalDeliveryLocations, missingLCLFinalDeliveryLocationModel } = this.deliveryOrdersInfo.transportPlansData;
            return listViewTypeSpecificAction<any>(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return missingFinalDeliveryLocations;
                },
                [ListViewTypeEnum.lcl]: () => {
                    return missingLCLFinalDeliveryLocationModel;
                },
            });
        },
        notChangedNotificationMessage() {
            const notChangedItemsList = this.deliveryOrdersInfo.transportPlansData?.notChangedItems?.map((ele: any) => ele.equipmentNumber?.toString());
            return (
                this.deliveryOrdersInfo?.transportPlansData?.notChangedItems?.length > 0 &&
                listViewTypeSpecificAction<any>(this.listViewType, {
                    [ListViewTypeEnum.fcl]: () => {
                        return i18n.t('MESSAGE.NOT_CHANGEDITEMS_FCL') + `${notChangedItemsList}`;
                    },
                    [ListViewTypeEnum.lcl]: () => {
                        return i18n.t('MESSAGE.NOT_CHANGEDITEMS_LCL') + `${notChangedItemsList}`;
                    },
                })
            );
        },
        disableSendButton() {
            return this.transportPlans?.length === 0 || this.deliveryOrdersInfo.transportPlansData?.invalidItems?.length > 0;
        },
        getDeliveryOrdersresult() {
            return this.$store.getters[`${DELIVERY_ORDERS_NAMESPACE}/${DeliveryOrdersGetterEnum.GET_DELIVERY_ORDER_RESULT}`];
        },
    },

    async created() {
        await this.fetchDeliveryOrders();
        clearAllNotifications();
    },

    destroyed() {
        clearNotifications(NotificationComponentEnum.DP_SEND_PLAN);
    },

    methods: {
        async fetchDeliveryOrders() {
            clearNotifications(NotificationComponentEnum.DP_SEND_PLAN);

            try {
                const deliveryPlanIds = getMultipleDeliveryPlanId(this.listViewType, Array.from(this.selectedRows.values()));
                const params = getMultipleDeliveryPlanIdQueryParam(this.listViewType, deliveryPlanIds);
                await this.$store.dispatch(`${DELIVERY_ORDERS_NAMESPACE}/${DeliveryOrdersActionEnum.FETCH_DELIVERY_ORDERS}`, params);
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_SEND_PLAN, getNotificationMessageFromAPIErrors({ error }));
            }
        },
        editPlanRoute(cargoStuffingNumber) {
            const routeName = listViewTypeSpecificAction<string>(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => RouteNameEnum.FCL_DETAILS,
                [ListViewTypeEnum.lcl]: () => RouteNameEnum.LCL_DETAILS,
            });
            this.$router.currentRoute?.params.id === cargoStuffingNumber
                ? this.$router.go(0)
                : this.$router.push({ name: routeName, params: { id: cargoStuffingNumber } });
        },
        mappedOrderItems(order, transportProviderBeCode) {
            const { cargoStuffingNumber, reasonCodeId, deliveryOrderNumber, comment } = order;
            return {
                transportProviderBeCode,

                cargoStuffingNumber,
                reasonCodeId,
                deliveryOrderNumber,
                comment,
            };
        },
        async onSendButtonClick() {
            if (this.transportPlans.length <= 0) return;

            clearNotifications(NotificationComponentEnum.DP_SEND_PLAN);

            try {
                this.isProcessingRequest = true;
                const transportOrders = this.transportPlans
                    .map((tp) => {
                        const transportProviderBeCode = tp.transportProviderCode;
                        const newOrders = tp.newOrders.map((order) => this.mappedOrderItems(order, transportProviderBeCode));
                        const revisedOrders = tp.revisedOrders.map((order) => this.mappedOrderItems(order, transportProviderBeCode));
                        const cancelledOrders = tp.cancelledOrders.map((order) => this.mappedOrderItems(order, transportProviderBeCode));
                        return [...newOrders, ...cancelledOrders, ...revisedOrders];
                    })
                    .flat();
                const payload = Object.assign({ CargoStuffings: transportOrders });
                await this.$store.dispatch(`${DELIVERY_ORDERS_NAMESPACE}/${DeliveryOrdersActionEnum.SEND_DELIVERY_ORDERS}`, { payload });
                this.$emit('send-do');
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_SEND_PLAN, getNotificationMessageFromAPIErrors({ error }));
            } finally {
                this.isProcessingRequest = false;
            }
        },
        onCloseButtonClick() {
            this.$emit('send-do-closed');
        },
    },
});
</script>
