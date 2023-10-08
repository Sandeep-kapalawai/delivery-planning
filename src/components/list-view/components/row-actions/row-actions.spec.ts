import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import RowActions from './row-actions.vue';
import Vuex, { Store, Module } from 'vuex';
import { IState as IPaginationState } from '@/store/modules/pagination/interfaces';
import { NAMESPACE as PAGINATION_NAMESPACE, PaginationGetterEnum, PaginationActionEnum } from '@/store/modules/pagination/static';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { NAMESPACE as LCL_LIST_NAMESPACE } from '@/store/modules/lcl-list/static';

import { IRootState } from '@/store/interfaces';
import { ListActionEnum, ListGetterEnum } from '@/store/static';
import { getMainListPageSizeOptions } from '@/store/modules/pagination/static';
import { IFclListItem } from '@/interfaces';
import { ListViewTypeEnum } from '@/static';

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(RowActions, options);

const createStore = () => {
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
            [PaginationGetterEnum.GET_PAGE_SIZE_OPTIONS](state) {
                return state.pageSizeOptions;
            },
            [PaginationGetterEnum.GET_LIMIT](state): number {
                return state.limit;
            },
            [PaginationGetterEnum.GET_PAGE](state): number {
                return state.page;
            },
        },
        actions: {
            [PaginationActionEnum.SET_PAGE]: jest.fn(),
        },
    };

    const fclListModule: Module<any, IRootState> = {
        namespaced: true,
        state: {
            list: {
                isFetching: false,
                cancelToken: null,
                errorMessage: '',
                result: [],
                resultTotalCount: 0,
            },
            selectedRows: new Map([
                ['TEST_KEY1', 'TEST_VALUE1'],
                ['TEST_KEY2', 'TEST_VALUE2'],
                ['TEST_KEY3', 'TEST_VALUE3'],
            ]),
        },
        actions: {
            [ListActionEnum.FETCH_LIST]: jest.fn(),

            [ListActionEnum.CLEAR_SELECTED_ROWS]: jest.fn(),
        },
        modules: {
            [PAGINATION_NAMESPACE]: paginationModule,
        },
        getters: {
            [ListGetterEnum.GET_SELECTED_ROWS](state) {
                return state.selectedRows;
            },
            [ListGetterEnum.GET_LIST](state): {
                isFetching: boolean;
                result: Array<IFclListItem>;
                resultTotalCount: number;
            } {
                return state.list;
            },
        },
    };

    const lclListModule: Module<any, IRootState> = {
        namespaced: true,
        actions: {
            [ListActionEnum.FETCH_LIST]: jest.fn(),
            [ListActionEnum.CLEAR_SELECTED_ROWS]: jest.fn(),
        },
        modules: {
            [PAGINATION_NAMESPACE]: paginationModule,
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [FCL_LIST_NAMESPACE]: fclListModule,
            [LCL_LIST_NAMESPACE]: lclListModule,
        },
    });

    return { store, fclListModule, lclListModule, paginationModule };
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Table Row Actions', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;

    const wrapperFind = {
        PaginationComponent: () => wrapper.find('[data-test^="row-actions/pagination"]'),
        UpdateDetailsComponent: () => wrapper.find('[data-test^="row-actions/update-details"]'),
        TableTitleBar: () => wrapper.find('[data-test^="row-actions/table-title-bar"]'),
    };

    beforeEach(() => {
        ({ store } = createStore());

        wrapper = render({
            localVue,
            store,
            propsData: {
                listViewModule: 'fclList',
                listViewType: ListViewTypeEnum.fcl,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders with table title bar component by default', async () => {
        expect(wrapperFind.TableTitleBar().exists()).toBeTruthy();
    });

    it('renders with table title bar component when selected rows is available', async () => {
        expect(wrapperFind.TableTitleBar().props('bulkActions')).toHaveLength(2);
        expect(wrapperFind.TableTitleBar().props('bulkActions')[0].label).toBe('FIELD.UPDATE_DETAILS');
        expect(wrapperFind.TableTitleBar().props('bulkActions')[1].label).toBe('EXPORT_EXCEL.EXPORT');
    });

    it('doesnt renders update details component when showdetails is false', async () => {
        await wrapper.setData({ showUpdateDetails: false });

        expect(wrapperFind.UpdateDetailsComponent().exists()).toBeFalsy();
    });

    it('update details component renders when showdetails is true', async () => {
        await wrapper.setData({ showUpdateDetails: true });

        expect(wrapperFind.UpdateDetailsComponent().exists()).toBeTruthy();
    });

    it('listens to an emitted event - update-details-closed and closes the update details component', () => {
        wrapper.vm.$emit('update-details-closed');

        expect(wrapperFind.UpdateDetailsComponent().exists()).toBeFalsy();
        expect(wrapper.vm.$data.showUpdateDetails).toBe(false);
    });
});
