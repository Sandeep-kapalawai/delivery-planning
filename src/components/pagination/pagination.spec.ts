import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { Pagination as SCMPagination } from '@scm-ui/pagination';
import Pagination from './pagination.vue';
import { NAMESPACE as TABLE_CONFIGURATION_NAMESPACE, TableConfigurationGetterEnum } from '@/store/modules/table-configuration/static';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum, PaginationActionEnum, getMainListPageSizeOptions } from '@/store/modules/pagination/static';
import { IRootState, IListState } from '@/store/interfaces';
import { ListGetterEnum } from '@/store/static';
import { IState as ITableConfigurationState } from '@/store/modules/table-configuration/interfaces';
import { IState as IPaginationState } from '@/store/modules/pagination/interfaces';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(Pagination, options);

const createStore = ({ namespace }: { namespace: string }) => {
    const tableConfiguration: Module<ITableConfigurationState, IRootState> = {
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
            [TableConfigurationGetterEnum.GET_TABLE_ID](state) {
                return state.tableId;
            },
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
            [PaginationGetterEnum.GET_PAGE_SIZE_OPTIONS](state) {
                return state.pageSizeOptions;
            },
            [PaginationGetterEnum.GET_LIMIT](state) {
                return state.limit;
            },
            [PaginationGetterEnum.GET_PAGE](state) {
                return state.page;
            },
        },
        actions: {
            [PaginationActionEnum.SET_PAGE]: jest.fn(),
            [PaginationActionEnum.SET_LIMIT]: jest.fn(),
        },
    };

    const listModule: Module<IListState<any>, IRootState> = {
        namespaced: true,
        state: {
            list: {
                isFetching: false,
                cancelToken: null,
                result: [],
                resultTotalCount: 1000,
            },
            selectedRows: new Map(),
        },
        getters: {
            [ListGetterEnum.GET_LIST](state) {
                return state.list;
            },
        },
        modules: {
            [TABLE_CONFIGURATION_NAMESPACE]: tableConfiguration,
            [PAGINATION_NAMESPACE]: paginationModule,
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [namespace]: listModule,
        },
    });

    return { store, listModule, paginationModule };
};

describe('pagination', () => {
    const LIST_MODULE_NAMESPACE = 'testList';
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let paginationModule: any;

    const wrapperFind = {
        paginationComponent: () => wrapper.findComponent(SCMPagination),
    };

    describe('default', () => {
        beforeEach(() => {
            ({ store, paginationModule } = createStore({ namespace: LIST_MODULE_NAMESPACE }));
            wrapper = render({
                localVue,
                store,
                propsData: {
                    listViewModule: LIST_MODULE_NAMESPACE,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('renders pagination component', () => {
            const paginationComponent = wrapperFind.paginationComponent();

            expect(paginationComponent.exists()).toBeTruthy();
        });

        it('displays total rows in the pagination component', () => {
            const paginationComponent = wrapperFind.paginationComponent();

            expect(paginationComponent.props('totalRows')).toBe(1000);
        });

        it('sets page on pagination update-current-page event', () => {
            const paginationComponent = wrapperFind.paginationComponent();

            paginationComponent.vm.$emit('update-current-page', 2);

            const setPageAction = paginationModule.actions[PaginationActionEnum.SET_PAGE];
            expect(setPageAction).toHaveBeenCalledTimes(1);
        });

        it('sets limit and page on pagination update-page-size event', () => {
            const paginationComponent = wrapperFind.paginationComponent();

            paginationComponent.vm.$emit('update-page-size', 100);

            const setLimitAction = paginationModule.actions[PaginationActionEnum.SET_LIMIT];
            const setPageAction = paginationModule.actions[PaginationActionEnum.SET_PAGE];
            expect(setLimitAction).toHaveBeenCalledTimes(1);
            expect(setPageAction).toHaveBeenCalledTimes(1);
        });
    });
});
