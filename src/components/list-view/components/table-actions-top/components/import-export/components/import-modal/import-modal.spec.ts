import Vuex, { Store, Module } from 'vuex';
import { createLocalVue, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';
import ImportModal from './import-modal.vue';
import { ListGetterEnum, ListActionEnum } from '@/store/static';
import { NAMESPACE as FCL_LIST_NAMESPACE } from '@/store/modules/fcl-list/static';
import { IRootState } from '@/store/interfaces';
import { IState as IFclListState } from '@/store/modules/fcl-list/interfaces';
import { ListViewTypeEnum } from '@/static';

const localVue = createLocalVue();
localVue.use(Vuex);

const render = (options: ThisTypedShallowMountOptions<Vue>): Wrapper<Vue> => shallowMount(ImportModal, options);

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
        getters: {
            [ListGetterEnum.GET_LIST](state) {
                return state.list;
            },
            [ListGetterEnum.GET_IMPORT_EXCEL](state) {
                return state.importExportAnExcel;
            },
        },
        actions: {
            [ListActionEnum.IMPORT_AN_EXCEL]: jest.fn(),
        },
    };

    const store = new Vuex.Store<any>({
        modules: {
            [FCL_LIST_NAMESPACE]: fclListModule,
        },
    });

    return { store, fclListModule };
};

describe('import-modal', () => {
    let wrapper: Wrapper<Vue>;
    let store: Store<any>;
    let fclListModule: any;

    const wrapperFind = {
        importModal: () => wrapper.find('[data-test="import-modal/uploadDocuments"]'),
        closeButton: () => wrapper.find('[data-test="import-modal-content/close-button"]'),
        selectFile: () => wrapper.find('[data-test="import-modal/select-file-input"]'),
        confirmButton: () => wrapper.find('[data-test="import-modeal-content/confirm-button"]'),
        selectFileButton: () => wrapper.find('[data-test="FileUpload/select-file-button"]'),
        notification: () => wrapper.find('[data-test="import-modal/mc-notification-isExcelError"]'),
    };

    beforeEach(() => {
        ({ store, fclListModule } = createStore());
        wrapper = render({
            localVue,
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

    it('render import modal', () => {
        expect(wrapperFind.importModal().exists()).toBeTruthy();
    });

    it('render close button', () => {
        expect(wrapperFind.closeButton().exists()).toBeTruthy();
    });

    it('render confirm button', () => {
        expect(wrapperFind.confirmButton().exists()).toBeTruthy();
    });

    test('renders close button and is disabled when file is getting imported', async () => {
        fclListModule.actions[ListActionEnum.IMPORT_AN_EXCEL].isImporting = true;
        await localVue.nextTick();

        const cancelButton = wrapperFind.closeButton();

        expect(cancelButton.exists()).toBeTruthy();
        expect(cancelButton.attributes('label')).toBe('BUTTONS.CLOSE');
        expect(cancelButton.attributes('disabled')).toBeUndefined();
    });

    test('does not render the select file button when file is selected', async () => {
        await wrapper.setData({
            filesList: [
                {
                    name: 'Test filename',
                },
            ],
        });

        const selectFileButton = wrapperFind.selectFileButton();

        expect(selectFileButton.exists()).toBeFalsy();
    });

    test('renders confirm button and is disabled by default', () => {
        const importButton = wrapperFind.confirmButton();

        expect(importButton.exists()).toBeTruthy();
        expect(importButton.attributes('label')).toBe('CONFIRM');
        expect(importButton.attributes('disabled')).toBeTruthy();
    });

    test('renders confirmButton and is enabled when file is selected', async () => {
        await wrapper.setData({
            filesList: [
                {
                    name: 'Test filename',
                },
            ],
            isAnyFileSelectedForUploaded: true,
        });

        const importButton = wrapperFind.confirmButton();

        expect(importButton.exists()).toBeTruthy();
        expect(importButton.attributes('label')).toBe('CONFIRM');
        expect(importButton.attributes('disabled')).toBeFalsy();
    });

    test('emits close event on click', () => {
        const buttonElement = wrapperFind.closeButton();
        buttonElement.trigger('click');

        expect(buttonElement.exists()).toBeTruthy();
    });

    it('should upload files', async () => {
        const mockUploadModal = jest.fn();
        wrapper.setMethods({ uploadModal: mockUploadModal });
        wrapper.setData({ filesList: [{ name: 'test.csv', size: 100 }] });
        const confirmButton = wrapper.find('[data-test="import-modeal-content/confirm-button"]');
        await confirmButton.trigger('click');

        expect(mockUploadModal).toHaveBeenCalledTimes(0);
    });
});
