import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import QuickFilters from './quick-filters.vue';

import { NAMESPACE as FILTER_NAMESPACE, QuickFilterActionEnum, QuickFilterGetterEnum } from '@/store/modules/quick-filters/static';

import Vuex, { Store, Module } from 'vuex';
import { IRootState } from '@/store/interfaces';
import { ToolsPanel } from '@scm-ui/tools-panel';
import { EXECUTION_STATUSES_MOCK, LAST_FREE_DAYS_GROUPS_MOCK, PLANNING_STATUS_MOCK, PRIORITY_LEVEL_GROUPS_MOCK } from '@/mocks/filters';

const localVue = createLocalVue();
localVue.use(Vuex);

const createStore = () => {
    const quickFiltersList: Module<any, IRootState> = {
        namespaced: true,
        state: () => ({
            quickFilters: {
                planningStatus: {
                    isFetching: false,
                    result: PLANNING_STATUS_MOCK,
                    errorMessage: '',
                },
                executionStatus: {
                    isFetching: false,
                    errorMessage: '',
                    result: EXECUTION_STATUSES_MOCK,
                },
                priorityLevelGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: PRIORITY_LEVEL_GROUPS_MOCK,
                },
                lastFreeDaysGroups: {
                    isFetching: false,
                    errorMessage: '',
                    result: LAST_FREE_DAYS_GROUPS_MOCK,
                },
            },
            groupedQuickFilters: {},
            appliedQuickFilters: [],
        }),

        getters: {
            [QuickFilterGetterEnum.GET_PLANNING_STATUS](state) {
                return state.quickFilters.planningStatus;
            },
            [QuickFilterGetterEnum.GET_EXECUTION_STATUS](state) {
                return state.quickFilters.executionStatus;
            },
            [QuickFilterGetterEnum.GET_PRIORITY_LEVEL_GROUPS](state) {
                return state.quickFilters.priorityLevelGroups;
            },
            [QuickFilterGetterEnum.GET_LAST_FREE_DAYS_GROUPS](state) {
                return state.quickFilters.lastFreeDaysGroups;
            },
            [QuickFilterGetterEnum.GET_APPLIED_QUICK_FILTERS](state) {
                return state.quickFilters.appliedQuickFilters;
            },
        },
        actions: {
            [QuickFilterActionEnum.FETCH_PLANNING_STATUS]: jest.fn(),
            [QuickFilterActionEnum.FETCH_EXECUTION_STATUS]: jest.fn(),
            [QuickFilterActionEnum.FETCH_PRIORITY_LEVEL_GROUPS]: jest.fn(),
            [QuickFilterActionEnum.FETCH_LAST_FREE_DAYS_GROUPS]: jest.fn(),
            [QuickFilterActionEnum.GROUPED_QUICK_FILTERS]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [FILTER_NAMESPACE]: quickFiltersList,
        },
    });
    return { store, quickFiltersList };
};

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(QuickFilters, {
        ...options,
    });

describe('QuickFilters', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let quickFiltersList: any;

    const wrapperFind = {
        quickFiltersButton: () => wrapper.find('[data-test="quick-filter/quick-filters-button"]'),
        quickFiltersToolsPanel: () => wrapper.find('[data-test="quick-filter/filter-tools-panel"]'),
        planMonitorTab: () => wrapper.find('[data-test="quick-filter/plan-monitor-tab"]'),
        containerManagement: () => wrapper.find('[data-test="quick-filter/container-mgnt-tab"]'),
        ToolsPanelComponent: () => wrapper.findComponent(ToolsPanel),
        accordian: () => wrapper.find('[data-test="quick-filters/accordian"]'),
        accordianlist: () => wrapper.findAll('[data-test="quick-filters/accordian"]'),
        tabswitcher: () => wrapper.find('[data-test="quick-filters/tabswitcher"]'),
    };

    describe('Quick Filters', () => {
        beforeEach(() => {
            ({ store, quickFiltersList } = createStore());
            wrapper = render({
                localVue,
                store,
                propsData: { listViewType: 'fcl' },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('renders with quick filter button and performs click operation', async () => {
            const quickFiltersButton = wrapperFind.quickFiltersButton();
            expect(quickFiltersButton.exists()).toBeTruthy();

            await quickFiltersButton.trigger('click');
            await localVue.nextTick();

            const quickFiltersToolsPanel = wrapperFind.quickFiltersToolsPanel();
            expect(quickFiltersToolsPanel.exists()).toBeTruthy();
        });

        it('emits an event on click of the button', async () => {
            const saveButton = wrapperFind.quickFiltersButton();

            await saveButton.vm.$emit('click');
            await wrapper.vm.$nextTick();

            const event = wrapper.emitted('quickfilters-panel-active');
            expect(event).toHaveLength(1);
        });

        it('renders tools panel', async () => {
            const toolsPanelComponent = wrapperFind.ToolsPanelComponent();

            expect(toolsPanelComponent.exists()).toBeTruthy();
        });

        it('toggles filters tools panel when clicked on close icon', async () => {
            const toolsPanelComponent = wrapperFind.ToolsPanelComponent();
            toolsPanelComponent.vm.$emit('close-panel');

            expect(wrapper.vm.$data.toggleQuickFilterPanel).toBe(false);
        });

        it('renders with accordian', () => {
            const accordian = wrapperFind.accordian();

            expect(accordian.exists()).toBeTruthy();
        });

        it('renders with accordian list for plan tab', () => {
            const accordian = wrapperFind.accordianlist();
            expect(accordian).toHaveLength(4);
        });

        it('set the current tab index on change', async () => {
            const tabswitcher = wrapperFind.tabswitcher();
            await tabswitcher.trigger('change');
            wrapper.setData({
                currentTab: {
                    index: 1,
                },
            });

            expect(wrapper.vm.$data.currentTab.index).toBe(1);
        });

        it('clears all applied filters on click of reset button on filters tools panel', async () => {
            const toolsPanelComponent = wrapperFind.ToolsPanelComponent();
            toolsPanelComponent.vm.$emit('secondary-action');
            await wrapper.vm.$nextTick();
            toolsPanelComponent.vm.$emit('close-panel');

            expect(wrapper.vm.$data.toggleQuickFilterPanel).toBe(false);
        });
    });
});
