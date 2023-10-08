<template>
    <div class="import-export-excel">
        <div class="import-export-excel_import-excel-button">
            <mc-button
                v-if="isImportExcelOptionVisible"
                data-test="import-export-excel/import-excel-button"
                :fit="mdsComponentFit.button"
                :label="$t('IMPORT_EXCEL.IMPORT')"
                icon="tray-arrow-up"
                variant="plain"
                @click="isImportModelOpen = true"
            />
        </div>

        <div v-if="exportExcelOptions.length" v-click-outside="() => (isExportExcelOptionsVisible = false)" class="import-export-excel_export-excel-button">
            <mc-tooltip :fit="mdsComponentFit.tooltip" appearance="default" position="right-center">
                <mc-button
                    data-test="import-export-excel/export-excel-button"
                    :fit="mdsComponentFit.button"
                    icon="tray-arrow-down"
                    variant="plain"
                    @click="isExportExcelOptionsVisible = !isExportExcelOptionsVisible"
                >
                    <div class="import-export-excel_export-excel-button_label">
                        {{ $t('EXPORT_EXCEL.EXPORT') }}
                        <mc-icon icon="chevron-down" />
                    </div>
                </mc-button>
                <span slot="content">{{ $t('EXPORT_EXCEL.EXPORT_TO_EXCEL') }}</span>
            </mc-tooltip>
            <mc-c-list v-if="isExportExcelOptionsVisible" class="import-export-excel_export-excel-options">
                <mc-c-list-item
                    v-for="(option, index) in exportExcelOptions"
                    :key="index"
                    :data-test="`import-export-excel/export-excel-option/${option.key}`"
                    @click="
                        selectedExportExcelOption = option.key;
                        option.actionMethod();
                    "
                >
                    <div class="import-export-excel_export-excel-options_option">
                        {{ option.label }}
                        <mc-loading-indicator
                            v-if="option.key === selectedExportExcelOption && isExporting"
                            :fit="mdsComponentFit.loadingIndicator"
                            hiddenlabel
                        />
                    </div>
                </mc-c-list-item>
            </mc-c-list>
        </div>

        <ImportModal
            v-if="isImportModelOpen"
            :list-view-module="listViewModule"
            :files="[]"
            :file-ref="'importExcelFile'"
            :allowed-extensions="['.xlsx', '.xls']"
            :upload-rules="uploadRules"
            :error-messages="errorMsg"
            :allow-multiple-selection="false"
            @close="onImportExcelModalClose"
        />
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-button';
import '@maersk-global/mds-components-core/mc-icon';
import '@maersk-global/mds-components-core/mc-loading-indicator';
import '@maersk-global/mds-components-community/mc-c-list';
import '@maersk-global/mds-components-community/mc-c-list-item';
import '@maersk-global/mds-components-core/mc-tooltip';
import Vue, { PropType } from 'vue';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import { getExportExcelOptions } from './static';
import { getIsImportExcelOptionVisible } from './logic';
import ImportModal from './components/import-modal/import-modal.vue';
import i18n from '@/i18n';
import { ListViewTypeEnum, MDS_COMPONENT_FIT } from '@/static';
import { EventBus, EventBusEventName } from '@/utilities';
import { ListGetterEnum } from '@/store/static';

import './styles/import-export.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'import-export',

    i18n,

    components: {
        ImportModal,
    },

    props: {
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
        listViewModule: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            isImportModelOpen: false,
            isExportExcelOptionsVisible: false,
            selectedExportExcelOption: undefined,
            errorMsg: {
                ext: i18n.t('UNSUPPORTED_EXTENSION').toString(),
                fileSize: i18n.t('FILE_SIZE_EXCEEDED').toString(),
                mimes: i18n.t('UNSUPPORTED_FILE_FORMATE').toString(),
            },
            uploadRules: { ext: ['.xlsx', '.xls'], fileSize: '5000', mimes: [] },
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        selectedRows() {
            return this.$store.getters[`${this.listViewModule}/${ListGetterEnum.GET_SELECTED_ROWS}`];
        },
        isExporting() {
            return this.$store.getters[`${this.listViewModule}/${ListGetterEnum.GET_IMPORT_EXCEL}`].isExporting;
        },
        isImportExcelOptionVisible() {
            return getIsImportExcelOptionVisible();
        },
        exportExcelOptions() {
            return getExportExcelOptions({
                $store: this.$store,
                listViewType: this.listViewType,
                listViewModule: this.listViewModule,
                selectedRows: this.selectedRows,
            });
        },
    },

    methods: {
        onImportExcelModalClose({ isAnyFileUploaded }: { isAnyFileUploaded: boolean }) {
            this.isImportModelOpen = false;
            if (isAnyFileUploaded) {
                EventBus.$emit(EventBusEventName.FETCH_LIST, false);
            }
        },
    },
});
</script>
