import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import Vuex, { Store, Module } from 'vuex';
import SendPlan from './send-plan.vue';
import TransportPlans from './components/transport-plans/transport-plans.vue';
import { ListViewTypeEnum } from '@/static';
import { IReasonCodes } from '@/interfaces';
import { IRootState } from '@/store/interfaces';
import { NAMESPACE as DELIVERY_ORDERS_NAMESPACE, DeliveryOrdersActionEnum, DeliveryOrdersGetterEnum } from '@/store/modules/delivery-orders/static';
import { MOCK_DO_RESPONSE, MOCK_REASON_CODES } from '@/mocks';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(SendPlan, options);

const createStore = () => {
    const deliveryOrdersModule: Module<any, IRootState> = {
        namespaced: true,
        state: {
            deliveryOrders: {
                isFetching: false,
                transportPlansData: MOCK_DO_RESPONSE,
                errorMessage: '',
            },
            reasonCodes: {
                isFetching: false,
                errorMessage: '',
                result: MOCK_REASON_CODES as Array<IReasonCodes>,
            },
            sendDeliveryOrdersResult: {
                isFetching: false,
                errorMessage: '',
                result: {},
            },
        },

        getters: {
            [DeliveryOrdersGetterEnum.GET_DELIVERY_ORDERS](state) {
                return state.deliveryOrders;
            },
            [DeliveryOrdersGetterEnum.GET_REASON_CODES](state): {
                isFetching: boolean;
                errorMessage: string;
                result: Array<IReasonCodes>;
            } {
                return state.reasonCodes;
            },
            [DeliveryOrdersGetterEnum.GET_DELIVERY_ORDER_RESULT](state) {
                return state.sendDeliveryOrdersResult;
            },
        },
        actions: {
            [DeliveryOrdersActionEnum.FETCH_DELIVERY_ORDERS]: jest.fn(),
            [DeliveryOrdersActionEnum.FETCH_REASON_CODES]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [DELIVERY_ORDERS_NAMESPACE]: deliveryOrdersModule,
        },
    });

    return { store, deliveryOrdersModule };
};

localVue.use(Vuex);

describe('Send Plan ', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let deliveryOrdersModule: any;

    const wrapperFind = {
        errNotification: () => wrapper.find('[data-spec="send-plan/error-notification"]'),
        displayinvalidNotification: () => wrapper.find('[data-spec="invalidPlansMessage-notification"]'),
        missingFDLNotification: () => wrapper.find('[data-spec="send-plan/missingFDL-notification"]'),
        notChangedNotification: () => wrapper.find('[data-spec="send-plan/notChanged-notification"]'),
        headerSection: () => wrapper.find('[data-spec="send-plan/header-section"]'),
        transportPlansTable: () => wrapper.findComponent(TransportPlans),
        closeButton: () => wrapper.find('[data-spec="send-plan/close-button"]'),
        sendButton: () => wrapper.find('[data-spec="send-plan/send-button"]'),
        editPlanWrapper: () => wrapper.find('[data-spec="send-plan/edit-plan"]'),
    };

    beforeEach(() => {
        ({ store, deliveryOrdersModule } = createStore());

        wrapper = render({
            localVue,
            store,
            propsData: {
                listViewModule: 'fclList',
                listViewType: ListViewTypeEnum.fcl,
                selectedRows: new Map([
                    [1001, { cargoStuffingNumber: 1001 }],
                    [1002, { cargoStuffingNumber: 1002 }],
                ]),
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('initializes delivery orders action on create', () => {
        expect(deliveryOrdersModule.actions[DeliveryOrdersActionEnum.FETCH_DELIVERY_ORDERS]).toHaveBeenCalledTimes(1);
    });

    it('header section will not render when selected items is more than one', () => {
        expect(wrapperFind.headerSection().exists()).toBeFalsy();
    });

    it('cancel buttons emits close event', async () => {
        wrapperFind.closeButton().vm.$emit('click');
        await wrapper.vm.$nextTick();
        const event = wrapper.emitted('send-do-closed') as Array<any>;
        expect(event).toHaveLength(1);
        expect(event[0]).toStrictEqual([]);
    });

    it('Save buttons emits close event', async () => {
        wrapperFind.sendButton().vm.$emit('click');
        await wrapper.vm.$nextTick();
        const event = wrapper.emitted('send-do') as Array<any>;
        expect(event).toHaveLength(1);
        expect(event[0]).toStrictEqual([]);
    });

    it('does not render not changed notification by default', async () => {
        const notChangedNotification = wrapperFind.notChangedNotification();
        expect(notChangedNotification.exists()).toBeFalsy();
    });

    it('renders not changed notification with equipment numbers', async () => {
        store.state[DELIVERY_ORDERS_NAMESPACE].deliveryOrders.transportPlansData = {
            notChangedItems: [
                {
                    equipmentNumber: 'NOT_CHANGED_CARGO_STUFFING_NUMBER_1',
                },
                {
                    equipmentNumber: 'NOT_CHANGED_CARGO_STUFFING_NUMBER_2',
                },
            ],
        };
        await localVue.nextTick();

        const notChangedNotification = wrapperFind.notChangedNotification();
        expect(notChangedNotification.exists()).toBeTruthy();
        expect(notChangedNotification.text()).toBe('MESSAGE.NOT_CHANGEDITEMS_FCLNOT_CHANGED_CARGO_STUFFING_NUMBER_1,NOT_CHANGED_CARGO_STUFFING_NUMBER_2');
    });

    it('renders missingFinalDeliveryLocations notification', async () => {
        store.state[DELIVERY_ORDERS_NAMESPACE].deliveryOrders.transportPlansData = {
            missingFinalDeliveryLocations: [
                {
                    cargoStuffingId: 533,
                    equipmentNumber:'TEST_1',
                    missingFinalDeliveryLocations:
                        'Equipment#: RAJEQ_J06, FinalDeliveryLocations: USDI2ATI-Delhi, AEDXB!!1-Dubai, AEDXB!!1-Dubai, AEDXB!!1-Dubai',
                },
            ],
        };
        await localVue.nextTick();

        const missingFinalDeliveryLocations = wrapperFind.missingFDLNotification();
        expect(missingFinalDeliveryLocations.exists()).toBeTruthy();
        expect(missingFinalDeliveryLocations.text().replace(/\s+/g, ' ')).toBe(
            //remove whitespaces from the result if any
            'MESSAGE.MISSING_FDL FIELD.EQUIPMENT(S) : Equipment#: RAJEQ_J06, FinalDeliveryLocations: USDI2ATI-Delhi, AEDXB!!1-Dubai, AEDXB!!1-Dubai, AEDXB!!1-Dubai, MESSAGE.DO_YOU_WANT_TO_UPDATE',
        );
    });

    it('renders with transport plan table when there are items in delivery order', async () => {
        expect(wrapperFind.transportPlansTable().exists()).toBeTruthy();
        expect(wrapperFind.transportPlansTable().props().transportPlans).toBe(MOCK_DO_RESPONSE.items);
    });
});
