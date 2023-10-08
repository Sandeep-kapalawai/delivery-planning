import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { clone, merge } from 'lodash';
import DeliveryLegDeliverySection from './delivery-leg-delivery-section.vue';
import { IServiceLeg } from '@/interfaces';
import { IRootState } from '@/store/interfaces';
import { IState } from '@/store/modules/delivery-plan/interfaces';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanMutationEnum } from '@/store/modules/delivery-plan/static';
import { createMockCargoStuffingDetails, createMockServicePlan } from '@/mocks';

const localVue = createLocalVue();
localVue.use(Vuex);

const MOCK_CARGO_STUFFING_DETAILS = createMockCargoStuffingDetails();
const MOCK_SERVICE_PLAN = createMockServicePlan();
const MOCK_SERVICE_LEG = MOCK_SERVICE_PLAN.serviceLegs[0];

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(
        DeliveryLegDeliverySection,
        merge(
            {
                stubs: {
                    ValidationObserver,
                    ValidationProvider,
                },
            },
            options,
        ),
    );

const createStore = () => {
    const deliveryPlanModule: Module<Partial<IState>, IRootState> = {
        namespaced: true,
        state: {
            deliveryPlan: {
                isFetching: false,
                isSaving: false,
                isSending: false,
                response: MOCK_SERVICE_PLAN,
            },
        },
        mutations: {
            [DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_REFERENCE]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_TYPE]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [DELIVERY_PLAN_NAMESPACE]: deliveryPlanModule,
        },
    });

    return { store, deliveryPlanModule };
};

describe('delivery-leg-delivery-section', () => {
    let leg: IServiceLeg;
    const legIndex: number = 1;
    let wrapper: Wrapper<Vue>;
    let store: Store<any>, deliveryPlanModule: any;

    const wrapperFind = {
        locationPickerComponent: () => wrapper.find(`[data-test="leg/${legIndex}/delivery/location/location-picker"]`),
        locationFieldComponent: () => wrapper.find(`[data-test="leg/${legIndex}/delivery/location/location-field"]`),
    };

    beforeEach(() => {
        leg = clone(MOCK_SERVICE_LEG);
        ({ store, deliveryPlanModule } = createStore());

        wrapper = render({
            localVue,
            store,
            propsData: {
                details: MOCK_CARGO_STUFFING_DETAILS,
                leg,
                legIndex,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders location picker', () => {
        const locationPickerComponent = wrapperFind.locationPickerComponent();

        expect(locationPickerComponent.exists()).toBeTruthy();
        expect(locationPickerComponent.props('value')).toBe(leg.pickupData.pickUpAddress.beCode);
    });

    it('triggers SET_DELIVERY_LOCATION mutation on change event', async () => {
        const locationPickerComponent = wrapperFind.locationPickerComponent();
        await locationPickerComponent.vm.$emit('change');

        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION]).toHaveBeenCalledTimes(1);
    });

    it('renders location field', () => {
        const locationFieldComponent = wrapperFind.locationFieldComponent();

        expect(locationFieldComponent.exists()).toBeTruthy();
        expect(locationFieldComponent.props('name')).toBe(leg.pickupData.pickUpAddress.displayName);
        expect(locationFieldComponent.props('address')).toBe(leg.pickupData.pickUpAddress.displayText);
    });
});
