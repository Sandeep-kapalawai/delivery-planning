import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { Table } from '@scm-ui/table';
import ListView from './list-view.vue';
import { ListGetterEnum, ListActionEnum } from '@/store/static';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import {
    NAMESPACE as TABLE_CONFIGURATION_NAMESPACE,
    TableConfigurationActionEnum,
    TableConfigurationGetterEnum,
} from '@/store/modules/table-configuration/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum, PaginationActionEnum, getMainListPageSizeOptions } from '@/store/modules/pagination/static';
import { NAMESPACE as SORTING_NAMESPACE, SortingActionEnum, SortingGetterEnum, SortingTypeEnum } from '@/store/modules/sorting/static';
import { NAMESPACE as FILTER_NAMESPACE, FilterActionEnum, FilterGetterEnum } from '@/store/modules/filter/static';
import { IRootState } from '@/store/interfaces';
import { IState as IFclListState } from '@/store/modules/fcl-list/interfaces';
import { IState as ITableConfigurationState } from '@/store/modules/table-configuration/interfaces';
import { IState as IPaginationState } from '@/store/modules/pagination/interfaces';
import { IState as ISortingState } from '@/store/modules/sorting/interfaces';
import { IState as IFilterState } from '@/store/modules/filter/interfaces';
import { ListViewTypeEnum } from '@/static';
import { ISavedFilterItem } from '@/interfaces';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(ListView, options);

const createStore = () => {
    const tableConfigurationModule: Module<ITableConfigurationState, IRootState> = {
        namespaced: true,
        state: {
            initialized: true,
            saveUserPreferencesEnabled: false,
            tableId: '',
            defaultColDef: {},
            originalColumnDefs: [],
            originalColumnDefsMap: new Map(),
            columnDefs: [],
            originalTheme: { spacing: 'default' },
            theme: { spacing: 'default' },
        },
        getters: {
            [TableConfigurationGetterEnum.GET_DEFAULT_COLUMN_DEF](state) {
                return state.defaultColDef;
            },
            [TableConfigurationGetterEnum.GET_COLUMN_DEFS](state) {
                return state.columnDefs;
            },
        },
        actions: {
            [TableConfigurationActionEnum.INITIALIZE]: jest.fn(),
            [TableConfigurationActionEnum.REARRANGE_COLUMN_DEFS]: jest.fn(),
        },
    };

    const paginationModule: Module<IPaginationState, IRootState> = {
        namespaced: true,
        state: {
            pageSizeOptions: getMainListPageSizeOptions(),
            limit: 10,
            page: 1,
        },
        getters: {
            [PaginationGetterEnum.GET_PAGINATION](state) {
                return { limit: state.limit, page: state.page };
            },
        },
        actions: {
            [PaginationActionEnum.SET_PAGE]: jest.fn(),
        },
    };

    const filterModule: Module<IFilterState, IRootState> = {
        namespaced: true,
        state: {
            filters: { filtersArray: [], filtersMap: {}, fieldMap: {} },
            appliedFilters: {},
            resolvedAppliedFilters: {},
            savedFilters: { isFetching: false, list: [], errorMessage: [], appliedFilter: {} as ISavedFilterItem },
            isInitialized: false,
        },
        getters: {
            [FilterGetterEnum.GET_APPLIED_FILTERS](state) {
                return state.appliedFilters;
            },
        },
        actions: {
            [FilterActionEnum.FETCH_SAVED_FILTERS]: jest.fn(),
        },
    };

    const sortingModule: Module<ISortingState, IRootState> = {
        namespaced: true,
        state: {
            field: 'estimatedTimeOfArrivalDateTimeLocal',
            direction: SortingTypeEnum.asc,
        },
        getters: {
            [SortingGetterEnum.GET_SORT](state) {
                return `${state.field}:${state.direction}`;
            },
        },
        actions: {
            [SortingActionEnum.INITIALIZE]: jest.fn(),
            [SortingActionEnum.SET_SORT]: jest.fn(),
        },
    };

    const fclListModule: Module<IFclListState, IRootState> = {
        namespaced: true,
        state: {
            list: {
                isFetching: false,
                cancelToken: null,
                result: [],
                resultTotalCount: 0,
            },
            importExportAnExcel: {
                isExporting: false,
                isImporting: false,
                isFileImported: false,
            },
            selectedRows: new Map(),
        },
        getters: {
            [ListGetterEnum.GET_LIST](state) {
                return state.list;
            },
        },
        actions: {
            [ListActionEnum.FETCH_LIST]: jest.fn(),
            [ListActionEnum.CLEAR_SELECTED_ROWS]: jest.fn(),
        },
        modules: {
            [TABLE_CONFIGURATION_NAMESPACE]: tableConfigurationModule,
            [PAGINATION_NAMESPACE]: paginationModule,
            [SORTING_NAMESPACE]: sortingModule,
            [FILTER_NAMESPACE]: filterModule,
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [FCL_LIST_NAMESPACE]: fclListModule,
        },
    });

    return { store, fclListModule, paginationModule, sortingModule, filterModule };
};

describe('list-view', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let fclListModule: any, paginationModule: any, sortingModule: any, filterModule: any;

    const wrapperFind = {
        tableComponent: () => wrapper.findComponent(Table),
        rowActions: () => wrapper.find('[data-test="list-view/row-actions"]'),
        notification: () => wrapper.find('[data-test="list-view/success-notification"]'),
    };

    beforeEach(() => {
        ({ store, fclListModule, paginationModule, sortingModule, filterModule } = createStore());
        wrapper = render({
            localVue,
            store,
            propsData: {
                listViewType: ListViewTypeEnum.fcl,
                listViewModule: FCL_LIST_NAMESPACE,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('fetches list on component created', () => {
        expect(fclListModule.actions[ListActionEnum.FETCH_LIST]).toHaveBeenCalledTimes(1);
    });

    it('fetches list on applied pagination change', async () => {
        store.state[FCL_LIST_NAMESPACE][PAGINATION_NAMESPACE].page = 2;
        await localVue.nextTick();

        expect(fclListModule.actions[ListActionEnum.FETCH_LIST]).toHaveBeenCalledTimes(2);
    });

    it('resets page number and fetches list on applied sort change', async () => {
        store.state[FCL_LIST_NAMESPACE][SORTING_NAMESPACE].direction = SortingTypeEnum.desc;
        await localVue.nextTick();

        expect(paginationModule.actions[PaginationActionEnum.SET_PAGE]).toHaveBeenCalledTimes(1);
        expect(fclListModule.actions[ListActionEnum.FETCH_LIST]).toHaveBeenCalledTimes(2);
    });

    it('renders table component', () => {
        const tableComponent = wrapperFind.tableComponent();

        expect(tableComponent.exists()).toBeTruthy();
        expect(tableComponent.props('defaultColDef')).toBeDefined();
        expect(tableComponent.props('columnDefs')).toBeDefined();
        expect(tableComponent.props('rowData')).toBeDefined();
    });

    it('sets sort on table sort-order-changed event', () => {
        const tableComponent = wrapperFind.tableComponent();

        tableComponent.vm.$emit('sort-order-changed', 'asc', 'TEST_COLUMN');

        const action = sortingModule.actions[SortingActionEnum.SET_SORT];
        expect(action).toHaveBeenCalledTimes(1);
    });

    it('clears selected rows on component destroy', () => {
        wrapper.destroy();

        const action = fclListModule.actions[ListActionEnum.CLEAR_SELECTED_ROWS];
        expect(action).toHaveBeenCalledTimes(1);
    });
});
