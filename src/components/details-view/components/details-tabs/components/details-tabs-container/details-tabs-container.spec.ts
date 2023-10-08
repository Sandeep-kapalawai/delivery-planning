import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper, WrapperArray } from '@vue/test-utils';
import DetailsTabsContainer from './details-tabs-container.vue';
import { DetailsTabEnum } from '@/static';

const localVue = createLocalVue();

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(DetailsTabsContainer, {
        directives: {
            ['click-outside']: jest.fn(),
        },
        ...options,
    });

describe('DetailsTabsContainer', () => {
    let wrapper: Wrapper<Vue>;
    let detailstabBar: WrapperArray<any>;
    let detailsTab: Wrapper<any>;
    const items = [
        { name: DetailsTabEnum.PurchaseOrders, title: 'Purchase Orders', icon: 'shopping-cart' },
        { name: DetailsTabEnum.FinOps, title: 'Invoices', icon: 'file-invoice' },
        { name: DetailsTabEnum.Comments, title: 'Payments', icon: 'credit-card' },
    ];

    beforeEach(() => {
        wrapper = render({
            localVue,
            propsData: { items },
        });
        detailstabBar = wrapper.findAll('[data-test="details-tabs/tab-bar"] mc-tab-stub');
        detailsTab = wrapper.find('[data-test="details-tabs/tab-bar"]');
    });

    it('renders a tab bar with the correct items', () => {
      expect(detailstabBar).toHaveLength(items.length);
    });
});
