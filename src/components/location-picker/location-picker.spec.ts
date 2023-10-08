import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { ValidationProvider } from 'vee-validate';
import { merge } from 'lodash';
import LocationPicker from './location-picker.vue';
import api from '@/data/api';
import { ILocationFullAddress } from '@/interfaces';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(
        LocationPicker,
        merge(
            {
                directives: {
                    ['click-outside']: jest.fn(),
                },
                stubs: {
                    ValidationProvider,
                },
            } as ThisTypedShallowMountOptions<Vue>,
            options,
        ),
    );

const FIELD_ID = 'TEST_ID';
const FIELD_VALUE = 'TEST_VALUE';

describe('location-picker', () => {
    let wrapper: Wrapper<Vue>;

    const wrapperFind = {
        input: () => wrapper.find(`[data-test="${FIELD_ID}/location-picker/input"]`),
        list: () => wrapper.find(`[data-test="${FIELD_ID}/location-picker/list"]`),
        listItems: () => wrapper.findAll(`[data-test^="${FIELD_ID}/location-picker/list-item"]`),
        noResultsMessageMessagelistItem: () => wrapper.find(`[data-test="${FIELD_ID}/location-picker/list-item/no-results-message"]`),
        minimumCharactersMessagelistItem: () => wrapper.find(`[data-test="${FIELD_ID}/location-picker/list-item/minimum-characters-message"]`),
    };

    async function triggerInputEventAsync(value: string) {
        const input = wrapperFind.input();

        await input.vm.$emit('input', { target: { value } });
        jest.runAllTimers();
        await wrapper.vm.$nextTick();
        await localVue.nextTick();
        await input.vm.$emit('click');
    }

    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: {
                id: FIELD_ID,
                value: FIELD_VALUE,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapperFind.list().exists()).toBeFalsy();
        expect(wrapperFind.listItems().length).toBe(0);
        expect(wrapperFind.noResultsMessageMessagelistItem().exists()).toBeFalsy();
        expect(wrapperFind.minimumCharactersMessagelistItem().exists()).toBeFalsy();
    });

    it('sets value attribute on input field on component create', () => {
        const input = wrapperFind.input();
        expect(input.attributes('value')).toBe(FIELD_VALUE);
    });

    it('updates value attribute on input field when value prop is updated', async () => {
        await wrapper.setProps({
            value: 'NEW_TEST_VALUE',
        });

        const input = wrapperFind.input();
        expect(input.attributes('value')).toBe('NEW_TEST_VALUE');
    });

    it('shows minimum characters message when input value length is less than minimum characters required', async () => {
        await triggerInputEventAsync('ABC');
        expect(wrapperFind.minimumCharactersMessagelistItem().exists()).toBeTruthy();
    });

    it('shows no results message when there are no location available for the search phrase', async () => {
        jest.spyOn(api.autocomplete, 'getLocationFullAddress').mockResolvedValue([]);

        await triggerInputEventAsync('ABCDE');
        expect(wrapperFind.noResultsMessageMessagelistItem().exists()).toBeTruthy();
    });

    it('shows locations when there are location available for the search phrase', async () => {
        jest.spyOn(api.autocomplete, 'getLocationFullAddress').mockResolvedValue([
            {
                facilityCode: 'TEST_FACILITY_CODE_1',
                displayName: 'TEST_DISPLAY_NAME_1',
                displayText: 'TEST_DISPLAY_TEXT_1',
            },
            {
                facilityCode: 'TEST_FACILITY_CODE_2',
                displayName: 'TEST_DISPLAY_NAME_2',
                displayText: 'TEST_DISPLAY_TEXT_2',
            },
        ] as Array<ILocationFullAddress>);

        await triggerInputEventAsync('TEST_FACILITY_CODE');
        expect(wrapperFind.listItems().length).toBe(2);
    });

    it('emits change event on click of list item', async () => {
        jest.spyOn(api.autocomplete, 'getLocationFullAddress').mockResolvedValue([
            {
                facilityCode: 'TEST_FACILITY_CODE_1',
                displayName: 'TEST_DISPLAY_NAME_1',
                displayText: 'TEST_DISPLAY_TEXT_1',
            },
            {
                facilityCode: 'TEST_FACILITY_CODE_2',
                displayName: 'TEST_DISPLAY_NAME_2',
                displayText: 'TEST_DISPLAY_TEXT_2',
            },
        ] as Array<ILocationFullAddress>);

        await triggerInputEventAsync('TEST_FACILITY_CODE');
        await wrapperFind.listItems().at(0).vm.$emit('click');

        const event = wrapper.emitted('change') as Array<any>;
        expect(event).toHaveLength(1);
        expect(event[0]).toStrictEqual([
            {
                facilityCode: 'TEST_FACILITY_CODE_1',
                displayName: 'TEST_DISPLAY_NAME_1',
                displayText: 'TEST_DISPLAY_TEXT_1',
            },
        ]);
    });
});
