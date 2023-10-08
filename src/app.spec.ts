import { createLocalVue, mount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { merge } from 'lodash';
import { PageLayout } from '@scm-ui/page-layout';
import { PageHeader } from '@scm-ui/page-header';
import * as destinationUtilities from 'destination/utilities';
import app from './app.vue';
import { IPageHeaderTab } from './interfaces';
import { FeatureToggleEnum } from './static';

const localVue = createLocalVue();

const render = (options?: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    mount(
        app,
        merge(
            {
                localVue,
                stubs: {
                    'router-view': true,
                },
            } as ThisTypedShallowMountOptions<Vue>,
            options,
        ),
    );

describe('app', () => {
    let wrapper: Wrapper<any>;

    const wrapperFind = {
        pageLayout: () => wrapper.findComponent(PageLayout),
        pageHeader: () => wrapper.findComponent(PageHeader),
        pageHeaderTabs: () => wrapper.vm.$data.pageHeaderTabs as Array<IPageHeaderTab>,
    };

    beforeEach(() => {
        wrapper = render();
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders page layout', () => {
        expect(wrapperFind.pageLayout().exists()).toBeTruthy();
    });

    it('renders page header', () => {
        expect(wrapperFind.pageHeader().exists()).toBeTruthy();
    });

    it('creates FCL tab', () => {
        const pageHeaderTabs = wrapperFind.pageHeaderTabs();
        expect(pageHeaderTabs[0]).toBeDefined();
        expect(pageHeaderTabs[0].label).toBe('FCL');
    });

    it('does not create LCL tab when DP_LCL_LISTVIEW is false', () => {
        jest.spyOn(destinationUtilities, 'isFeatureEnabled').mockImplementation((feature) => {
            switch (feature) {
                case FeatureToggleEnum.DP_LCL_LISTVIEW:
                    return false;
                default:
                    return true;
            }
        });

        // Rerendering the component to resolve tabs based of Feature Flag value
        wrapper = render();

        const pageHeaderTabs = wrapperFind.pageHeaderTabs();
        expect(pageHeaderTabs[1]).toBeUndefined();
    });

    it('creates LCL tab when DP_LCL_LISTVIEW is true', () => {
        jest.spyOn(destinationUtilities, 'isFeatureEnabled').mockImplementation((feature) => {
            switch (feature) {
                case FeatureToggleEnum.DP_LCL_LISTVIEW:
                    return true;
                default:
                    return true;
            }
        });

        // Rerendering the component to resolve tabs based of Feature Flag value
        wrapper = render();

        const pageHeaderTabs = wrapperFind.pageHeaderTabs();
        expect(pageHeaderTabs[1]).toBeDefined();
        expect(pageHeaderTabs[1].label).toBe('LCL');
    });

    it('trigger navigation on page header tab click', () => {
        const spyRouterReplace = jest.spyOn(wrapper.vm.$router, 'replace');
        const tab = wrapperFind.pageHeaderTabs()[0];

        wrapper.vm.onPageHeaderTabClick({ tab });

        expect(spyRouterReplace).toBeCalledTimes(1);
        expect(spyRouterReplace).toBeCalledWith({
            name: tab.defaultRoute,
        });
    });

    it('sets active tab on current route name change', () => {
        const tab = wrapperFind.pageHeaderTabs()[0];

        wrapper.vm.setActivePageHeaderTab({ currentRoute: { name: tab.defaultRoute } });

        expect(tab.active).toBeTruthy();
    });
});
