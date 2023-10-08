<template>
    <div class="filter-container">
        <div class="filter-container__all-filter-wrapper">
            <mc-button
                :label="allFiltersButtonLabel"
                variant="plain"
                icon="sliders-horizontal"
                data-test="filter-container/all-filters/button"
                :fit="mdsComponentFit.button"
                @click="openFilterToolsPanel"
            />
        </div>
        <div class="filter-container__all-filter-wrapper">
            <mc-button
                :label="$t('FILTERS.SAVED_FILTERS')"
                variant="plain"
                icon="heart"
                data-test="filter-container/saved-filters/button"
                :fit="mdsComponentFit.button"
                @click="openSavedFiltersToolsPanel"
            />
        </div>

        <div class="separator" />

        <div class="filter-container__quick-filter-wrapper">
            <QuickFilters
                data-test="filter-container/quick-filters"
                :view-module="viewModule"
                :list-view-type="listViewType"
                @quickfilters-panel-active="isToolsPanelOpen = false"
            />
        </div>

        <ToolsPanel
            :is-open="isToolsPanelOpen"
            data-test="filter-container/filter-tools-panel"
            :title="filterToolsPanelTitle"
            :panel-position="toolPanelPosition"
            :primary-button-label="filterToolsPanelPrimayButtonLabel"
            :secondary-button-label="filterToolsPanelSecondaryButtonLabel"
            @close-panel="closeFilterToolsPanel"
            @primary-action="onFilterApply"
            @secondary-action="onFilterClear"
        >
            <template v-if="showSavedFilters">
                <mc-loading-indicator v-if="isFilterLoading" :fit="mdsComponentFit.loadingIndicator" variant="bar" hiddenlabel> </mc-loading-indicator>

                <DestinationNotifications :component="NotificationComponentEnum.DP_FILTERS" :position="NotificationPositionEnum.absolute" />

                <mc-notification v-if="!savedFilters.length" :body="$t('FILTERS.NO_SAVED_FILTERS')" appearance="info" icon="info-circle" />
                <div v-else>
                    <SavedFilterItem
                        v-for="items in savedFilters"
                        :key="items.id"
                        :saved-filter-item="items"
                        :is-selected="items.id === appliedSavedFilters.id"
                        @on-saved-filter-delete="handleDeleteSavedFilterFromId"
                        @on-saved-filter-applied="handleApplySavedFilters"
                        @on-set-as-default="handleDefaultFilter($event, true)"
                        @on-unset-as-default="handleDefaultFilter($event, false)"
                    />
                </div>
            </template>
            <SCMFilters
                v-else
                :applied-filters="appliedFiltersForSCMFilter"
                :accordion-section="filterSections"
                @remove-individual-tag="handleRemoveSingleTag"
                @save-filter="handleSaveFilter"
            >
                <template v-for="section in filterSections" #[section.id]>
                    <FilterBox
                        :key="section.id"
                        :fields="section.fields"
                        :filter-state="filterState"
                        @filterFieldChange="onFilterFieldChange(section, $event)"
                    />
                </template>
            </SCMFilters>
        </ToolsPanel>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-button';
import i18n from '@/i18n';
import Vue, { PropType } from 'vue';
import { Filters as SCMFilters } from '@scm-ui/filters';
import DestinationNotifications from 'destination/components/notifications';
import { ToolsPanel } from '@scm-ui/tools-panel';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import FilterBox from './components/filter-box/filter-box.vue';
import { getFilters } from './static';
import { toolPanelPosition, getNotificationMessageFromAPIErrors, addNotification, clearNotifications } from 'destination/utilities';
import { updateFieldChangeInFilterState, mapAppliedFiltersToFilterState, mapAppliedFiltersToSCMAppliedFilters, validateFilterName } from './logic';
import { ListViewTypeEnum, MDS_COMPONENT_FIT, NotificationComponentEnum, NotificationPositionEnum } from '@/static';
import { listViewTypeSpecificAction, showErrorNotification } from '@/logic';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { NAMESPACE as LCL_LIST_NAMESPACE } from '@/store/modules/lcl-list/static';
import { NAMESPACE as FILTER_NAMESPACE, FilterActionEnum, FilterGetterEnum, FilterMutationEnum } from '@/store/modules/filter/static';
import { IAppliedFilters, IFilterField, IFilterFieldChangeEvent, IFilterSection, ISavedFilterItem } from '@/interfaces';
import {
    NAMESPACE as QUICK_FILTER_NAMESPACE,
    QuickFilterActionEnum,
    QuickFilterGetterEnum,
    QuickFilterMutationEnum,
} from '@/store/modules/quick-filters/static';
import { omit } from 'lodash';
import SavedFilterItem from '../saved-filter-item/saved-filter-item.vue';

import QuickFilters from './components/quick-filters/quick-filters.vue';
import './styles/filter-container.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'filter-container',

    i18n,

    components: {
        FilterBox,
        SavedFilterItem,
        SCMFilters,
        ToolsPanel,
        QuickFilters,
        DestinationNotifications,
    },

    props: {
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
    },

    data() {
        return {
            isToolsPanelOpen: false,
            filterState: {},
            showSavedFilters: false,
            filterToolsPanelTitle: '',
            filterToolsPanelPrimayButtonLabel: '',
            filterToolsPanelSecondaryButtonLabel: '',
            NotificationComponentEnum: NotificationComponentEnum,
            NotificationPositionEnum: NotificationPositionEnum,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        filterSections() {
            return listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return this.$store.getters[`${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_SECTIONS}`];
                },
                [ListViewTypeEnum.lcl]: () => {
                    return this.$store.getters[`${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_SECTIONS}`];
                },
            });
        },
        appliedFilters() {
            return listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return this.$store.state[FCL_LIST_NAMESPACE][FILTER_NAMESPACE].appliedFilters;
                },
                [ListViewTypeEnum.lcl]: () => {
                    return this.$store.state[LCL_LIST_NAMESPACE][FILTER_NAMESPACE].appliedFilters;
                },
            });
        },
        appliedSavedFilters() {
            return listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return this.$store.getters[`${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_APPLIED_FILTER_IN_SAVE_FILTERS}`];
                },
                [ListViewTypeEnum.lcl]: () => {
                    return this.$store.getters[`${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_APPLIED_FILTER_IN_SAVE_FILTERS}`];
                },
            });
        },
        savedFilters() {
            return listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return this.$store.getters[`${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_SAVED_FILTERS}`];
                },
                [ListViewTypeEnum.lcl]: () => {
                    return this.$store.getters[`${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_SAVED_FILTERS}`];
                },
            });
        },
        saveFilterSectionErrorMessages() {
            return listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return this.$store.getters[`${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_SAVED_FILTER_ERROR_MESSAGE}`];
                },
                [ListViewTypeEnum.lcl]: () => {
                    return this.$store.getters[`${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_SAVED_FILTER_ERROR_MESSAGE}`];
                },
            });
        },
        appliedFiltersForSCMFilter() {
            return mapAppliedFiltersToSCMAppliedFilters({
                filterSections: this.filterSections,
                appliedFilters: listViewTypeSpecificAction(this.listViewType, {
                    [ListViewTypeEnum.fcl]: () => {
                        return this.$store.state[FCL_LIST_NAMESPACE][FILTER_NAMESPACE].appliedFilters;
                    },
                    [ListViewTypeEnum.lcl]: () => {
                        return this.$store.state[LCL_LIST_NAMESPACE][FILTER_NAMESPACE].appliedFilters;
                    },
                }),
            });
        },
        isFilterLoading() {
            return listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return this.$store.getters[`${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_SAVED_FILTER_LOADING_STATUS}`];
                },
                [ListViewTypeEnum.lcl]: () => {
                    return this.$store.getters[`${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterGetterEnum.GET_SAVED_FILTER_LOADING_STATUS}`];
                },
            });
        },
        countAppliedFilters() {
            let count = 0;
            for (let key in this.appliedFilters) {
                if (Array.isArray(this.appliedFilters[key])) {
                    count += this.appliedFilters[key].length;
                } else {
                    count++;
                }
            }
            return count;
        },
        allFiltersButtonLabel() {
            const label = i18n.t('ALL_FILTERS').toString();
            return this.countAppliedFilters > 0 ? `${label} (${this.countAppliedFilters})` : label;
        },
        viewModule() {
            return listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => FCL_LIST_NAMESPACE,
                [ListViewTypeEnum.lcl]: () => LCL_LIST_NAMESPACE,
            });
        },
        toolPanelPosition() {
            return toolPanelPosition().valueOf();
        },
    },

    watch: {
        appliedFilters() {
            this.filterState = mapAppliedFiltersToFilterState(this.appliedFilters);
        },
    },

    async created() {
        this.initializeFilters();
        this.initializeAppliedFilters();
        this.filterState = mapAppliedFiltersToFilterState(this.appliedFilters);
    },

    destroyed() {
        clearNotifications(NotificationComponentEnum.DP_FILTERS);
    },

    methods: {
        initializeFilters() {
            const { action } = listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => ({
                    action: `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.INITIALIZE_FILTERS}`,
                }),
                [ListViewTypeEnum.lcl]: () => ({
                    action: `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.INITIALIZE_FILTERS}`,
                }),
            });
            this.$store.dispatch(action, {
                filters: getFilters({
                    listViewType: this.listViewType,
                    $store: this.$store,
                }),
            });
        },
        async initializeAppliedFilters() {
         
            const browserQueryParams = this.$router.currentRoute.query;
            const action = listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.INITIALIZE_APPLIED_FILTERS}`,
                [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.INITIALIZE_APPLIED_FILTERS}`,
            });

             const quickfilterAction = listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${QUICK_FILTER_NAMESPACE}/INITIALIZE_APPLIED_QUICK_FILTERS`,
                [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${QUICK_FILTER_NAMESPACE}/INITIALIZE_APPLIED_QUICK_FILTERS`,
            });
         
             await this.$store.dispatch(action, { browserQueryParams, listViewTypeId: this.viewModule });
             await this.$store.dispatch(quickfilterAction, { browserQueryParams, listViewTypeId: this.viewModule });
        },
        openFilterToolsPanel() {
            this.showSavedFilters = false;
            this.filterToolsPanelTitle = i18n.t('ALL_FILTERS').toString();
            this.filterToolsPanelPrimayButtonLabel = i18n.t('APPLY').toString();
            this.filterToolsPanelSecondaryButtonLabel = i18n.t('RESET').toString();
            this.isToolsPanelOpen = true;
        },
        openSavedFiltersToolsPanel() {
            this.filterToolsPanelTitle = i18n.t('FILTERS.SAVED_FILTERS').toString();
            this.showSavedFilters = true;
            this.filterToolsPanelPrimayButtonLabel = null;
            this.filterToolsPanelSecondaryButtonLabel = null;
            this.isToolsPanelOpen = true;
        },

        closeFilterToolsPanel() {
            this.isToolsPanelOpen = false;
        },
        handleRemoveSingleTag(updatedInput, removedTagValue) {
            const { name: filterId } = updatedInput;
            if (Array.isArray(this.filterState[filterId]) && this.filterState[filterId].length > 1) {
                this.filterState[filterId] = this.filterState[filterId].filter((e: any) => e != removedTagValue);
            } else {
                this.filterState = omit(this.filterState, filterId);
            }
            const action = listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.SET_APPLIED_FILTERS}`,
                [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.SET_APPLIED_FILTERS}`,
            });
            this.$store.dispatch(action, { appliedFilters: this.filterState });
        },
        onFilterFieldChange(section: IFilterSection, event: IFilterFieldChangeEvent) {
            this.filterState = updateFieldChangeInFilterState(this.filterState, event);
        },
        onFilterApply() {
            this.$store.dispatch(`${this.viewModule}/${FILTER_NAMESPACE}/${FilterActionEnum.SET_APPLIED_FILTERS}`, { appliedFilters: this.filterState });
            this.closeFilterToolsPanel();
        },
        onFilterClear() {
            this.filterState = {};
            this.onFilterApply();
        },
        async handleSaveFilter(event: ISavedFilterItem) {
            clearNotifications(NotificationComponentEnum.DP_FILTERS);

            try {
                const { isValid, message } = validateFilterName({ filterName: event.name, savedFilters: this.savedFilters });
                if (!isValid) {
                    showErrorNotification(message!);
                    return;
                }

                const action = listViewTypeSpecificAction(this.listViewType, {
                    [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.SAVE_FILTERS}`,
                    [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.SAVE_FILTERS}`,
                });
                await this.$store.dispatch(action, { filterName: event.name, appliedFilters: this.appliedFilters, listViewTypeId: this.viewModule });
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_FILTERS, getNotificationMessageFromAPIErrors({ error }));
            }
            this.openSavedFiltersToolsPanel();
        },
        handleDefaultFilter(event: ISavedFilterItem, isSelectedAsDefault: boolean) {
            const { id } = event;
            const action = listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.UPDATE_DEFAULT_FILTERS}`,
                [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.UPDATE_DEFAULT_FILTERS}`,
            });
            this.$store.dispatch(action, { filterId: id, listViewTypeId: this.viewModule, shouldBeDefault: isSelectedAsDefault });
        },
        handleApplySavedFilters(event: ISavedFilterItem) {
            const action = listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.APPLY_SAVED_FILTERS}`,
                [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.APPLY_SAVED_FILTERS}`,
            });
            this.$store.dispatch(action, { savedFilters: event });
            this.closeFilterToolsPanel();
        },
        handleDeleteSavedFilterFromId(event: ISavedFilterItem) {
            const { id } = event;
            const action = listViewTypeSpecificAction(this.listViewType, {
                [ListViewTypeEnum.fcl]: () => `${FCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.DELETE_SAVED_FILTERS}`,
                [ListViewTypeEnum.lcl]: () => `${LCL_LIST_NAMESPACE}/${FILTER_NAMESPACE}/${FilterActionEnum.DELETE_SAVED_FILTERS}`,
            });
            this.$store.dispatch(action, { filterId: id, listViewTypeId: this.viewModule });
        },
    },
});
</script>
