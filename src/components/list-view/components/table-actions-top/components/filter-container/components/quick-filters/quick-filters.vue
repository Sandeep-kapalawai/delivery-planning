<template>
    <div>
        <div class="quick-filter__all-filter-wrapper">
            <mc-button
                data-test="quick-filter/quick-filters-button"
            :label="quickFiltersLabel"
                :fit="mdsComponentFit.button"
                variant="plain"
                icon="star"
                @click="displayQuickFilterPanel"
            />
        </div>

        <div class="quick-filters">
            <ToolsPanel
                :is-open="toggleQuickFilterPanel"
                data-test="quick-filter/filter-tools-panel"
                :title="$t('QUICK_FILTERS')"
                :panel-position="toolPanelPosition"
                :secondary-button-label="$t('RESET')"
                :primary-button-label="null"
                @close-panel="toggleQuickFilterPanel = false"
                @secondary-action="clearAllQuickFilters"
            >
                <DestinationNotifications :component="NotificationComponentEnum.DP_QUICK_FILTERS" :position="NotificationPositionEnum.absolute" />
                <div class="tab-section">
                    <mc-tab-bar
                        data-test="quick-filters/tabswitcher"
                        :currentindex="currentTab.index"
                        :fit="mdsComponentFit.tabs"
                        variant="stretched"
                        @change="onTabChange"
                    >
                        <mc-tab slot="tab" data-test="quick-filters/plan-monitor-tab" :label="$t('FILTERS.PLANNING')" />
                        <div slot="panel" />

                        <mc-tab slot="tab" data-test="quick-filters/container-mgnt-tab" :label="$t('FILTERS.MONITOR')" />
                        <div slot="panel" />
                    </mc-tab-bar>
                </div>

                <div v-if="currentTab.index === 0">
                    <mc-c-accordion v-if="!isErrorAtPlanTiles" class="quick-filters-accordian">
                        <mc-c-accordion-item
                            id="1"
                            :title="$t('FILTERS.PLAN')"
                            :expanded="true"
                            :fit="mdsComponentFit.accordion"
                            class="accordian-title"
                            data-test="quick-filters/accordian"
                        >
                            <mc-loading-indicator v-if="planningStatus && planningStatus.isFetching" class="destination_mc-loading-indicator_panel" />
                            <div
                                v-for="(ele, index) in planningStatus && planningStatus.result"
                                :key="index"
                                data-test="quick-filter/planningStatus"
                                :class="{ selectedfilter: ele.isSelected, tile: !ele.isSelected }"
                                :title="ele.label"
                                @click="handleSelectedFilters(ele, index, 'planningStatus')"
                            >
                                <div>{{ ele.label }}</div>
                                <div>{{ ele.count }}</div>
                            </div>
                        </mc-c-accordion-item>

                        <mc-c-accordion-item
                            id="2"
                            :title="$t('DEMURRAGE')"
                            :expanded="true"
                            :fit="mdsComponentFit.accordion"
                            class="accordian-title"
                            data-test="quick-filters/accordian"
                        >
                            <mc-loading-indicator v-if="lastFreeDaysGroups && lastFreeDaysGroups.isFetching" class="destination_mc-loading-indicator_panel" />
                            <div
                                v-for="(ele, index) in lastFreeDaysGroups && lastFreeDaysGroups.result.slice(0, 3)"
                                :key="index"
                                :class="{ selectedfilter: ele.isSelected, tile: !ele.isSelected }"
                                @click="handleSelectedFilters(ele, index, 'lastFreeDaysGroups')"
                                :title="ele.label"
                            >
                                <div v-if="!ele.isSelected" :class="`category-${ele.category}`">{{ ele.label }}</div>
                                <div v-else>{{ ele.label }}</div>
                                <div>{{ ele.count }}</div>
                            </div>
                        </mc-c-accordion-item>
                        <mc-c-accordion-item
                            id="3"
                            :title="$t('DETENTION')"
                            :expanded="true"
                            :fit="mdsComponentFit.accordion"
                            class="accordian-title"
                            data-test="quick-filters/accordian"
                            
                        >
                            <mc-loading-indicator v-if="lastFreeDaysGroups && lastFreeDaysGroups.isFetching" class="destination_mc-loading-indicator_panel" />
                            <div
                                v-for="(ele, index) in lastFreeDaysGroups && lastFreeDaysGroups.result.slice(3, lastFreeDaysGroups.result.length)"
                                :key="index"
                                :class="{ selectedfilter: ele.isSelected, tile: !ele.isSelected }"
                                @click="handleSelectedFilters(ele, index + 3, 'lastFreeDaysGroups')"
                                :title="ele.label"
                            >
                                <div v-if="!ele.isSelected" :class="`category-${ele.category}`">{{ ele.label }}</div>
                                <div v-else>{{ ele.label }}</div>
                                <div>{{ ele.count }}</div>
                            </div>
                        </mc-c-accordion-item>

                        <mc-c-accordion-item
                            id="4"
                            :title="$t('PRIORITY')"
                            :expanded="true"
                            :fit="mdsComponentFit.accordion"
                            class="accordian-title"
                            data-test="quick-filters/accordian"
                        >
                            <mc-loading-indicator v-if="priorityLevelGroups && priorityLevelGroups.isFetching" class="destination_mc-loading-indicator_panel" />

                            <div
                                v-for="(ele, index) in priorityLevelGroups && priorityLevelGroups.result"
                                :key="index"
                                :class="{ selectedfilter: ele.isSelected, tile: !ele.isSelected }"
                                @click="handleSelectedFilters(ele, index, 'priorityLevelGroups')"
                                :title="ele.label"
                            >
                                <div v-if="!ele.isSelected" :class="`priority-level-${ele.priorityLevel}`">{{ ele.label }}</div>
                                <div v-else>{{ ele.label }}</div>
                                <div>{{ ele.count }}</div>
                            </div>
                        </mc-c-accordion-item>
                    </mc-c-accordion>
                </div>
                <div v-if="currentTab.index === 1">
                    <mc-c-accordion v-if="!isErrorAtMonitorTiles" class="quick-filters-accordian">
                        <mc-c-accordion-item
                            id="1"
                            :title="$t('FILTERS.MONITOR')"
                            :expanded="true"
                            :fit="mdsComponentFit.accordion"
                            class="accordian-title"
                            data-test="quick-filters/accordian"
                        >
                            <mc-loading-indicator v-if="executionStatus && executionStatus.isFetching" class="destination_mc-loading-indicator_panel" />
                            <div
                                v-for="(ele, index) in executionStatus && executionStatus.result"
                                :key="index"
                                :class="{ selectedfilter: ele.isSelected, tile: !ele.isSelected }"
                                @click="handleSelectedFilters(ele, index, 'executionStatusGroups')"
                            >
                                <div>{{ ele.label }}</div>
                                <div>{{ ele.count }}</div>
                            </div>
                        </mc-c-accordion-item>
                    </mc-c-accordion>
                </div>
            </ToolsPanel>
        </div>
    </div>
</template>
<script lang="ts">
import '@maersk-global/mds-components-community/mc-c-accordion';

import Vue, { PropType } from 'vue';
import { debounce } from 'lodash';
import { ListViewTypeEnum, MDS_COMPONENT_FIT, NotificationComponentEnum, NotificationPositionEnum } from '@/static';
import { ToolsPanel } from '@scm-ui/tools-panel';
import { toolPanelPosition, getNotificationMessageFromAPIErrors, addNotification, clearNotifications } from 'destination/utilities';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import i18n from '@/i18n';
import DestinationNotifications from 'destination/components/notifications';
import {
    NAMESPACE as QUICK_FILTER_NAMESPACE,
    QuickFilterActionEnum,
    QuickFilterGetterEnum,
    QuickFilterMutationEnum,
} from '@/store/modules/quick-filters/static';
import { QuickFiltersForTilesEnum } from '../../static';
import { CombinedVueInstance } from 'vue/types/vue';

import './styles/quick-filters.scss';
import { listViewTypeSpecificAction } from '@/logic';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'quick-filter',

    i18n,

    components: {
        ToolsPanel,
        DestinationNotifications,
    },

    props: {
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
        viewModule: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
    },

    data() {
        return {
            toggleQuickFilterPanel: false,
            currentTab: {
                index: 0,
                name: QuickFiltersForTilesEnum.Plan as string,
            },
            NotificationComponentEnum: NotificationComponentEnum,
            NotificationPositionEnum: NotificationPositionEnum,
            isErrorAtPlanTiles: false,
            isErrorAtMonitorTiles: false,
        };
    },
    async created() {
        // this.initializeAppliedFQuickilters();
    },
    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        planningStatus() {
            return this.$store.getters[`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterGetterEnum.GET_PLANNING_STATUS}`];
        },
        executionStatus() {
            return this.$store.getters[`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterGetterEnum.GET_EXECUTION_STATUS}`];
        },
        priorityLevelGroups() {
            return this.$store.getters[`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterGetterEnum.GET_PRIORITY_LEVEL_GROUPS}`];
        },
        lastFreeDaysGroups() {
            return this.$store.getters[`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterGetterEnum.GET_LAST_FREE_DAYS_GROUPS}`];
        },
        quickFiltersLabel() {
            const label = i18n.t('QUICK_FILTERS').toString();
            return this.getAppliedQuickFilters?.length > 0 ? `${label} (${this.getAppliedQuickFilters?.length})` : label;
        },
        getAppliedQuickFilters() {
            return this.$store.getters[`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterGetterEnum.GET_APPLIED_QUICK_FILTERS}`];
        },
        toolPanelPosition() {
            return toolPanelPosition().valueOf();
        },
    },

    destroyed() {
        clearNotifications(NotificationComponentEnum.DP_QUICK_FILTERS);
    },

    methods: {
        initializeAppliedFQuickilters() {
            const browserQueryParams = this.$router.currentRoute.query;
            console.log(browserQueryParams, 'browserQueryParams');
            const action = listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => `${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterActionEnum.INITIALIZE_APPLIED_QUICK_FILTERS}`,
                [ListViewTypeEnum.lcl]: () => `${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterActionEnum.INITIALIZE_APPLIED_QUICK_FILTERS}`,
            });
            this.$store.dispatch(action, { browserQueryParams, listViewTypeId: this.viewModule });
        },
        onTabChange(event: { detail: number }) {
            this.setSelectedTab(event.detail);
        },
        setSelectedTab(tabIndex: number) {
            this.currentTab = {
                index: tabIndex,
            };
        },
        async fetchPlanTiles() {
            clearNotifications(NotificationComponentEnum.DP_QUICK_FILTERS);

            try {
                const actions = [
                    QuickFilterActionEnum.FETCH_PLANNING_STATUS,
                    QuickFilterActionEnum.FETCH_LAST_FREE_DAYS_GROUPS,
                    QuickFilterActionEnum.FETCH_PRIORITY_LEVEL_GROUPS,
                ];

                const dispatchPromises = actions.map(async (action) => {
                    await this.$store.dispatch(`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${action}`, {
                        viewModule: this.viewModule,
                    });
                });

                await Promise.all(dispatchPromises);
            } catch (error: any) {
                this.isErrorAtPlanTiles = true;
                addNotification(NotificationComponentEnum.DP_QUICK_FILTERS, getNotificationMessageFromAPIErrors({ error }));
            }
        },
        async fetchMonitorTiles() {
            clearNotifications(NotificationComponentEnum.DP_QUICK_FILTERS);

            try {
                await this.$store.dispatch(`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterActionEnum.FETCH_EXECUTION_STATUS}`, {
                    viewModule: this.viewModule,
                });
            } catch (error: any) {
                this.isErrorAtMonitorTiles = true;
                addNotification(NotificationComponentEnum.DP_QUICK_FILTERS, getNotificationMessageFromAPIErrors({ error }));
            }
        },
        displayQuickFilterPanel() {
            this.toggleQuickFilterPanel = true;
            this.$emit('quickfilters-panel-active');
            if (this.getAppliedQuickFilters.length < 1) {
                this.fetchPlanTiles();
                this.fetchMonitorTiles();
            }
        },
        handleSelectedFilters: debounce(async function (this: CombinedVueInstance<Vue, IData, IMethods, IComputed, Readonly<IProps>>, ele, index, type) {
            const quickFilters = ['planningStatus', 'lastFreeDaysGroups', 'priorityLevelGroups', 'executionStatusGroups'];
            quickFilters.forEach((quickFilterType) => {
                if (quickFilterType !== type) {
                    this.$store.dispatch(`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterMutationEnum.RESET_QUICK_FILTER_TYPE}`, {
                        type: quickFilterType,
                    });
                }
            });

            ele.isSelected
                ? this.$store.commit(`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterMutationEnum.SET_DESELECT_QUICK_FILTERS}`, { index, type })
                : this.$store.commit(`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterMutationEnum.SET_SELECTED_QUICK_FILTERS}`, { index, type });

            clearNotifications(NotificationComponentEnum.DP_QUICK_FILTERS);

            try {
                await this.$store.dispatch(`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterActionEnum.GROUPED_QUICK_FILTERS}`, {
                    viewModule: this.viewModule,
                });
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_QUICK_FILTERS, getNotificationMessageFromAPIErrors({ error }));
            }
        }, 300),

        clearAllQuickFilters() {
            this.$store.commit(`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterMutationEnum.CLEAR_ALL_QUICK_FILTERS}`);
            this.$store.dispatch(`${this.viewModule}/${QUICK_FILTER_NAMESPACE}/${QuickFilterActionEnum.GROUPED_QUICK_FILTERS}`, {
                viewModule: this.viewModule,
            });
            this.toggleQuickFilterPanel = false;
        },
    },
});
</script>
