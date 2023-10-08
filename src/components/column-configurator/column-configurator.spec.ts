import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { ToolsPanel } from '@scm-ui/tools-panel';
import { ColumnConfigurator as SCMColumnConfigurator } from '@scm-ui/column-configurator';
import ColumnConfigurator from './column-configurator.vue';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import {
    NAMESPACE as TABLE_CONFIGURATION_NAMESPACE,
    TableConfigurationActionEnum,
    TableConfigurationGetterEnum,
} from '@/store/modules/table-configuration/static';
import { IRootState, IListState } from '@/store/interfaces';
import { IState as ITableConfigurationState } from '@/store/modules/table-configuration/interfaces';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(ColumnConfigurator, options);

const createStore = () => {
    const tableConfiguration: Module<ITableConfigurationState, IRootState> = {
        namespaced: true,
        state: {
            initialized: true,
            saveUserPreferencesEnabled: false,
            tableId: '',
            defaultColDef: {},
            originalColumnDefs: [],
            originalColumnDefsMap: new Map(),
            columnDefs: [],
            originalTheme: { spacing: 'default' },
            theme: { spacing: 'default' },
        },
        getters: {
            [TableConfigurationGetterEnum.GET_DEFAULT_COLUMN_DEF]: (state) => jest.fn().mockReturnValue(state.defaultColDef),
            [TableConfigurationGetterEnum.GET_COLUMN_DEFS]: (state) => state.columnDefs,
        },
        actions: {
            [TableConfigurationActionEnum.INITIALIZE]: jest.fn(),
            [TableConfigurationActionEnum.SET_COLUMN_DEFS]: jest.fn(),
            [TableConfigurationActionEnum.SET_THEME]: jest.fn(),
            [TableConfigurationActionEnum.RESET_COLUMN_DEFS]: jest.fn(),
        },
    };

    const listModule: Module<IListState<any>, IRootState> = {
        namespaced: true,
        modules: {
            [TABLE_CONFIGURATION_NAMESPACE]: tableConfiguration,
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [FCL_LIST_NAMESPACE]: listModule,
        },
    });

    return { store, tableConfiguration };
};

describe('column-configurator', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let tableConfiguration: any;

    const wrapperFind = {
        toolsPanelComponent: () => wrapper.findComponent(ToolsPanel),
        columnConfiguratorComponent: () => wrapper.findComponent(SCMColumnConfigurator),
        columnConfiguratorIcon: () => wrapper.find('[data-test="column-configurator/column-configurator-icon"]'),
    };

    beforeEach(() => {
        ({ store, tableConfiguration } = createStore());
        wrapper = render({
            localVue,
            store,
            propsData: {
                listViewModule: FCL_LIST_NAMESPACE,
            },
        });
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('columnConfigurator Button toggle on click', async () => {
        const columnConfiguratorButton = wrapperFind.columnConfiguratorIcon();
        columnConfiguratorButton.vm.$emit('click');
        await localVue.nextTick();

        expect(wrapper.vm.$data.showColumnConfigurator).toBeTruthy();
        columnConfiguratorButton.vm.$emit('click');
        await localVue.nextTick();

        expect(wrapper.vm.$data.showColumnConfigurator).toBeFalsy();
    });

    it('component initialize Draft ColumnDefs on click of coulmnConfiguratorButton', async () => {
        const columnConfiguratorButton = wrapperFind.columnConfiguratorIcon();
        columnConfiguratorButton.vm.$emit('click');
        await localVue.nextTick();

        const columnConfiguratorComponent = wrapperFind.columnConfiguratorComponent();

        expect(columnConfiguratorComponent.props('columns')).toBeDefined();
    });

    it('on click of apply button Set Column Defs', async () => {
        const columnConfiguratorButton = wrapperFind.columnConfiguratorIcon();
        columnConfiguratorButton.vm.$emit('click');
        await localVue.nextTick();

        const columnConfiguratorComponent = wrapperFind.columnConfiguratorComponent();
        columnConfiguratorComponent.vm.$emit('onColumnsChange', [
            { headerName: 'Test1', name: 'Test1' },
            { headerName: 'Test2', name: 'Test2' },
        ]);

        const toolsPanelComponent = wrapperFind.toolsPanelComponent();
        toolsPanelComponent.vm.$emit('primary-action');
        await localVue.nextTick();

        expect(tableConfiguration.actions[TableConfigurationActionEnum.SET_COLUMN_DEFS]).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$data.showColumnConfigurator).toBeFalsy();
    });

    it('on click of apply button sets the table theme', async () => {
        const columnConfiguratorButton = wrapperFind.columnConfiguratorIcon();
        columnConfiguratorButton.vm.$emit('click');
        await localVue.nextTick();

        const columnConfiguratorComponent = wrapperFind.columnConfiguratorComponent();
        columnConfiguratorComponent.vm.$emit('onRowSpacingChange', 'compact');

        const toolsPanelComponent = wrapperFind.toolsPanelComponent();
        toolsPanelComponent.vm.$emit('primary-action');
        await localVue.nextTick();

        expect(tableConfiguration.actions[TableConfigurationActionEnum.SET_THEME]).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$data.showColumnConfigurator).toBeFalsy();
    });

    it('on click of reset button reset column defs', async () => {
        const columnConfiguratorButton = wrapperFind.columnConfiguratorIcon();
        columnConfiguratorButton.vm.$emit('click');
        await localVue.nextTick();

        const toolsPanelComponent = wrapperFind.toolsPanelComponent();
        toolsPanelComponent.vm.$emit('secondary-action');
        await localVue.nextTick();
        expect(tableConfiguration.actions[TableConfigurationActionEnum.RESET_COLUMN_DEFS]).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$data.showColumnConfigurator).toBeFalsy();
    });

    it('on click of close pannel popup should be hide', async () => {
        const columnConfiguratorButton = wrapperFind.columnConfiguratorIcon();
        columnConfiguratorButton.vm.$emit('click');
        await localVue.nextTick();

        const toolsPanelComponent = wrapperFind.toolsPanelComponent();
        toolsPanelComponent.vm.$emit('close-panel');
        await localVue.nextTick();
        expect(wrapper.vm.$data.showColumnConfigurator).toBeFalsy();
    });
});
