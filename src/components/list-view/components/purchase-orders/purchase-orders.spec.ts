import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import PurchaseOrderList from './purchase-orders.vue';
import { IRootState } from '@/store/interfaces';
import { NAMESPACE as PO_LISTNAMESPACE } from '../../../../store/modules/purchase-orders/static';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { IState as IPOListState } from '@/store/modules/purchase-orders/interfaces';
import { IState as ITableConfigurationState } from '@/store/modules/table-configuration/interfaces';
import {
    NAMESPACE as TABLE_CONFIGURATION_NAMESPACE,
    TableConfigurationActionEnum,
    TableConfigurationGetterEnum,
} from '@/store/modules/table-configuration/static';
import Vuex, { Store, Module } from 'vuex';
import { ListViewTypeEnum } from '@/static';
import { ListActionEnum, ListGetterEnum } from '@/store/static';

const localVue = createLocalVue();
localVue.use(Vuex);
const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(PurchaseOrderList, options);

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

    const purchaseOrdersList: Module<IPOListState, IRootState> = {
        namespaced: true,
        state: {
            list: {
                isFetching: false,
                cancelToken: null,
                poskUs: [],
                stockKeepingUnitDataSummary: undefined,
            },
        },
        getters: {
            [ListGetterEnum.GET_LIST](state) {
                return state.list;
            },
        },
        actions: {
            [ListActionEnum.FETCH_LIST]: jest.fn(),
        },
        modules: {
            [TABLE_CONFIGURATION_NAMESPACE]: tableConfigurationModule,
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [PO_LISTNAMESPACE]: purchaseOrdersList,
        },
    });
    return { store, purchaseOrdersList, tableConfigurationModule };
};

describe('purchase orders list', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let purchaseOrdersList: any, tableConfigurationModule: any;

    describe('default', () => {
        beforeEach(() => {
            ({ store, purchaseOrdersList, tableConfigurationModule } = createStore());
            wrapper = render({
                localVue,
                store,
                propsData: {
                    selectedRow: {
                        cargoStuffingId: 674,
                    },
                    listViewType: ListViewTypeEnum.fcl,
                    listViewModule: FCL_LIST_NAMESPACE,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('renders PO Table', () => {
            expect(wrapper.findComponent(PurchaseOrderList)).toBeTruthy();
        });

        it('initializes table configuration and fetches list on component created', () => {
            expect(tableConfigurationModule.actions[TableConfigurationActionEnum.INITIALIZE]).toHaveBeenCalledTimes(1);
            expect(purchaseOrdersList.actions[ListActionEnum.FETCH_LIST]).toHaveBeenCalledTimes(1);
        });
    });
});
