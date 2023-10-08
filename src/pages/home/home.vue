<template>
    <div class="home" :class="{ 'opened-within-hub': isOpenedWithinHub }">
        <DestinationNotifications :component="NotificationComponentEnum.DP_LIST_PAGE" />

        <ListView :list-view-type="currentTab.name" :list-view-module="listViewModule" />
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-tab';
import '@maersk-global/mds-components-core/mc-tab-bar';
import Vue from 'vue';
import DestinationNotifications from 'destination/components/notifications';
import { isApplicationOpenedWithinHub, clearNotifications } from 'destination/utilities';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import ListView from '@/components/list-view/list-view.vue';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { NAMESPACE as LCL_LIST_NAMESPACE } from '@/store/modules/lcl-list/static';
import { MDS_COMPONENT_TYPE, ListViewTypeEnum, NotificationComponentEnum } from '@/static';
import { listViewTypeSpecificAction } from '@/logic';
import { getMDSComponentFit } from '@/utilities';

import './styles/home.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'home',

    i18n,

    components: {
        DestinationNotifications,
        ListView,
    },

    data() {
        return {
            NotificationComponentEnum: NotificationComponentEnum,
            isOpenedWithinHub: isApplicationOpenedWithinHub(),
            currentTab: {
                index: 0,
                name: ListViewTypeEnum.fcl,
            },
        };
    },

    computed: {
        mdsTabsComponentFit() {
            return getMDSComponentFit(MDS_COMPONENT_TYPE.tabs);
        },
        listViewModule() {
            return listViewTypeSpecificAction(this.currentTab.name, {
                [ListViewTypeEnum.fcl]: () => FCL_LIST_NAMESPACE,
                [ListViewTypeEnum.lcl]: () => LCL_LIST_NAMESPACE,
            });
        },
    },

    destroyed() {
        clearNotifications(NotificationComponentEnum.DP_LIST_PAGE);
    },
});
</script>
