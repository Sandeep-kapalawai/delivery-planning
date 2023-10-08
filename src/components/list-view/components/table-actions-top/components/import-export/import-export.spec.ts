import Vue from 'vue';
import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import { merge } from 'lodash';
import ImportExportExcel from './import-export.vue';
import ImportExcelModal from './components/import-modal/import-modal.vue';
import { ExportExcelTypeEnum } from './static';
import { ListActionEnum } from '@/store/static';
import { IRootState } from '@/store/interfaces';
import fclList from '@/store/modules/fcl-list';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { IState as IFclListState } from '@/store/modules/fcl-list/interfaces';
import { ListViewTypeEnum } from '@/static';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> =>
    shallowMount(ImportExportExcel, merge({ localVue } as ThisTypedShallowMountOptions<Vue>, options));

const createStore = () => {
    const fclListModule: Module<IFclListState, IRootState> = {
        namespaced: true,
        state: {
            list: {
                isFetching: false,
                cancelToken: null,
                result: [],
                resultTotalCount: 0,
            },
            importExportAnExcel: {
                isExporting: false,
                isImporting: false,
                isFileImported: false,
            },
            selectedRows: new Map(),
        },
        getters: fclList.getters,
        actions: {
            [ListActionEnum.EXPORT_CSA_BULK_UPDATE]: jest.fn(),
            [ListActionEnum.EXPORT_CONSIGNEE_BULK_UPDATE]: jest.fn(),
            [ListActionEnum.EXPORT_CSA_WITH_CURRENT_COLUMNS]: jest.fn(),
            [ListActionEnum.EXPORT_CSA_WITH_ALL_COLUMNS]: jest.fn(),
            [ListActionEnum.EXPORT_CONSIGNEE_WITH_ALL_COLUMNS]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [FCL_LIST_NAMESPACE]: fclListModule,
        },
    });

    return { store, fclListModule };
};

describe('actions-button', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let fclListModule: any;

    const wrapperFind = {
        importExcelButton: () => wrapper.find('[data-test="import-export-excel/import-excel-button"]'),
        importExcelModalComponent: () => wrapper.findComponent(ImportExcelModal),
        exportExcelButton: () => wrapper.find('[data-test="import-export-excel/export-excel-button"]'),
        exportExcelOptions: () => wrapper.findAll('[data-test^="import-export-excel/export-excel-option"]'),
        exportExcelOption: (key: ExportExcelTypeEnum) => wrapper.find(`[data-test="import-export-excel/export-excel-option/${key}"]`),
    };

    describe('default', () => {
        beforeEach(() => {
            ({ store, fclListModule } = createStore());
            wrapper = render({
                store,
                propsData: {
                    listViewType: ListViewTypeEnum.fcl,
                    listViewModule: FCL_LIST_NAMESPACE,
                },
            });
        });

        it('renders component', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        describe('import excel', () => {
            it('renders import excel button', () => {
                expect(wrapperFind.importExcelButton().exists()).toBeTruthy();
            });

            it('renders import excel modal when import excel button is clicked', async () => {
                expect(wrapperFind.importExcelModalComponent().exists()).toBeFalsy();

                await wrapperFind.importExcelButton().vm.$emit('click');

                expect(wrapperFind.importExcelModalComponent().exists()).toBeTruthy();
            });

            it('emits a fileUploaded event import excel modal emits fileUploaded event', async () => {
                expect(wrapperFind.importExcelModalComponent().exists()).toBeFalsy();
                await wrapperFind.importExcelButton().vm.$emit('click');
                await wrapperFind.importExcelModalComponent().vm.$emit('fileUploaded');

                expect(wrapper.vm.$emit('fileUploaded')).toBeTruthy();
            });
        });

        describe('export excel', () => {
            it('renders export excel button if exportExcelOptions is available', () => {
                expect(wrapperFind.exportExcelButton().exists()).toBeTruthy();
            });

            it('renders all export excel options when export excel button is clicked', async () => {
                expect(wrapperFind.exportExcelOptions().exists()).toBeFalsy();

                await wrapperFind.exportExcelButton().vm.$emit('click');

                expect(wrapperFind.exportExcelOptions().exists()).toBeTruthy();
                expect(wrapperFind.exportExcelOption(ExportExcelTypeEnum.CSA_BULK_UPDATE).exists()).toBeTruthy();
                expect(wrapperFind.exportExcelOption(ExportExcelTypeEnum.CONSIGNEE_BULK_UPDATE).exists()).toBeTruthy();
                expect(wrapperFind.exportExcelOption(ExportExcelTypeEnum.CSA_WITH_CURRENT_COLUMNS).exists()).toBeTruthy();
                expect(wrapperFind.exportExcelOption(ExportExcelTypeEnum.CSA_WITH_ALL_COLUMNS).exists()).toBeTruthy();
                expect(wrapperFind.exportExcelOption(ExportExcelTypeEnum.CONSIGNEE_WITH_ALL_COLUMNS).exists()).toBeTruthy();
                expect(wrapperFind.exportExcelOption(ExportExcelTypeEnum.CSA_GAS_CHECK).exists()).toBeTruthy();
            });

            it.each([
                [ExportExcelTypeEnum.CSA_BULK_UPDATE, ListActionEnum.EXPORT_CSA_BULK_UPDATE],
                [ExportExcelTypeEnum.CSA_GAS_CHECK, ListActionEnum.EXPORT_CSA_BULK_UPDATE],
                [ExportExcelTypeEnum.CONSIGNEE_BULK_UPDATE, ListActionEnum.EXPORT_CONSIGNEE_BULK_UPDATE],
                [ExportExcelTypeEnum.CSA_WITH_CURRENT_COLUMNS, ListActionEnum.EXPORT_CSA_WITH_CURRENT_COLUMNS],
                [ExportExcelTypeEnum.CSA_WITH_ALL_COLUMNS, ListActionEnum.EXPORT_CSA_WITH_ALL_COLUMNS],
                [ExportExcelTypeEnum.CONSIGNEE_WITH_ALL_COLUMNS, ListActionEnum.EXPORT_CONSIGNEE_WITH_ALL_COLUMNS],
            ])(
                'when %s option of export to excel is clicked, component dispatches %s action',
                async (excelOptionKey: ExportExcelTypeEnum, actionName: string) => {
                    expect(wrapperFind.exportExcelOptions().exists()).toBeFalsy();

                    await wrapperFind.exportExcelButton().vm.$emit('click');
                    await wrapperFind.exportExcelOption(excelOptionKey).vm.$emit('click');

                    expect(fclListModule.actions[actionName]).toHaveBeenCalledTimes(1);
                },
            );
        });
    });
});
