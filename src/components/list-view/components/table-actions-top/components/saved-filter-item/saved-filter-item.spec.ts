import { ThisTypedShallowMountOptions, Wrapper, mount, shallowMount } from '@vue/test-utils';
import SavedFilterItem from './saved-filter-item.vue';
import { merge } from 'lodash';
import { ListViewTypeEnum } from '@/static';

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    mount(
        SavedFilterItem,
        merge(
            {
                stubs: {
                    'mc-tooltip': true,
                    'mc-tag': true,
                    OverflowMenu: true,
                },
            } as ThisTypedShallowMountOptions<Vue>,
            options,
        ),
    );

describe('SavedFilterItem.vue', () => {
    let wrapper: Wrapper<Vue>;
    const wrapperFind = {
        filterName: () => wrapper.find('[data-test="saved-filter-item/saved-filter-card/saved-filter-name"]'),
        filterNameToolTip: () => wrapper.find('[data-test="saved-filter-item/saved-filter-card/tooltip"]'),
        applyFilterButton: () => wrapper.find('[data-test="saved-filter-item/saved-filter-card/apply-saved-filter-button"]'),
        overFlowMenu: () => wrapper.find('[data-test="saved-filter-item/saved-filter-card/overflow-menu"]'),
    };
    
    describe('default', () => {
        beforeEach(() => {
            wrapper = render({
                propsData: {
                    listViewType: ListViewTypeEnum.fcl,
                    savedFilterItem: {
                        id: '421',
                        name: 'TEST_FILTER_NAME',
                        fields: [
                            {
                                FILTER_FIELD_TEST_1: '14',
                            },
                            {
                                FILTER_FIELD_TEST_2: 'abc',
                            },
                        ],
                    },
                    isSelected: false,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('shows filter name inside span', () => {
            const filterNameWrapper = wrapperFind.filterName();
            expect(filterNameWrapper.text()).toBe('TEST_FILTER_NAME');
        });

        it('shows filter name inside tooltip', () => {
            const filterNameTooltipWrapper = wrapperFind.filterNameToolTip();
            expect(filterNameTooltipWrapper.exists()).toBeTruthy();
            expect(filterNameTooltipWrapper.find('.tooltip').text()).toBe('TEST_FILTER_NAME');
        });

        it('shows apply filter button with check-circle button icon and without any label', () => {
            const applyFilterButtonWrapper = wrapperFind.applyFilterButton();
            expect(applyFilterButtonWrapper.exists()).toBeTruthy();
            expect(applyFilterButtonWrapper.attributes('icon')).toBe('check-circle');
            expect(applyFilterButtonWrapper.attributes('hiddenlabel')).toBe('');
        });

        it('shows overflow button', async () => {
            const overFlowMenuWrapper = wrapperFind.overFlowMenu();
            expect(overFlowMenuWrapper.exists()).toBeTruthy();
        });

        it('emits on-saved-filter-applied when clicked on check-circle button icon', async () => {
            const applyFilterButtonWrapper = wrapperFind.applyFilterButton();
            const savedFilterItem = {
                id: '421',
                name: 'TEST_FILTER_NAME',
                fields: [
                    {
                        FILTER_FIELD_TEST_1: '14',
                    },
                    {
                        FILTER_FIELD_TEST_2: 'abc',
                    },
                ],
            };
            applyFilterButtonWrapper.vm.$emit('click');
            await wrapper.vm.$nextTick();
            const event = wrapper.emitted('on-saved-filter-applied') as Array<any>;
            expect(event).toHaveLength(1);
            expect(event[0]).toStrictEqual([savedFilterItem]);
        });
    });
});
