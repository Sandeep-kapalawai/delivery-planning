<template>
    <div class="import-modal">
        <mc-modal
            data-test="import-modal/uploadDocuments"
            open
            backdropcloseactiondisabled
            :escapecloseactiondisabled="isImporting"
            :heading="$t('UPLOAD_DOCUMENT')"
            @closed="onCloseButtonClick"
        >
            <DestinationNotifications :component="NotificationComponentEnum.DP_IMPORT_MODAL" :position="NotificationPositionEnum.absolute" />

            <div class="import-modal form-group theme--light--alt">
                <ValidationProvider :ref="`${fileRef}_provider`" :rules="uploadRules">
                    <div class="import-modal__notification">
                        <mc-notification
                            v-if="isExcelError && fileCount > 0"
                            data-test="import-modal/mc-notification-isExcelError"
                            :fit="mdsComponentFit.notification"
                            closable
                            appearance="error"
                            icon="times-circle"
                        >
                            <span slot="body">
                                {{ $t('EXCEL_ERROR_MESSAGE') }}
                                <span class="import-modal__notification__link" @click="downloadExcelFile()"> {{ $t('HERE') }} </span>
                                {{ $t('CLICK_MORE_DETAILS') }}
                            </span>
                            <div class="import-modal__notification__close-icon"><mc-icon icon="times" /></div>
                        </mc-notification>

                        <mc-notification v-if="!isExcelError && !isImporting && fileCount > 0 && isFileImported" appearance="success" icon="check-circle">
                            <span slot="body">{{ $t('EXCEL_UPLOADED_SUCCESSFULLY') }}</span>
                        </mc-notification>
                    </div>

                    <div class="import-modal__rectangle">
                        <div v-if="fileCount <= 0" class="import-modal__upload-box" @drop.stop.prevent="drop" @dragover.prevent="">
                            <i aria-hidden="true" class="icon import-modal__folder-icon mi-folder-arrow-up"></i>
                            <input id="FileContent" class="import-modal__input" type="file" name="Select file" @change="handleFileChange" />

                            <div :class="['import-modal__label__link', isImporting || fileCount > 0 ? 'import-modal__label__link__disabled' : '']">
                                <mc-button variant="secondary" data-spec="FileUpload/select-file-button" @click="onSelect">Select File</mc-button>
                            </div>
                            <p>{{ $t('USER_INFORMATION_ON_IMPORT_MODAL') }}</p>
                        </div>

                        <div v-else class="import-modal__files-area">
                            <div class="import-modal__files">
                                <div v-for="(fileInfo, index) in filesList" :key="index" class="font--default import-modal__files__name">
                                    <div class="import-modal__files__name__label">
                                        <div>
                                            <mc-icon icon="file" color="#141414" />
                                        </div>
                                        <div>{{ fileInfo.name }}</div>
                                    </div>

                                    <span>{{ Math.ceil(convertToKiloBytes(fileInfo.size)) + ' KB' }}</span>
                                    <mc-button fit="small" variant="secondary" @click="onCancel(fileInfo.name)">
                                        <mc-icon icon="trash" color="#FA381C"></mc-icon>
                                    </mc-button>
                                </div>
                            </div>
                        </div>

                        <span v-if="description" class="form-help">{{ description }}</span>

                        <input
                            :ref="fileRef"
                            data-test="import-modal/select-file-input"
                            :label="$t('SELECT_FILES')"
                            :multiple="allowMultipleSelection"
                            type="file"
                            :accept="allowedExtensions"
                            name="Select file"
                            class="import-modal__input"
                            :disabled="disableUpload"
                            @change="handleFileChange"
                        />
                    </div>
                </ValidationProvider>
            </div>

            <mc-button
                slot="secondaryAction"
                data-test="import-modal-content/close-button"
                :fit="mdsComponentFit.button"
                :label="$t('BUTTONS.CLOSE')"
                focusendanchor
                variant="secondary"
                dialog-action="close"
                @click="onCloseButtonClick"
            />

            <mc-button
                slot="primaryAction"
                :data-test="`import-modeal-content/confirm-button`"
                :fit="mdsComponentFit.button"
                :label="$t('CONFIRM')"
                focusstartanchor
                variant="primary"
                :disabled="fileCount <= 0 || !isAnyFileSelectedForUploaded || isImporting || isExcelError || isImportingError || isNotificationVisible"
                :loading="isImporting"
                dialog-action="save"
                @click="onConfirmButtonClick"
            />
        </mc-modal>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-button';
import '@maersk-global/mds-components-core/mc-icon';
import '@maersk-global/mds-components-core/mc-notification';
import '@maersk-global/mds-components-core/mc-select';
import Vue, { PropType } from 'vue';
import { ValidationProvider, extend } from 'vee-validate/dist/vee-validate.full';
import { Buffer } from 'buffer';
import DestinationNotifications from 'destination/components/notifications';
import { downloadXlsx, getNotificationMessageFromAPIErrors, addNotification, removeNotification, clearNotifications } from 'destination/utilities';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import { ListViewTypeEnum, MDS_COMPONENT_FIT, NotificationComponentEnum, NotificationPositionEnum } from '@/static';
import { ListActionEnum, ListGetterEnum } from '@/store/static';

import './styles/import-modal.scss';

enum EventNameEnum {
    close = 'close',
}

enum NOTIFICATION_ID {
    IMPORT_EXCEL_FILE_VALIDATION = 'DP_IMPORT_EXCEL_FILE_VALIDATION',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'import-modal',

    i18n,

    components: {
        ValidationProvider,
        DestinationNotifications,
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
        fileRef: {
            type: String,
            default: '',
            required: true,
        },
        files: {
            type: Array,
            default: function () {
                return [];
            },
        },
        allowMultipleSelection: {
            type: Boolean,
            default: false,
        },
        uploadRules: {
            type: Object,
            default: function () {
                return {
                    ext: ['.xlsx'],
                    fileSize: 300,
                    mimes: [],
                };
            },
        },
        disableUpload: {
            type: Boolean,
            default: false,
        },
        errorMessages: {
            type: Object,
            default: function () {
                return {
                    ext: i18n.t('UNSUPPORTED_EXTENSION').toString(),
                    fileSize: i18n.t('FILE_SIZE_EXCEEDED').toString(),
                    mimes: i18n.t('UNSUPPORTED_FILE_FORMATE').toString(),
                };
            },
        },
        description: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            NotificationPositionEnum: NotificationPositionEnum,
            NotificationComponentEnum: NotificationComponentEnum,
            isNotificationVisible: false,
            isAnyFileSelectedForUploaded: false,
            isAnyFileUploaded: false,
            filesList: [],
            responseFileContent: '',
            isImportingError: false,
            isExcelError: false,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        fileCount() {
            return this.$data.filesList.length;
        },
        allowedExtensions() {
            const { mimes } = this.uploadRules;
            return mimes ? mimes.toString() : '*';
        },
        isImporting() {
            return this.$store.getters[`${this.listViewModule}/${ListGetterEnum.GET_IMPORT_EXCEL}`].isImporting;
        },
        isFileImported() {
            return this.$store.getters[`${this.listViewModule}/${ListGetterEnum.GET_IMPORT_EXCEL}`].isFileImported;
        },
    },

    created() {
        this.setCustomRules();
        this.overrideDefaultErrorMessage();
        this.filesList = this.files;
    },

    destroyed() {
        clearNotifications(NotificationComponentEnum.DP_IMPORT_MODAL);
    },

    methods: {
        onSelect() {
            const fileRefs = this.$refs as any;
            fileRefs[this.fileRef].value = '';
            fileRefs[this.fileRef].click();
        },
        onCloseButtonClick() {
            this.$emit(EventNameEnum.close, { isAnyFileUploaded: this.isAnyFileUploaded });
        },
        async onConfirmButtonClick() {
            clearNotifications(NotificationComponentEnum.DP_IMPORT_MODAL);

            try {
                const formattedFile = JSON.stringify({ file: this.$data.filesList[0].content });
                const response = await this.$store.dispatch(`${this.listViewModule}/${ListActionEnum.IMPORT_AN_EXCEL}`, formattedFile);
                this.isAnyFileUploaded = true;
                this.isAnyFileSelectedForUploaded = false;
                if (response.success) {
                    this.isExcelError = false;
                } else {
                    this.isExcelError = true;
                    this.$data.responseFileContent = {
                        content: this.getContentFromFile(response.file.fileContents),
                        name: this.$data.filesList[0]?.name?.split('.')[0],
                    };
                }
            } catch (error) {
                this.isImportingError = true;
                addNotification(NotificationComponentEnum.DP_IMPORT_MODAL, getNotificationMessageFromAPIErrors({ error }));
            }
        },
        overrideDefaultErrorMessage() {
            Object.keys(this.errorMessages).forEach((error) => {
                extend(error, {
                    message: this.errorMessages[error],
                });
            });
        },
        fileName(file) {
            return file && file.name ? file.name : '';
        },
        getFilesFromRef() {
            const fileRefs = this.$refs as any;
            const filesFromRef = fileRefs[this.fileRef].files;
            return Object.keys(filesFromRef).length > 0 ? filesFromRef : [];
        },
        setCustomRules() {
            extend('fileSize', {
                validate: (value: any, args: any) => {
                    const sizeLimit = args[0];
                    const uploadedFileSize = value.reduce((accumalator: any, currentValue: { size: any }) => {
                        const { size } = currentValue;
                        return accumalator + this.convertToKiloBytes(size);
                    }, 0);
                    return uploadedFileSize < sizeLimit;
                },
            });
        },
        handleFileUpload(file, fileContent) {
            const fileName = this.fileName(file);
            const hasFileDetails = this.filesList.some((fileInfo: { name: string }) => fileInfo.name === fileName);
            if (!hasFileDetails) {
                const fileObj = {
                    name: fileName,
                    content: fileContent || '',
                    type: file['type'] || '',
                    ref: this.fileRef,
                    size: file['size'] || 0,
                    lastModified: file['lastModified'],
                };
                this.$data.filesList.push(fileObj);
            }
        },
        convertToKiloBytes(bytes) {
            if (!bytes || bytes == 0) {
                return bytes;
            }
            return bytes / 1024;
        },
        onCancel(fileName) {
            const index = this.$data.filesList.findIndex((file: { name: string }) => file.name === fileName);
            if (this.filesList.length === 2) {
                this.isNotificationVisible = false;
            }
            if (index > -1) {
                this.$data.filesList.splice(index, 1);
                this.clearSelectedFiles();
            }
        },
        clearSelectedFiles() {
            this.isAnyFileSelectedForUploaded = false;

            this.$store.commit(`${this.listViewModule}/${ListActionEnum.CLEAR_IMPORT_FILES}`);
        },
        async handleFileChange(e: any) {
            this.isNotificationVisible = false;
            this.clearSelectedFiles();
            const ref = `${this.fileRef}_provider`;
            const providerRef = this.$refs[ref] as any;
            const fileList = this.getFilesFromRef();
            const { valid } = await providerRef.validate(e);
            
            if (valid) {
                this.isAnyFileSelectedForUploaded = true;
                this.isImportingError= false;
                this.isExcelError= false;
                let files = Object.keys(fileList);
                files.forEach((index: any) => {
                    let reader = new FileReader();
                    reader.onload = (event) => {
                        const targetEvent = event;
                        const targetResult = targetEvent?.target?.result as any;
                        const fileContent = targetResult.split(',').pop();
                        this.handleFileUpload(fileList[index], fileContent);
                    };
                    reader.readAsDataURL(fileList[index]);
                });
            } else {
                this.fileUploadValidate(e.target.files);
            }
        },
        getContentFromFile(fileData) {
            const byteCharacters = Buffer.from(fileData, 'base64');
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.readUInt8(i);
            }

            return new Uint8Array(byteNumbers);
        },
        async drop(e) {
            this.isNotificationVisible = false;
            this.clearSelectedFiles();
            const filesList = e.dataTransfer.files;
            const isValid = !this.fileUploadValidate(filesList);
            if (isValid) {
                this.isAnyFileSelectedForUploaded = true;
                this.isImportingError= false;
                this.isExcelError= false;

                let files = Object.keys(filesList);
                files.forEach((index: any) => {
                    let reader = new FileReader();
                    reader.onload = (event) => {
                        const targetEvent = event;
                        const targetResult = targetEvent?.target?.result as any;
                        const fileContent = targetResult.split(',').pop();
                        this.handleFileUpload(filesList[index], fileContent);
                    };
                    reader.readAsDataURL(filesList[index]);
                });
            }
        },
        fileUploadValidate(filesList) {
            removeNotification(NotificationComponentEnum.DP_IMPORT_MODAL, NOTIFICATION_ID.IMPORT_EXCEL_FILE_VALIDATION);
            // File size
            let fileSizeExceeded = false;
            let numberOFFiles = false;
            if (this.convertToKiloBytes(filesList[0].size) > this.uploadRules.fileSize) {
                fileSizeExceeded = true;
            }
            //File extension
            let wrongFileExtension = false;
            let fileExtension = filesList[0].name.split('.').pop();
            if (['xlsx', 'xls'].indexOf(fileExtension) == -1) {
                wrongFileExtension = true;
            }

            if (filesList.length > 1) {
                numberOFFiles = true;
            }

            if (fileSizeExceeded || wrongFileExtension || numberOFFiles) {
                let notificationText: string | undefined = undefined;
                if (fileSizeExceeded) {
                    notificationText = i18n.t('FILE_SIZE_EXCEEDED').toString();
                } else if (wrongFileExtension) {
                    notificationText = i18n.t('UNSUPPORTED_EXTENSION').toString();
                } else if (numberOFFiles) {
                    notificationText = i18n.t('MULTIPLE_DRAG_NOT_SUPPORTED').toString();
                }

                addNotification(
                    NotificationComponentEnum.DP_IMPORT_MODAL,
                    getNotificationMessageFromAPIErrors({ Id: NOTIFICATION_ID.IMPORT_EXCEL_FILE_VALIDATION, error: notificationText }),
                );
            }

            return fileSizeExceeded || wrongFileExtension;
        },
        downloadExcelFile() {
            const fileName = this.$data.responseFileContent.name;
            const fileContent = this.$data.responseFileContent.content;
            downloadXlsx(fileName, fileContent);
        },
    },
});
</script>
