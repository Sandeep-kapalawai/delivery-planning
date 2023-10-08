import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { clone, merge } from 'lodash';
import DeliveryLegPickupSection from './delivery-leg-pickup-section.vue';
import { ServiceLegSpecialInstructionEnum } from '@/static';
import { ILocationFullAddress, IServiceLeg } from '@/interfaces';
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
        DeliveryLegPickupSection,
        merge(
            {
                stubs: {
                    ValidationObserver,
                    ValidationProvider,
                    TimeInput : true,
                },
            } as ThisTypedShallowMountOptions<Vue>,
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
            [DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_PICKUP_LOCATION]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_PICKUP_ON_DATE]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_PICKUP_FROM_TIME]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_SPECIAL_INSTRUCTION]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [DELIVERY_PLAN_NAMESPACE]: deliveryPlanModule,
        },
    });

    return { store, deliveryPlanModule };
};

describe('delivery-leg-pickup-section', () => {
    let leg: IServiceLeg;
    const legIndex: number = 1;
    let wrapper: Wrapper<Vue>;
    let store: Store<any>, deliveryPlanModule: any;

    const wrapperFind = {
        locationPickerComponent: () => wrapper.find(`[data-test="leg/${legIndex}/pickup/location/location-picker"]`),
        locationFieldComponent: () => wrapper.find(`[data-test="leg/${legIndex}/pickup/location/location-field"]`),
        pickupOnDateInput: () => wrapper.find(`[data-test="leg/${legIndex}/pickup/pickup-on-date"]`),
        pickupFromTimeInput: () => wrapper.find(`[data-test="leg/${legIndex}/pickup/pickup-from-time"]`),
        lastFreeDateTextField: () => wrapper.find(`[data-test="leg/${legIndex}/pickup/last-free-date"]`),
        expiryTextField: () => wrapper.find(`[data-test="leg/${legIndex}/pickup/expiry"]`),
        referenceTextField: () => wrapper.find(`[data-test="leg/${legIndex}/pickup/reference"]`),
        specialInstructionSwitch: () => wrapper.find(`[data-test="leg/${legIndex}/pickup/special-instruction"]`),
    };

    beforeEach(() => {
        leg = clone(MOCK_SERVICE_LEG);
        ({ store, deliveryPlanModule } = createStore());

        wrapper = render({
            localVue,
            store,
            stubs: {
                TextField: true,
            },
            propsData: {
                details: MOCK_CARGO_STUFFING_DETAILS,
                deliveryPlan: { response: MOCK_SERVICE_PLAN },
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

    it('triggers SET_PICKUP_LOCATION amd SET_PICKUP_TIMEZONE_AND_OFFSET mutation on change event', async () => {
        const value: Partial<ILocationFullAddress> = { facilityCode: 'TEST_FACILITY_CODE' };
        const locationPickerComponent = wrapperFind.locationPickerComponent();
        await locationPickerComponent.vm.$emit('change', value);

        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_LOCATION]).toHaveBeenCalledTimes(1);
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET]).toHaveBeenCalledWith(expect.any(Object), {
            leg,
            location: value,
        });

        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET]).toHaveBeenCalledTimes(1);
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET]).toHaveBeenCalledWith(expect.any(Object), {
            leg,
            location: value,
        });
    });

    it('renders location field', () => {
        const locationFieldComponent = wrapperFind.locationFieldComponent();

        expect(locationFieldComponent.exists()).toBeTruthy();
        expect(locationFieldComponent.props('name')).toBe(leg.pickupData.pickUpAddress.displayName);
        expect(locationFieldComponent.props('address')).toBe(leg.pickupData.pickUpAddress.displayText);
    });

    it('renders pickup on date field', () => {
        const pickupOnDateInput = wrapperFind.pickupOnDateInput();

        expect(pickupOnDateInput.exists()).toBeTruthy();
        expect((pickupOnDateInput.element as HTMLInputElement).value).toBe(leg.pickupData.pickupOnDate);
    });

    it('triggers SET_PICKUP_ON_DATE and SET_DELIVERY_TIMEZONE_AND_OFFSET mutations on pickup on date field input event', async () => {
        const value = '01-01-2023';
        const pickupOnDateInput = wrapperFind.pickupOnDateInput();
        await pickupOnDateInput.vm.$emit('input', { target: { value } });

        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_ON_DATE]).toHaveBeenCalledTimes(1);
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_ON_DATE]).toHaveBeenCalledWith(expect.any(Object), {
            leg,
            date: value,
        });

        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET]).toHaveBeenCalledTimes(1);
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET]).toHaveBeenCalledWith(expect.any(Object), {
            leg,
            date: value,
        });
    });

    it('renders pickup from time field', () => {
        const pickupFromTimeInput = wrapperFind.pickupFromTimeInput();

        expect(pickupFromTimeInput.exists()).toBeTruthy();
    });

    it('triggers SET_PICKUP_FROM_TIME mutation on pickup from time field input event', async () => {
        const value = '12:10';
        const pickupFromTimeInput = wrapperFind.pickupFromTimeInput();

        await pickupFromTimeInput.vm.$emit('change', { displayTime:value});
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_FROM_TIME]).toHaveBeenCalledTimes(1);
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_PICKUP_FROM_TIME]).toHaveBeenCalledWith(expect.any(Object), {
            leg,
            time: value,
        });
    });

    it('does not render last free data, expiry and pickup reference by default', () => {
        expect(wrapperFind.lastFreeDateTextField().exists()).toBeFalsy();
        expect(wrapperFind.expiryTextField().exists()).toBeFalsy();
        expect(wrapperFind.referenceTextField().exists()).toBeFalsy();
    });

    it('renders last free data, expiry and pickup reference when isFirstLeg prop is passed as true', async () => {
        await wrapper.setProps({
            isFirstLeg: true,
        });

        expect(wrapperFind.lastFreeDateTextField().exists()).toBeTruthy();
        expect(wrapperFind.expiryTextField().exists()).toBeTruthy();
        expect(wrapperFind.referenceTextField().exists()).toBeTruthy();
    });

    it('does not render special instruction field by default', () => {
        expect(wrapperFind.specialInstructionSwitch().exists()).toBeFalsy();
    });

    it('renders special instruction field when isFirstLeg prop is passed as true', async () => {
        await wrapper.setProps({
            isFirstLeg: true,
        });

        expect(wrapperFind.specialInstructionSwitch().exists()).toBeTruthy();
        expect(wrapperFind.specialInstructionSwitch().props('value')).toBe(leg.pickupData.specialInstruction);
    });

    it('triggers SET_SPECIAL_INSTRUCTION mutation on special instruction change event', async () => {
        await wrapper.setProps({
            isFirstLeg: true,
        });

        const value = ServiceLegSpecialInstructionEnum.NONE;
        const specialInstructionSwitch = wrapperFind.specialInstructionSwitch();
        await specialInstructionSwitch.vm.$emit('change', { value });

        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_SPECIAL_INSTRUCTION]).toHaveBeenCalledTimes(1);
        expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_SPECIAL_INSTRUCTION]).toHaveBeenCalledWith(expect.any(Object), {
            leg,
            specialInstruction: value,
        });
    });
});
