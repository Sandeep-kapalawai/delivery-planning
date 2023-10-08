import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import HeaderSection from './header-section.vue';
import { ListViewTypeEnum } from '@/static';
import { IRootState } from '@/store/interfaces';
import { DetailsGetterEnum } from '@/store/static';
import { IDetailsState } from '@/store/interfaces';
import DeliveryLocation from '@/components/details-view/components/delivery-location/delivery-location.vue';
import Priority from '@/components/details-view/components/priority/priority.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const TEST_DATE = '2022-02-01T00:00:00';
const TEST_TIME = '00:00';
const TEST_VALUES = {
    CONTAINER_TYPE: 'Test Container Type',
    PRIMARY_EXECUTIVE_STATUS: 'Test Primary Executive Status',
    SECONDARY_EXECUTIVE_STATUS: 'Test Secondary Excutive Status',
    SEAL_NUMBER: 'Test Seal Number',
    STATUS: 'Test Status',
    PRIORITY_LEVEL: 2,
    PRIORITY_DISPLAY_NAME: 'Test Priority',
    PROGRAM: 'Test Program',
    CONSIGNEE: 'Test Consignee',
    BE_CODE: 'BE Code',
    CARRIER: 'Test Carrier',
    SCAC: 'Test SCAC',
    VESSEL_VOYAGE: 'Test Vessel Voyage',
    PORT_OF_DISCHARGE_LOCATION: 'Test Port of Discharge Location',
    PORT_OF_DISCHARGE_COUNTRY: 'Test Port of Discharge Country',
    BL_NO: 'Test BL No',
    BL_TYPE: 'Test BL Type',
    SPECIAL_PROGRAM: 'Special Program',
    GAS_CHECK_DETAILS: {
        gasCheckRequired: true,
        gasCheckResult: 'PASS',
        gasCheckRequestedBy: 'PO',
        gasCheckRequestedDate: '10 Dec 2023',
    },
};
const TEST_FINAL_DELIVERY_LOCATIONS = [
    {
        FacilityCode: 'TEST1234_1',
        FacilityName: 'Paris',
        PostalAddress: { FullAddress: ' \\r\\nAddress Line 1\\r\\nAddress Line 2\\r\\nParis\\r\\nFrance' },
    },
    {
        FacilityCode: 'TEST1234_2',
        FacilityName: 'Los Angeles',
        PostalAddress: { FullAddress: ' \\r\\nAddress Line 1\\r\\nAddress Line 2\\r\\nParis\\r\\nFrance' },
    },
];

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(HeaderSection, {
        ...options,
        stubs: {
            TextField: true,
            UpdateDetails: true,
        },
    });

const createStore = ({ namespace }: { namespace: string }) => {
    const detailsModule: Module<IDetailsState<any>, IRootState> = {
        namespaced: true,
        state: {
            details: {
                isFetching: false,
                result: {
                    cargoStuffingType: TEST_VALUES.CONTAINER_TYPE,
                    primaryExecutiveStatus: TEST_VALUES.PRIMARY_EXECUTIVE_STATUS,
                    secondaryExecutiveStatus: TEST_VALUES.SECONDARY_EXECUTIVE_STATUS,
                    sealNumber: TEST_VALUES.SEAL_NUMBER,
                    shipmentStatus: TEST_VALUES.STATUS,
                    consigneeName: TEST_VALUES.CONSIGNEE,
                    consigneeBECode: TEST_VALUES.BE_CODE,
                    carrierName: TEST_VALUES.CARRIER,
                    carrierCode: TEST_VALUES.SCAC,
                    vesselVoyage: TEST_VALUES.VESSEL_VOYAGE,
                    portOfDischargeLocation: TEST_VALUES.PORT_OF_DISCHARGE_LOCATION,
                    portOfDischargeCountry: TEST_VALUES.PORT_OF_DISCHARGE_COUNTRY,
                    transportDocumentNumber: TEST_VALUES.BL_NO,
                    transportDocumentTypeCode: TEST_VALUES.BL_TYPE,
                    cargoStuffingPriority: {
                        level: TEST_VALUES.PRIORITY_LEVEL,
                        name: TEST_VALUES.PRIORITY_DISPLAY_NAME,
                        programName: TEST_VALUES.PROGRAM,
                        programGroupName: TEST_VALUES.PROGRAM,
                    },
                    specialProgram: { specialProgramName: TEST_VALUES.SPECIAL_PROGRAM },
                    predictiveEstimatedTimeOfArrivalDateTimeUTC: TEST_DATE,
                    estimatedTimeOfArrivalDateTimeLocal: TEST_DATE,
                    actualTimeOfArrivalDateTimeLocal: TEST_DATE,
                    estimatedTimeOfDischargeDateTimeLocal: TEST_DATE,
                    carrierReleasedDateTimeLocal: TEST_DATE,
                    customsClearedDateTimeUTC: TEST_DATE,
                    customerFinalPlaceOfDeliveryFacilityDetails: JSON.stringify(TEST_FINAL_DELIVERY_LOCATIONS),
                    gasCheckDetails: TEST_VALUES.GAS_CHECK_DETAILS,
                },
            },
        },
        getters: {
            [DetailsGetterEnum.GET_DETAILS](state) {
                return state.details;
            },
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [namespace]: detailsModule,
        },
    });

    return { store, detailsModule };
};

describe('header-section', () => {
    const MODULE_NAMESPACE = 'testDetails';
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;

    const wrapperFind = {
        textFieldComponents: () => wrapper.findAll('textfield-stub'),
        deliveryLocationComponents: () => wrapper.findAllComponents(DeliveryLocation),
        priorityComponent: () => wrapper.findComponent(Priority),
        updateDetailsButton: () => wrapper.find('[data-test="header-section/update-details-button"]'),
        updateDetailsPanel: () => wrapper.find('[data-test="header-section/update-details-panel"]'),
    };

    describe('default', () => {
        beforeEach(() => {
            ({ store } = createStore({ namespace: MODULE_NAMESPACE }));

            wrapper = render({
                localVue,
                store,
                propsData: {
                    viewType: ListViewTypeEnum.fcl,
                    viewModule: MODULE_NAMESPACE,
                    isSICancelled: false,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        describe('header fields', () => {
            const testCases = [
                { label: 'FIELD.CONTAINER_TYPE', value: TEST_VALUES.CONTAINER_TYPE },
                { label: 'FIELD.SEAL_NUMBER', value: TEST_VALUES.SEAL_NUMBER },
                { label: 'FIELD.SHIPMENT_STATUS', value: `${TEST_VALUES.PRIMARY_EXECUTIVE_STATUS} (${TEST_VALUES.SECONDARY_EXECUTIVE_STATUS})` },
                { label: 'FIELD.PRIORITY', value: undefined }, // tested separately - see below
                { label: 'FIELD.PROGRAM', value: TEST_VALUES.PROGRAM },
                { label: 'FIELD.GC_REQUIRED', value: 'GAS_CHECK_REQUIRED_OPTIONS.YES' },
                { label: 'FIELD.GC_RESULT', value: 'GAS_CHECK_RESULT_OPTIONS.PASS' },
                { label: 'FIELD.GC_REQUESTED_BY', value: TEST_VALUES.GAS_CHECK_DETAILS.gasCheckRequestedBy },
                { label: 'FIELD.GC_REQUESTED_DATE', value: TEST_VALUES.GAS_CHECK_DETAILS.gasCheckRequestedDate },
                { label: 'FIELD.CONSIGNEE/FIELD.BE_CODE', value: TEST_VALUES.CONSIGNEE, secondaryValue: TEST_VALUES.BE_CODE },
                { label: 'FIELD.CARRIER/FIELD.SCAC', value: TEST_VALUES.CARRIER, secondaryValue: TEST_VALUES.SCAC },
                { label: 'FIELD.VESSEL_VOYAGE', value: TEST_VALUES.VESSEL_VOYAGE },
                { label: 'FIELD.PORT_OF_DISCHARGE', value: TEST_VALUES.PORT_OF_DISCHARGE_LOCATION, secondaryValue: TEST_VALUES.PORT_OF_DISCHARGE_COUNTRY },
                { label: 'FIELD.BL_NO', value: TEST_VALUES.BL_NO },
                { label: 'FIELD.BL_TYPE', value: `DOCUMENT_TYPE.${TEST_VALUES.BL_TYPE}` },
                { label: 'FIELD.SPECIAL_PROGRAM', value: TEST_VALUES.SPECIAL_PROGRAM },
                { label: 'FIELD.PREDICTIVE_ETA', value: TEST_DATE, secondaryValue: TEST_TIME },
                { label: 'FIELD.ETA', value: TEST_DATE, secondaryValue: TEST_TIME },
                { label: 'FIELD.ATA', value: TEST_DATE, secondaryValue: TEST_TIME },
                { label: 'FIELD.ETD', value: TEST_DATE, secondaryValue: TEST_TIME },
                { label: 'FIELD.CARRIER_RELEASED', value: TEST_DATE, secondaryValue: TEST_TIME },
                { label: 'FIELD.CUSTOMS_CLEARED', value: TEST_DATE, secondaryValue: TEST_TIME },
                { label: 'FIELD.IN_DC_DATE', value: '-' },
                { label: 'FIELD.SERVICE_SCOPE', value: '-' },
            ].map((v, i: any) => [i, v.label, v.value]);

            it.each(testCases)('at index %d, renders %s with value %s', (index: number, expectedLabel: string, expectedValue: string) => {
                const textFieldComponents = wrapperFind.textFieldComponents();
                const textFieldComponent = textFieldComponents.at(index);

                expect(textFieldComponent.attributes('label')).toBe(expectedLabel);
                expect(textFieldComponent.attributes('value')).toBe(expectedValue);
            });

            it('renders the priority component with the right values', () => {
                const priorityComponent = wrapperFind.priorityComponent();

                expect(priorityComponent.exists()).toBeTruthy();
                expect(priorityComponent.props('level')).toBe(TEST_VALUES.PRIORITY_LEVEL);
                expect(priorityComponent.props('displayName')).toBe(TEST_VALUES.PRIORITY_DISPLAY_NAME);
            });
        });

        describe('final delivery locations', () => {
            const testCases = TEST_FINAL_DELIVERY_LOCATIONS.map((l, i: any) => [i, l.FacilityName, l.FacilityCode, l.PostalAddress['FullAddress']]);

            it.each(testCases)(
                'at index %d, renders the location %s, BE code %s, with the address lines %s',
                (index: number, expectedLabel: string, expectedBeCode: string, expectedAddressLines: string) => {
                    const components = wrapperFind.deliveryLocationComponents();
                    const component = components.at(index);

                    expect(component.props('label')).toBe(expectedLabel);
                    expect(component.props('beCode')).toBe(expectedBeCode);
                    expect(component.props('addressLines')).toEqual([expectedAddressLines.trim()]);
                },
            );
        });

        describe('update details', () => {
            it('renders the edit details button', () => {
                const button = wrapperFind.updateDetailsButton();

                expect(button.exists()).toBeTruthy();
            });

            it('renders the respective panel once the edit details button is clicked', async () => {
                const button = wrapperFind.updateDetailsButton();

                button.vm.$emit('click');
                await button.vm.$nextTick();
                await wrapper.vm.$nextTick();

                const panel = wrapperFind.updateDetailsPanel();
                expect(panel.exists()).toBeTruthy();
            });

            it('does not render the respective panel when the edit details button has not been clicked', () => {
                const panel = wrapperFind.updateDetailsPanel();

                expect(panel.exists()).toBeFalsy();
            });

            it('edit details wont be displayed when SI Cancelled', async () => {
                await wrapper.setProps({ isSICancelled: true });
                const button = wrapperFind.updateDetailsButton();

                expect(button.exists()).toBeFalsy();
            });
        });
    });
});
