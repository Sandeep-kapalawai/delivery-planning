import Vuex, { Store } from 'vuex';
import VueRouter from 'vue-router';
import { createLocalVue, mount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { merge } from 'lodash';
import FilterContainer from './filter-container.vue';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { NAMESPACE as LCL_LIST_NAMESPACE } from '@/store/modules/lcl-list/static';
import { NAMESPACE as FILTER_NAMESPACE, FilterActionEnum, FilterGetterEnum } from '@/store/modules/filter/static';
import { Filters as SCMFilters } from '@scm-ui/filters';
import { ListViewTypeEnum } from '@/static';
import FilterBox from './components/filter-box/filter-box.vue';
import { ToolsPanel } from '@scm-ui/tools-panel';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    mount(
        FilterContainer,
        merge(
            {
                stubs: {
                    FilterBox: true,
                    QuickFilters: true,
                },
            } as ThisTypedShallowMountOptions<Vue>,
            options,
        ),
    );

const createStore = () => {
    const filterModule = {
        namespaced: true,
        state: {
            filters: {
                filtersArray: [
                    {
                        id: 'general',
                        title: 'General',
                        slotReference: 'general',
                        expanded: false,
                        fields: [
                            {
                                id: 'Consignee',
                            },
                            {
                                id: 'VesselName',
                            },
                        ],
                        indicator: 0,
                    },
                ],
                filtersMap: {},
                fieldMap: {},
            },
            appliedFilters: { Consignee: ['GBPRIMARKHQ', 'TEST_CONSIGNEE'] },
        },
        actions: {
            [FilterActionEnum.INITIALIZE_FILTERS]: jest.fn(),
            [FilterActionEnum.INITIALIZE_APPLIED_FILTERS]: jest.fn(),
            [FilterActionEnum.SET_APPLIED_FILTERS]: jest.fn(),
        },
        getters: {
            [FilterGetterEnum.GET_SECTIONS](state: any) {
                return state.filters.filtersArray;
            },
        },
    };

    const fclListModule = {
        namespaced: true,
        modules: {
            [FILTER_NAMESPACE]: filterModule,
        },
    };

    const lclListModule = {
        namespaced: true,
        modules: {
            [FILTER_NAMESPACE]: filterModule,
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [FCL_LIST_NAMESPACE]: fclListModule,
            [LCL_LIST_NAMESPACE]: lclListModule,
        },
    });

    return { store, fclListModule, lclListModule, filterModule };
};

describe('filter-container', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let filterModule: any;
    let router: VueRouter;

    const wrapperFind = {
        filterFieldComponents: () => wrapper.findAllComponents(FilterBox),
        filterFieldComponent: (index: number) => wrapperFind.filterFieldComponents().at(index),
        SCMFiltersComponent: () => wrapper.findComponent(SCMFilters),
        ToolsPanelComponent: () => wrapper.findComponent(ToolsPanel),
        AllFiltersButton: () => wrapper.find('[data-test="filter-container/all-filters/button"]'),
        SavedFiltersButton: () => wrapper.find('[data-test="filter-container/saved-filters/button"]'),
    };

    describe('default', () => {
        beforeEach(() => {
            ({ store } = createStore());
            router = new VueRouter({ routes: [] });

            wrapper = render({
                localVue,
                store,
                router,
                propsData: {
                    listViewType: ListViewTypeEnum.fcl,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('do not show filter tools panel by default', () => {
            expect(wrapper.vm.$data.isToolsPanelOpen).toBe(false);
        });
    });

    describe('All filters section', () => {
        beforeEach(async () => {
            ({ store, filterModule } = createStore());
            router = new VueRouter({ routes: [] });

            wrapper = render({
                localVue,
                store,
                router,
                propsData: {
                    listViewType: ListViewTypeEnum.fcl,
                },
            });

            const allFiltersButton = wrapperFind.AllFiltersButton();
            allFiltersButton.vm.$emit('click');
            await wrapper.vm.$nextTick();
        });

        it('initializes filter', () => {
            expect(filterModule.actions[FilterActionEnum.INITIALIZE_FILTERS]).toHaveBeenCalledTimes(1);
            expect(filterModule.actions[FilterActionEnum.INITIALIZE_APPLIED_FILTERS]).toHaveBeenCalledTimes(1);
        });

        it('removes individual applied filters when clicked on cross icon when multiple filters are applied', async () => {
            const scmFilterComponent = wrapperFind.SCMFiltersComponent();
            scmFilterComponent.vm.$emit(
                'remove-individual-tag',
                { sectionName: 'General', name: 'Consignee', label: 'Consignee', value: ['GBPRIMARKHQ'] },
                'GBPRIMARKHQ',
            );

            expect(wrapper.vm.$data['filterState']).toStrictEqual({ Consignee: ['TEST_CONSIGNEE'] });
        });

        it('removes appliedfilter when clicked on cross icon', async () => {
            const scmFilterComponent = wrapperFind.SCMFiltersComponent();
            scmFilterComponent.vm.$emit(
                'remove-individual-tag',
                { sectionName: 'General', name: 'Consignee', label: 'Consignee', value: ['GBPRIMARKHQ'] },
                'GBPRIMARKHQ',
            );

            expect(wrapper.vm.$data['filterState']).toStrictEqual({ Consignee: ['TEST_CONSIGNEE'] });
        });

        it('toggles filters tools panel when clicked on close icon', async () => {
            const toolsPanelComponent = wrapperFind.ToolsPanelComponent();
            toolsPanelComponent.vm.$emit('close-panel');
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.$data.isToolsPanelOpen).toBe(false);
        });

        it('sets applied filters on clicking apply filter from All filter tools panel', async () => {
            const toolsPanelComponent = wrapperFind.ToolsPanelComponent();
            toolsPanelComponent.vm.$emit('primary-action');
            await wrapper.vm.$nextTick();

            expect(filterModule.actions[FilterActionEnum.SET_APPLIED_FILTERS]).toHaveBeenCalledTimes(1);
        });

        it('clears all applied filters and non-applied filters on click of clear button on filters tools panel', async () => {
            const toolsPanelComponent = wrapperFind.ToolsPanelComponent();
            toolsPanelComponent.vm.$emit('secondary-action');
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.$data['filterState']).toStrictEqual({});
            expect(filterModule.actions[FilterActionEnum.SET_APPLIED_FILTERS]).toHaveBeenCalledTimes(1);
        });
    });
});
