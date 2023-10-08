<template>
    <div class="details-view">
        <mc-loading-indicator v-if="details.isFetching || deliveryPlan.isFetching" class="destination_mc-loading-indicator" :label="$t('MESSAGE.LOADING')" />

        <Row :columns="16" class="details-view_row details-view_row_back-navigation">
            <Column :xs="16" :md="16" :lg="12" :lg-offset="2">
                <span data-test="details-view/back-to-dashboard" @click="navigateToListPage">
                    <mc-icon data-test="details-view/back-to-dashboard-icon" icon="arrow-left" size="24" />{{ $t('BACK_TO_DASHBOARD') }}
                </span>
            </Column>
        </Row>

        <Row :columns="16" class="details-view_row">
            <Column :xs="16" :md="16" :lg="12" :lg-offset="2">
                <HeaderSection :view-module="viewModule" :isSICancelled="isSICancelled" @update-details="onUpdateDetails" />
            </Column>
        </Row>

        <template v-if="!isSICancelled">
            <DeliveryPlan :id="id" view-type="viewType" :view-name="viewName" :details="details" />

            <Row v-if="!details.isFetching" :columns="16" class="details-view_row">
                <Column :xs="16" :md="16" :lg="12" :lg-offset="2">
                    <div class="details-view_row_tabs">
                        <DetailsTabs :id="id" :view-type="viewType" :view-module="viewModule" :details="details" />
                    </div>
                </Column>
            </Row>
        </template>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-icon';
import '@maersk-global/mds-components-core/mc-loading-indicator';
import Vue, { PropType } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { Row, Column } from '@scm-ui/grid-system';
import { getNotificationMessageFromAPIErrors, addNotification, removeNotification, clearNotifications } from 'destination/utilities';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import HeaderSection from './components/header-section/header-section.vue';
import DeliveryPlan from '@/components/delivery-plan/delivery-plan.vue';
import DetailsTabs from './components/details-tabs/details-tabs.vue';
import { DetailsGetterEnum } from '@/store/static/details-module-enum';
import { NAMESPACE as CUSTOMER_CONFIGURATION_NAMESPACE, CustomerConfigurationActionEnum } from '@/store/modules/customer-configuration/static';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanGetterEnum } from '@/store/modules/delivery-plan/static';
import {
    MDS_COMPONENT_FIT,
    ListViewTypeEnum,
    DeliveryPlanningViewNameEnum,
    NotificationAppearanceEnum,
    NotificationComponentEnum,
    ShipmentStatusEnum,
    NOTIFICATION_ID,
} from '@/static';
import { INotificationConfig } from '@/interfaces';
import { listViewTypeSpecificAction } from '@/logic';
import { RouteNameEnum } from '@/router/routes';
import { DetailsActionEnum } from '@/store/static';

import './styles/details-view.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'details-view',

    i18n,

    components: {
        Row,
        Column,
        HeaderSection,
        DeliveryPlan,
        DetailsTabs,
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
        viewModule: {
            type: String,
            required: true,
        },
        viewName: {
            type: String as PropType<DeliveryPlanningViewNameEnum>,
            required: true,
            default: DeliveryPlanningViewNameEnum.DP_ManagePlan,
        },
    },

    computed: {
        ...mapGetters(DELIVERY_PLAN_NAMESPACE, {
            deliveryPlan: DeliveryPlanGetterEnum.GET_DELIVERY_PLAN,
            allDeliveryLegs: DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS,
        }),
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        details() {
            return this.$store.getters[`${this.viewModule}/${DetailsGetterEnum.GET_DETAILS}`];
        },
        deliveryOrderCount() {
            return this.allDeliveryLegs.filter((ele) => ele.deliveryOrder != null);
        },
        isSICancelled() {
            return this.details.result.shipmentStatus === ShipmentStatusEnum.CANCELLED && this.deliveryOrderCount?.length === 0;
        },
    },

    async created() {
        await this.fetchDetails();

        // Fetching Customer Configuration
        try {
            removeNotification(NotificationComponentEnum.DP_DETAILS_PAGE, NOTIFICATION_ID.FETCH_CUSTOMER_CONFIG);
            await this.fetchCustomerConfiguration({ customerBECode: this.details.result.consigneeBECode });
        } catch (error: any) {
            addNotification(
                NotificationComponentEnum.DP_DETAILS_PAGE,
                getNotificationMessageFromAPIErrors({ id: NOTIFICATION_ID.FETCH_CUSTOMER_CONFIG, error }),
            );
        }
    },

    destroyed() {
        this.resetDetailsState();
        this.resetCustomerConfiguration();
    },

    methods: {
        ...mapActions(CUSTOMER_CONFIGURATION_NAMESPACE, {
            fetchCustomerConfiguration: CustomerConfigurationActionEnum.FETCH_CONFIGURATION,
            resetCustomerConfiguration: CustomerConfigurationActionEnum.RESET_CONFIGURATION,
        }),
        navigateToListPage() {
            const routeName = listViewTypeSpecificAction<string>(this.viewType, {
                [ListViewTypeEnum.fcl]: () => RouteNameEnum.Fcl,
                [ListViewTypeEnum.lcl]: () => RouteNameEnum.Lcl,
            });

            this.$router.push({ name: routeName });
        },
        async fetchDetails() {
            try {
                removeNotification(NotificationComponentEnum.DP_DETAILS_PAGE, NOTIFICATION_ID.FETCH_DETAILS);
                await this.$store.dispatch(`${this.viewModule}/${DetailsActionEnum.FETCH_DETAILS}`, this.id);
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, getNotificationMessageFromAPIErrors({ id: NOTIFICATION_ID.FETCH_DETAILS, error }));
            }
        },
        resetDetailsState() {
            this.$store.dispatch(`${this.viewModule}/${DetailsActionEnum.RESET_STATE}`);
        },
        onUpdateDetails() {
            addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, {
                id: NOTIFICATION_ID.UPDATE_DETAILS_SUCCESS,
                appearance: NotificationAppearanceEnum.success,
                heading: i18n.t('MESSAGE.UPDATE_DETAILS_SUCCESS').toString(),
            } as INotificationConfig);

            this.fetchDetails();
        },
    },
});
</script>
