<template>
    <PageLayout>
        <DestinationNotifications :component="NotificationComponentEnum.DP_ROOT" />

        <template #page-header>
            <PageHeader :tabs="pageHeaderTabs" :title="title" />
        </template>

        <div class="destination-delivery-planning">
            <router-view :key="$route.fullPath" />
        </div>
    </PageLayout>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router';
import { PageLayout } from '@scm-ui/page-layout';
import { PageHeader } from '@scm-ui/page-header';
import DestinationNotifications from 'destination/components/notifications';
import { clearNotifications, isFeatureEnabled } from 'destination/utilities';
import { IAppContext, IProps, IData, IComputed, IMethods, IPageHeaderTab } from '@/interfaces/app';
import router from '@/router';
import store from '@/store';
import i18n from '@/i18n';
import { RouteNameEnum } from '@/router/routes';
import { NotificationComponentEnum, FeatureToggleEnum } from '@/static';

import '@/styles/main.scss';

const context: IAppContext = {
    router,
    store,
    i18n,
};

export default Object.assign(
    Vue.extend<IData, IMethods, IComputed, IProps>({
        name: 'destination-delivery-planning',

        router,

        store,

        i18n,

        components: {
            PageHeader,
            PageLayout,
            DestinationNotifications,
        },

        data() {
            return {
                NotificationComponentEnum: NotificationComponentEnum,
                title: i18n.t('APP_TITLE').toString(),
                pageHeaderTabs: [],
            };
        },

        watch: {
            $route() {
                this.setActivePageHeaderTab({ currentRoute: this.$route });
            },
        },

        created() {
            this.pageHeaderTabs = [
                {
                    label: i18n.t('FCL').toString(),
                    active: false,
                    routes: [RouteNameEnum.Fcl, RouteNameEnum.FCL_DETAILS],
                    defaultRoute: RouteNameEnum.Fcl,
                },
                ...(isFeatureEnabled(FeatureToggleEnum.DP_LCL_LISTVIEW)
                    ? [
                          {
                              label: i18n.t('LCL').toString(),
                              active: false,
                              routes: [RouteNameEnum.Lcl, RouteNameEnum.LCL_DETAILS],
                              defaultRoute: RouteNameEnum.Lcl,
                          },
                      ]
                    : []),
            ].map((tab: IPageHeaderTab) => ({ ...tab, actionMethod: () => this.onPageHeaderTabClick({ tab }) }));
        },

        mounted() {
            document.title = `${i18n.t('APP_TITLE_PREFIX').toString()} - ${i18n.t('APP_TITLE').toString()}`;
        },

        destroyed() {
            clearNotifications(NotificationComponentEnum.DP_ROOT);
        },

        methods: {
            onPageHeaderTabClick({ tab }: { tab: IPageHeaderTab }) {
                this.$router.replace({ name: tab.defaultRoute }).catch(() => {
                    // This is intentional
                });
            },
            setActivePageHeaderTab({ currentRoute }: { currentRoute: Route }) {
                this.pageHeaderTabs.forEach((tab: IPageHeaderTab) => (tab.active = tab.routes.includes(currentRoute.name as string)));
            },
        },
    }),

    context,
);
</script>
