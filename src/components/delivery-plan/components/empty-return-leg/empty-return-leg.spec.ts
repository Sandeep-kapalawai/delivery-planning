import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import Vuex, { Store, Module } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { clone, merge } from 'lodash';
import EmptyReturnLeg from './empty-return-leg.vue';
import { IRootState } from '@/store/interfaces';
import { IState } from '@/store/modules/delivery-plan/interfaces';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanMutationEnum } from '@/store/modules/delivery-plan/static';
import { locationCache } from '@/store/modules/delivery-plan/utilities';
import { ServiceLegDeliveryTimeOptionEnum, ServiceLegStatusEnum, ServiceLegTypeEnum, PlanningStatusEnum } from '@/static';
import { ILocationFullAddress, IServiceLeg, IServicePlan } from '@/interfaces';
import { createMockCargoStuffingDetails, createMockServicePlan, createMockServiceLeg } from '@/mocks';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(
        EmptyReturnLeg,
        merge(
            {
                stubs: {
                    ValidationObserver,
                    ValidationProvider,
                    TextField: true,
                    TimeInput : true,
                },
            } as ThisTypedShallowMountOptions<Vue>,
            options,
        ),
    );

const createStore = () => {
    const deliveryPlanModule: Module<IState, IRootState> = {
        namespaced: true,
        mutations: {
            // Delivery
            [DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME]: jest.fn(),
            // Transport
            [DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]: jest.fn(),
            [DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [DELIVERY_PLAN_NAMESPACE]: deliveryPlanModule,
        },
    });

    return { store, deliveryPlanModule };
};

const MOCK_CARGO_STUFFING_DETAILS = createMockCargoStuffingDetails();
const MOCK_SERVICE_PLAN = createMockServicePlan({
    serviceLegs: [
        createMockServiceLeg({
            sequence: 101,
            serviceLegId: 1001,
            legType: ServiceLegTypeEnum.SERVICE_LEG,
            status: ServiceLegStatusEnum.CREATED,
            transportData: {
                provider: { providerName: 'TEST_PROVIDER_NAME_1', providerBECode: 'TEST_PROVIDER_BE_CODE_1' },
            } as any,
        }),
        createMockServiceLeg({
            sequence: 102,
            serviceLegId: 1002,
            legType: ServiceLegTypeEnum.SERVICE_LEG,
            status: ServiceLegStatusEnum.SENT,
            transportData: {
                provider: { providerName: 'TEST_PROVIDER_NAME_1', providerBECode: 'TEST_PROVIDER_BE_CODE_1' },
            } as any,
        }),
        createMockServiceLeg({
            sequence: 1000,
            serviceLegId: 1999,
            legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
            status: ServiceLegStatusEnum.CREATED,
            transportData: {
                provider: { providerName: 'TEST_PROVIDER_NAME_2', providerBECode: 'TEST_PROVIDER_BE_CODE_2' },
            } as any,
        }),
    ],
});
const MOCK_EMPTY_RETURN_LEG = MOCK_SERVICE_PLAN.serviceLegs.find((leg) => leg.legType === ServiceLegTypeEnum.EMPTY_RETURN_LEG) as IServiceLeg;
const MOCK_FIRST_ACTIVE_DELIVERY_LEG = MOCK_SERVICE_PLAN.serviceLegs.find((leg) => leg.legType === ServiceLegTypeEnum.SERVICE_LEG) as IServiceLeg;
const MOCK_LAST_ACTIVE_DELIVERY_LEG = MOCK_SERVICE_PLAN.serviceLegs.reverse().find((leg) => leg.legType === ServiceLegTypeEnum.SERVICE_LEG) as IServiceLeg;

describe('empty-return-leg', () => {
    let leg: IServiceLeg;
    let wrapper: Wrapper<Vue>;
    let store: Store<any>, deliveryPlanModule: any;

    const wrapperFind = {
        referenceTextField: () => wrapper.find('[data-test="empty-return-leg/empty-return/reference"]'),
        expiryTextField: () => wrapper.find('[data-test="empty-return-leg/empty-return/expiry"]'),
        locationSameAsCheckboxComponent: () => wrapper.find('[data-test="empty-return-leg/empty-return/location/same-as-checkbox"]'),
        locationPickerComponent: () => wrapper.find('[data-test="empty-return-leg/empty-return/location/location-picker"]'),
        locationFieldComponent: () => wrapper.find('[data-test="empty-return-leg/empty-return/location/location-field"]'),
        transportProviderSameAsCheckboxComponent: () => wrapper.find('[data-test="empty-return-leg/empty-return/provider/same-as-checkbox"]'),
        transportProviderPickerComponent: () => wrapper.find('[data-test="empty-return-leg/empty-return/provider/transport-provider-picker"]'),
        transportProviderFieldComponent: () => wrapper.find('[data-test="empty-return-leg/empty-return/provider/transport-provider-field"]'),
        collectionDateInput: () => wrapper.find('[data-test="empty-return-leg/empty-return/collection-date"]'),
        collectionTimeOptionSwitch: () => wrapper.find('[data-test="empty-return-leg/empty-return/collection-time-option"]'),
        collectionFromTimeInput: () => wrapper.find('[data-test="empty-return-leg/empty-return/collection-from-time"]'),
        collectionToTimeInput: () => wrapper.find('[data-test="empty-return-leg/empty-return/collection-to-time"]'),
        collectionTimeZoneInput: () => wrapper.find('[data-test="empty-return-leg/empty-return/collection-time-zone"]'),
        instructionInput: () => wrapper.find('[data-test="empty-return-leg/empty-return/instruction"]'),
    };

    beforeAll(() => {
        jest.spyOn(locationCache, 'getLocation').mockResolvedValue({
            facilityCode: 'DKCPH10B',
            timeZoneCode: 'CET',
            utcOffsetMinutes: 60,
            isDaylightSavingObserved: true,
            daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
            daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
            daylightSavingTimeZoneCode: 'CEST',
            daylightSavingUtcOffsetMinutes: 120,
        } as ILocationFullAddress);
    });

    beforeEach(() => {
        leg = clone(MOCK_EMPTY_RETURN_LEG);
        ({ store, deliveryPlanModule } = createStore());

        wrapper = render({
            localVue,
            store,
            propsData: {
                details: MOCK_CARGO_STUFFING_DETAILS,
                deliveryPlan: { response: MOCK_SERVICE_PLAN },
                leg,
                firstActiveLeg: MOCK_FIRST_ACTIVE_DELIVERY_LEG,
                lastActiveLeg: MOCK_LAST_ACTIVE_DELIVERY_LEG,
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('default', () => {
        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('renders empty return reference and expiry', () => {
            expect(wrapperFind.referenceTextField().exists()).toBeTruthy();
            expect(wrapperFind.expiryTextField().exists()).toBeTruthy();
        });

        it('renders collection date field', () => {
            const collectionDateInput = wrapperFind.collectionDateInput();

            expect(collectionDateInput.exists()).toBeTruthy();
            expect((collectionDateInput.element as HTMLInputElement).value).toBe(leg.deliveryData.deliveryOnDate);
        });

        it('triggers SET_DELIVERY_ON_DATE and SET_DELIVERY_TIMEZONE_AND_OFFSET mutations on collection date field input event', async () => {
            const value = '01-01-2023';
            const collectionDateInput = wrapperFind.collectionDateInput();
            await collectionDateInput.vm.$emit('input', { target: { value } });

            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE]).toHaveBeenCalledTimes(1);
            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE]).toHaveBeenCalledWith(
                {},
                {
                    leg,
                    date: value,
                },
            );

            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]).toHaveBeenCalledTimes(1);
            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]).toHaveBeenCalledWith(
                {},
                {
                    leg,
                    date: value,
                },
            );
        });

        it('renders collection time switch field', () => {
            const collectionTimeOptionSwitch = wrapperFind.collectionTimeOptionSwitch();

            expect(collectionTimeOptionSwitch.exists()).toBeTruthy();
            expect(collectionTimeOptionSwitch.props('value')).toBe(leg.deliveryData.deliveryTimeOption);
        });

        it('triggers SET_DELIVERY_TIME_OPTION mutation on collection time switch field input event', async () => {
            const value = ServiceLegDeliveryTimeOptionEnum.TIME_SLOT;
            const collectionTimeOptionSwitch = wrapperFind.collectionTimeOptionSwitch();
            await collectionTimeOptionSwitch.vm.$emit('change', { value });

            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION]).toHaveBeenCalledTimes(1);
            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION]).toHaveBeenCalledWith(
                {},
                {
                    leg,
                    deliveryTimeOption: value,
                },
            );
        });

        it('renders collection from time field', () => {
            const collectionFromTimeInput = wrapperFind.collectionFromTimeInput();

            expect(collectionFromTimeInput.exists()).toBeTruthy();
        });

        it('triggers SET_DELIVERY_FROM_TIME mutation on collection from time field input event', async () => {
            const value ='12:10';
            const collectionFromTimeInput = wrapperFind.collectionFromTimeInput();
            await collectionFromTimeInput.vm.$emit('change', {displayTime: value});
            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME]).toHaveBeenCalledTimes(1);
            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME]).toHaveBeenCalledWith(
                {},
                {
                    leg,
                    time:value,
                },
            );
        });

        it('does not render collection to time field', () => {
            const collectionToTimeInput = wrapperFind.collectionToTimeInput();

            expect(collectionToTimeInput.exists()).toBeFalsy();
        });

        it('renders collection to time field', async () => {
            leg.deliveryData.deliveryTimeOption = ServiceLegDeliveryTimeOptionEnum.TIME_SLOT;
            await wrapper.setProps({
                leg,
            });

            const collectionToTimeInput = wrapperFind.collectionToTimeInput();
            expect(collectionToTimeInput.exists()).toBeTruthy();
        });

        it('triggers SET_DELIVERY_TO_TIME mutation on collection to time field input event', async () => {
            const value ='10:10';
            leg.deliveryData.deliveryTimeOption = ServiceLegDeliveryTimeOptionEnum.TIME_SLOT;
            await wrapper.setProps({
                leg,
            });

            const collectionToTimeInput = wrapperFind.collectionToTimeInput();
            await collectionToTimeInput.vm.$emit('change', {displayTime:'10:10'});
            
            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME]).toHaveBeenCalledTimes(1);
            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME]).toHaveBeenCalledWith(
                {},
                {
                    leg,
                    time: value,
                },
            );
        });

        it('renders collection time zone field', () => {
            const collectionTimeZoneInput = wrapperFind.collectionTimeZoneInput();

            expect(collectionTimeZoneInput.exists()).toBeTruthy();
            expect(collectionTimeZoneInput.attributes('value')).toBe(leg.deliveryData.deliveryTimeZone);
        });

        it('renders instruction field', () => {
            const instructionInput = wrapperFind.instructionInput();

            expect(instructionInput.exists()).toBeTruthy();
            expect(instructionInput.attributes('value')).toBe(leg.transportData.additionalInstruction);
        });

        it('triggers SET_ADDITIONAL_INSTRUCTION mutation on instruction field input event', async () => {
            const value = 'TEST_VALUE';
            const instructionInput = wrapperFind.instructionInput();
            await instructionInput.vm.$emit('input', { target: { value } });

            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION]).toHaveBeenCalledTimes(1);
            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION]).toHaveBeenCalledWith(
                {},
                {
                    leg,
                    additionalInstruction: value,
                },
            );
        });
    });

    describe('empty return location', () => {
        it('renders same as pick-up location checkbox', () => {
            const locationSameAsCheckboxComponent = wrapperFind.locationSameAsCheckboxComponent();

            expect(locationSameAsCheckboxComponent.exists()).toBeTruthy();
        });

        it('does not trigger SET_DELIVERY_LOCATION and SET_DELIVERY_TIMEZONE_AND_OFFSET mutations on same as pick-up location checkbox change event as unchecked', async () => {
            const locationSameAsCheckboxComponent = wrapperFind.locationSameAsCheckboxComponent();
            await locationSameAsCheckboxComponent.vm.$emit('change', { target: { checked: false } });
            await locationSameAsCheckboxComponent.vm.$nextTick();

            expect(await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION]).toHaveBeenCalledTimes(0);
            expect(await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]).toHaveBeenCalledTimes(0);
        });

        it('triggers SET_DELIVERY_LOCATION and SET_DELIVERY_TIMEZONE_AND_OFFSET mutations on same as pick-up location checkbox change event as checked', async () => {
            const locationSameAsCheckboxComponent = wrapperFind.locationSameAsCheckboxComponent();
            await locationSameAsCheckboxComponent.vm.$emit('change', { target: { checked: true } });
            await locationSameAsCheckboxComponent.vm.$nextTick();

            expect(await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION]).toHaveBeenCalledTimes(1);
            expect(await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]).toHaveBeenCalledTimes(1);
        });

        it('renders empty return location picker', () => {
            const locationPickerComponent = wrapperFind.locationPickerComponent();

            expect(locationPickerComponent.exists()).toBeTruthy();
            expect(locationPickerComponent.props('value')).toBe(leg.pickupData.pickUpAddress.beCode);
        });

        it('triggers SET_DELIVERY_LOCATION and SET_DELIVERY_TIMEZONE_AND_OFFSET mutations on empty return location picker change event', async () => {
            const locationPickerComponent = wrapperFind.locationPickerComponent();
            await locationPickerComponent.vm.$emit('change');

            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION]).toHaveBeenCalledTimes(1);
            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]).toHaveBeenCalledTimes(1);
        });

        it('renders empty return location field', () => {
            const locationFieldComponent = wrapperFind.locationFieldComponent();

            expect(locationFieldComponent.exists()).toBeTruthy();
            expect(locationFieldComponent.props('name')).toBe(leg.pickupData.pickUpAddress.displayName);
            expect(locationFieldComponent.props('address')).toBe(leg.pickupData.pickUpAddress.displayText);
        });

        it.each([[PlanningStatusEnum.INITIAL], [PlanningStatusEnum.READY_TO_PLAN]])(
            'set empty return location from first leg on component create if planning status is %s',
            async (planningStatus: PlanningStatusEnum) => {
                jest.clearAllMocks();

                const deliveryPlan: { response: IServicePlan } = { response: clone(MOCK_SERVICE_PLAN) };
                deliveryPlan.response.planningStatus = planningStatus;

                leg = clone(MOCK_EMPTY_RETURN_LEG);
                wrapper = render({
                    localVue,
                    store,
                    propsData: {
                        details: MOCK_CARGO_STUFFING_DETAILS,
                        deliveryPlan,
                        leg,
                        firstActiveLeg: MOCK_FIRST_ACTIVE_DELIVERY_LEG,
                        lastActiveLeg: MOCK_LAST_ACTIVE_DELIVERY_LEG,
                    },
                });
                await wrapper.vm.$nextTick();

                expect(await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION]).toHaveBeenCalledTimes(1);
                expect(await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET]).toHaveBeenCalledTimes(1);
            },
        );
    });

    describe('empty return transport provider', () => {
        it('renders same as last leg provider checkbox', () => {
            const transportProviderSameAsCheckboxComponent = wrapperFind.transportProviderSameAsCheckboxComponent();

            expect(transportProviderSameAsCheckboxComponent.exists()).toBeTruthy();
        });

        it('does not trigger SET_TRANSPORT_PROVIDER mutation on same as pick-up location checkbox change event as unchecked', async () => {
            const transportProviderSameAsCheckboxComponent = wrapperFind.transportProviderSameAsCheckboxComponent();
            await transportProviderSameAsCheckboxComponent.vm.$emit('change', { target: { checked: false } });
            await transportProviderSameAsCheckboxComponent.vm.$nextTick();

            expect(await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]).toHaveBeenCalledTimes(0);
        });

        it('triggers SET_TRANSPORT_PROVIDER mutation on same as pick-up location checkbox change event as checked', async () => {
            const transportProviderSameAsCheckboxComponent = wrapperFind.transportProviderSameAsCheckboxComponent();
            await transportProviderSameAsCheckboxComponent.vm.$emit('change', { target: { checked: true } });
            await transportProviderSameAsCheckboxComponent.vm.$nextTick();

            expect(await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]).toHaveBeenCalledTimes(1);
        });

        it('renders empty return transport provider picker', () => {
            const transportProviderPickerComponent = wrapperFind.transportProviderPickerComponent();

            expect(transportProviderPickerComponent.exists()).toBeTruthy();
            expect(transportProviderPickerComponent.props('value')).toBe(leg.transportData.provider.providerBECode);
        });

        it('renders empty return transport provider picker as disabled when leg status is SENT', async () => {
            leg.status = ServiceLegStatusEnum.SENT;
            await wrapper.setProps({ leg });

            const transportProviderPickerComponent = wrapperFind.transportProviderPickerComponent();

            expect(transportProviderPickerComponent.exists()).toBeTruthy();
            expect(transportProviderPickerComponent.attributes('disabled')).toBe('true');
            expect(transportProviderPickerComponent.props('value')).toBe(leg.transportData.provider.providerBECode);
        });

        it('triggers SET_TRANSPORT_PROVIDER mutation on empty return transport provider picker change event', async () => {
            const transportProviderPickerComponent = wrapperFind.transportProviderPickerComponent();
            await transportProviderPickerComponent.vm.$emit('change');

            expect(deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]).toHaveBeenCalledTimes(1);
        });

        it('renders empty return transport provider field', () => {
            const transportProviderFieldComponent = wrapperFind.transportProviderFieldComponent();

            expect(transportProviderFieldComponent.exists()).toBeTruthy();
            expect(transportProviderFieldComponent.props('name')).toBe(leg.transportData.provider.providerName);
            expect(transportProviderFieldComponent.props('code')).toBe(leg.transportData.provider.providerBECode);
        });

        it.each([[PlanningStatusEnum.INITIAL], [PlanningStatusEnum.READY_TO_PLAN]])(
            'set empty return provider from last leg on component create if planning status is %s',
            async (planningStatus: PlanningStatusEnum) => {
                jest.clearAllMocks();

                const deliveryPlan: { response: IServicePlan } = { response: clone(MOCK_SERVICE_PLAN) };
                deliveryPlan.response.planningStatus = planningStatus;

                leg = clone(MOCK_EMPTY_RETURN_LEG);
                wrapper = render({
                    localVue,
                    store,
                    propsData: {
                        details: MOCK_CARGO_STUFFING_DETAILS,
                        deliveryPlan,
                        leg,
                        firstActiveLeg: MOCK_FIRST_ACTIVE_DELIVERY_LEG,
                        lastActiveLeg: MOCK_LAST_ACTIVE_DELIVERY_LEG,
                    },
                });
                await wrapper.vm.$nextTick();

                expect(await deliveryPlanModule.mutations[DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]).toHaveBeenCalledTimes(1);
            },
        );
    });
});
