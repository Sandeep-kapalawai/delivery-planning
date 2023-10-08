import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import Vuex, { Store, Module } from 'vuex';
import TransportPlans from './transport-plans.vue';
import { ListViewTypeEnum } from '@/static';
import {
    NAMESPACE as TABLE_CONFIGURATION_NAMESPACE,
    TableConfigurationActionEnum,
    TableConfigurationGetterEnum,
} from '@/store/modules/table-configuration/static';
import { IRootState } from '@/store/interfaces';
import { IState as ITableConfigurationState } from '@/store/modules/table-configuration/interfaces';
import { DeliveryOrdersActionEnum, DeliveryOrdersGetterEnum } from '@/store/modules/delivery-orders/static';
import { NAMESPACE as FCL_DO_NAMESPACE } from '@/store/modules/delivery-orders/static';
import { IDeliveryOrders, IReasonCodes } from '@/interfaces';
import { MOCK_DO_RESPONSE, MOCK_ORDER } from '@/mocks';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(TransportPlans, options);
localVue.use(Vuex);

const createStore = () => {
    const deliverOrders: Module<any, IRootState> = {
        namespaced: true,
        state: {
            deliveryOrders: {
                isFetching: false,
                transportPlansData: {
                    header: {
                        cargoStuffingNumber: 'CLRE2466595',
                        consigneeName: 'HUFFY CORPORATION',
                        consigneeBECode: 'USHUFFYHQ',
                        carrierName: 'MAERSK LINE',
                        carrierCode: 'MAEU',
                        equipmentNumber:'TEST_1',
                    },
                    items: [],
                    invalidItems: [{ cargoStuffingId: 123, cargoStuffingNumber: 'test' }],
                    notChangedItems: [],
                    missingFinalDeliveryLocations: [],
                } as IDeliveryOrders,
                errorMessage: '',
            },
            reasonCodes: {
                isFetching: false,
                errorMessage: '',
                result: [] as Array<IReasonCodes>,
            },
        },

        getters: {
            [DeliveryOrdersGetterEnum.GET_DELIVERY_ORDERS](state): { isFetching: boolean; errorMessage: string; transportPlansData: {} } {
                return state.deliveryOrders;
            },
            [DeliveryOrdersGetterEnum.GET_REASON_CODES](state): {
                isFetching: boolean;
                errorMessage: string;
                result: Array<IReasonCodes>;
            } {
                return state.reasonCodes;
            },
        },
        actions: {
            [DeliveryOrdersActionEnum.FETCH_DELIVERY_ORDERS]: jest.fn(),
            [DeliveryOrdersActionEnum.FETCH_REASON_CODES]: jest.fn(),
        },
    };
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
            [TableConfigurationGetterEnum.GET_TABLE_ID](state) {
                return state.tableId;
            },
            [TableConfigurationGetterEnum.GET_DEFAULT_COLUMN_DEF](state) {
                return state.defaultColDef;
            },
            [TableConfigurationGetterEnum.GET_COLUMN_DEFS](state) {
                return state.columnDefs;
            },
        },
        actions: {
            [TableConfigurationActionEnum.INITIALIZE]: jest.fn(),
        },
        modules: {
            [FCL_DO_NAMESPACE]: deliverOrders,
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [FCL_DO_NAMESPACE]: deliverOrders,
        },
    });
    return { store, tableConfigurationModule };
};
describe('transport-plans ', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let tableConfigurationModule: any;

    const wrapperFind = {
        accordian: () => wrapper.findAll('[data-spec="transport-plans/accordian"]'),
        newOrders: () => wrapper.find('[data-spec="transport-plans/new-orders"]'),
        revisedOrders: () => wrapper.find('[data-spec="transport-plans/revised-orders"]'),
        cancelledOrders: () => wrapper.find('[data-spec="transport-plans/cancelled-orders"]'),
    };

    beforeEach(() => {
        ({ store, tableConfigurationModule } = createStore());
        wrapper = render({
            localVue,
            store,
            propsData: {
                listViewModule: 'fclList',
                listViewType: ListViewTypeEnum.fcl,
                row: {
                    transportProviderName: 'STIGA HUFFY RMG PARTS SERVICE',
                    transportProviderCode: 'CASTIGA001HQ',
                    containersCount: 1,
                    newOrders: [MOCK_ORDER],
                    revisedOrders: [MOCK_ORDER],
                    cancelledOrders: [MOCK_ORDER],
                },
                transportPlans: MOCK_DO_RESPONSE.items,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders with new orders table by default', () => {
        expect(wrapperFind.newOrders().exists()).toBeTruthy();
        expect(wrapperFind.revisedOrders().exists()).toBeTruthy();
        expect(wrapperFind.cancelledOrders().exists()).toBeTruthy();
    });

    it('toggleAccordianitems delivery orders action on create', async () => {
        expect(wrapperFind.accordian().exists()).toBeTruthy();
    });
});
