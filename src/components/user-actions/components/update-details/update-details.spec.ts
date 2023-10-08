import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { merge } from 'lodash';
import UpdateDetails from './update-details.vue';
import Vuex, { Store, Module } from 'vuex';
import { ListActionEnum, ListGetterEnum } from '@/store/static';
import { IRootState } from '@/store/interfaces';
import { IFclListItem } from '@/interfaces';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { NAMESPACE as LCL_LIST_NAMESPACE } from '@/store/modules/lcl-list/static';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { ListViewTypeEnum } from '@/static';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(
        UpdateDetails,
        merge(
            {
                localVue,
                stubs: {
                    ValidationObserver,
                    ValidationProvider,
                },
            } as ThisTypedShallowMountOptions<Vue>,
            options,
        ),
    );

const createStore = ({ namespace }: { namespace: string }) => {
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
            selectedRows: new Map(),
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
    };

    const store = new Vuex.Store<any>({
        modules: {
            [FCL_LIST_NAMESPACE]: fclListModule,
            [LCL_LIST_NAMESPACE]: lclListModule,
        },
    });

    return { store, fclListModule, lclListModule };
};

const TEST_ROW_ID = 123;
const TEST_FINAL_DELIVERY_LOCATIONS = [
    { FacilityCode: 'TESTFC01', CityName: 'Test City 1', FullAddress: ['Address Line 1', 'Address Line 2', 'Address Line 3'] },
    { FacilityCode: 'TESTFC02', CityName: 'Test City 2', FullAddress: ['Address Line 1', 'Address Line 2'] },
];
const TEST_ROW = {
    cargoStuffingNumber: TEST_ROW_ID,
    customerFinalPlaceOfDeliveryFacilityCode: TEST_FINAL_DELIVERY_LOCATIONS.map((item) => item.FacilityCode).join(','),
    customerFinalPlaceOfDeliveryFacilityDetails: JSON.stringify(TEST_FINAL_DELIVERY_LOCATIONS),
};

describe('Update details ', () => {
    const LIST_MODULE_NAMESPACE = 'testList';
    let wrapper: Wrapper<Vue>;

    const { store } = createStore({ namespace: LIST_MODULE_NAMESPACE });

    const wrapperFind = {
        mcNotifications: () => wrapper.findAll('[data-test="update-details/error-notification"]'),
        warningMessageForUpdatingMultipleRows: () => wrapper.find('[data-test="update-details/mc-notification/warning-message-for-updating-multiple-rows"]'),
        pickupReferenceInput: () => wrapper.find('[data-test="update-details/field-pickupRef"]'),
        pickupReferenceExpiryInput: () => wrapper.find('[data-test="update-details/field-pickupRefExpiry"]'),
        emptyReturnReferenceInput: () => wrapper.find('[data-test="update-details/field-emptyReturnRef"]'),
        emptyReturnReferenceExpiryInput: () => wrapper.find('[data-test="update-details/field-emptyReturnExpiry"]'),
        program: () => wrapper.find('[data-test="update-details/field-program"]'),
        priority: () => wrapper.find('[data-test="update-details/field-priority"]'),
        specialProgram: () => wrapper.find('[data-test="update-details/field-specialProgram"]'),
        saveButton: () => wrapper.find('[data-test="update-details/save"]'),
        cancelButton: () => wrapper.find('[data-test="update-details/cancel"]'),
        editLocationDetailsArea: () => wrapper.find('[data-test="update-details/edit-location-details-area"]'),
        addFinalDeliveryLocationButton: () => wrapper.find('[data-test="update-details/add-final-delivery-location-button"]'),
        removeFinalDeliveryLocationButtons: () => wrapper.findAll('[data-test="update-details/remove-final-delivery-location-button"]'),
        locationPickers: () => wrapper.findAll('[data-test="update-details/location-picker"]'),
    };

    describe('default', () => {
        beforeEach(() => {
            wrapper = render({
                store,
                propsData: {
                    listViewType: ListViewTypeEnum.fcl,
                    selectedRows: new Map([[TEST_ROW_ID, TEST_ROW]]),
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('pickup reference input sets form.pickupReference on input event', () => {
            const pickupReferenceInput = wrapperFind.pickupReferenceInput();

            pickupReferenceInput.vm.$emit('input', { target: { value: 'test reference' } });

            expect(wrapper.vm.$data.form.pickupReference).toBe('test reference');
        });

        it('pickup reference expiry input sets form.pickupReferenceExpiryDateTimeUTC on input event', () => {
            const pickupReferenceExpiryInput = wrapperFind.pickupReferenceExpiryInput();

            pickupReferenceExpiryInput.vm.$emit('input', { target: { value: '01 Jan 2022' } });

            expect(wrapper.vm.$data.form.pickupReferenceExpiryDateTimeLocal).toBe('01 Jan 2022');
        });

        it('empty reference input sets form.emptyreturnref on input event', () => {
            const emptyReferenceInput = wrapperFind.emptyReturnReferenceInput();

            emptyReferenceInput.vm.$emit('input', { target: { value: 'test reference' } });

            expect(wrapper.vm.$data.form.emptyReturnReference).toBe('test reference');
        });

        it('field program sets form.program on change event', () => {
            const program = wrapperFind.program();

            program.vm.$emit('change', { detail: { selectedOptions: [{ label: 'TEST_ID', value: 'TEST_VALUE' }] } });

            expect(wrapper.vm.$data.form.program).toStrictEqual({
                label: 'TEST_ID',
                value: 'TEST_VALUE',
            });
        });

        it('field priority sets form.deliveryPriorityId on change event', () => {
            const program = wrapperFind.priority();

            program.vm.$emit('change', { detail: { selectedOptions: [{ value: 'TEST_VALUE', label: 'TEST_LABEL' }] } });

            expect(wrapper.vm.$data.form.deliveryPriorityId).toStrictEqual({ value: 'TEST_VALUE', label: 'TEST_LABEL', priorityLevel: 'TEST_VALUE' });
        });

        it('field special program sets form.specialProgramId on change event', () => {
            const program = wrapperFind.specialProgram();

            program.vm.$emit('change', { detail: { selectedOptions: [{ label: 'TEST_ID', value: 'TEST_VALUE' }] } });

            expect(wrapper.vm.$data.form.specialProgramId).toStrictEqual({ label: 'TEST_ID', value: 'TEST_VALUE' });
        });

        it('emits close event  on cancel button click', () => {
            const cancelButton = wrapperFind.cancelButton();

            cancelButton.vm.$emit('click');

            const event = wrapper.emitted('update-details-closed') as Array<any>;
            expect(event).toHaveLength(1);
        });

        describe('Final Delivery Locations', () => {
            const addLocationField = async () => {
                const addButton = wrapperFind.addFinalDeliveryLocationButton();
                addButton.vm.$emit('click');
                await addButton.vm.$nextTick();
                await wrapper.vm.$nextTick();
            };

            const removeLocationField = async (index: number) => {
                const removeButton = wrapperFind.removeFinalDeliveryLocationButtons().at(index);
                removeButton.vm.$emit('click');
                await removeButton.vm.$nextTick();
                await wrapper.vm.$nextTick();
            };

            it('adds a location field upon clicking the add button', async () => {
                const numFieldsBefore = wrapperFind.locationPickers().length;

                await addLocationField();

                const numFieldsAfter = wrapperFind.locationPickers().length;
                expect(numFieldsAfter).toEqual(numFieldsBefore + 1);
            });

            it('removes a location field upon clicking the remove button', async () => {
                await removeLocationField(0);

                const numFieldsAfter = wrapperFind.locationPickers().length;
                expect(numFieldsAfter).toEqual(TEST_FINAL_DELIVERY_LOCATIONS.length - 1);
            });

            it('shows the final delivery locations field when only one row has been selected', async () => {
                await wrapper.setProps({
                    selectedRows: new Map([[1, { cargoStuffingNumber: 1 }]]),
                });

                expect(wrapperFind.editLocationDetailsArea().exists()).toBeTruthy();
            });

            it('hides the final delivery locations field when multiple rows have been selected', async () => {
                await wrapper.setProps({
                    selectedRows: new Map([
                        [1, { cargoStuffingNumber: 1 }],
                        [2, { cargoStuffingNumber: 2 }],
                    ]),
                });

                expect(wrapperFind.editLocationDetailsArea().exists()).toBeFalsy();
            });
        });
    });

    describe('single row selected', () => {
        beforeEach(() => {
            wrapper = render({
                store,
                propsData: {
                    listViewType: ListViewTypeEnum.fcl,
                    selectedRows: new Map([
                        ['TEST_DELIVERY_PLAN_ID_1', { deliveryPlanId: 'TEST_DELIVERY_PLAN_ID_1', cargoStuffingNumber: 'TEST_CARGO_STUFFING_NUMBER_1' }],
                    ]),
                },
            });
        });

        it('does not show warning message for updating multiple rows', () => {
            expect(wrapperFind.warningMessageForUpdatingMultipleRows().exists()).toBeFalsy();
        });
    });

    describe('multiple rows selected', () => {
        beforeEach(() => {
            wrapper = render({
                store,
                propsData: {
                    listViewType: ListViewTypeEnum.fcl,
                    selectedRows: new Map([
                        ['TEST_DELIVERY_PLAN_ID_1', { deliveryPlanId: 'TEST_DELIVERY_PLAN_ID_1', cargoStuffingNumber: 'TEST_CARGO_STUFFING_NUMBER_1' }],
                        ['TEST_DELIVERY_PLAN_ID_2', { deliveryPlanId: 'TEST_DELIVERY_PLAN_ID_2', cargoStuffingNumber: 'TEST_CARGO_STUFFING_NUMBER_2' }],
                    ]),
                },
            });
        });

        it('shows warning message for updating multiple rows', () => {
            expect(wrapperFind.warningMessageForUpdatingMultipleRows().exists()).toBeTruthy();
        });
    });
});
