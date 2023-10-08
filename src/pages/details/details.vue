<template>
    <div class="details">
        <DestinationNotifications :component="NotificationComponentEnum.DP_DETAILS_PAGE" />

        <DetailsView :id="id" :view-name="viewName" :view-type="viewType" :view-module="viewModule" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { isNumber, toNumber } from 'lodash';
import DestinationNotifications from 'destination/components/notifications';
import { clearNotifications } from 'destination/utilities';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import DetailsView from '@/components/details-view/details-view.vue';
import { DeliveryPlanningViewNameEnum, ListViewTypeEnum, NotificationComponentEnum } from '@/static';
import { listViewTypeSpecificAction } from '@/logic';
import { NAMESPACE as FCL_DETAILS_NAMESPACE } from '@/store/modules/fcl-details/static';
import { NAMESPACE as LCL_DETAILS_NAMESPACE } from '@/store/modules/lcl-details/static';

import './styles/details.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'details-page',

    components: {
        DestinationNotifications,
        DetailsView,
    },

    data() {
        return {
            NotificationComponentEnum: NotificationComponentEnum,
        };
    },

    computed: {
        id(): number | string {
            const id: string = this.$route.params.id;
            return isNumber(id) ? toNumber(id) : id;
        },
        viewType() {
            return ListViewTypeEnum.fcl;
        },
        viewName() {
            return DeliveryPlanningViewNameEnum.DP_ManagePlan;
        },
        viewModule() {
            return listViewTypeSpecificAction(this.viewType, {
                [ListViewTypeEnum.fcl]: () => FCL_DETAILS_NAMESPACE,
                [ListViewTypeEnum.lcl]: () => LCL_DETAILS_NAMESPACE,
            });
        },
    },

    destroyed() {
        clearNotifications(NotificationComponentEnum.DP_DETAILS_PAGE);
    },
});
</script>
