<template>
    <mc-modal
        :heading="heading"
        :open="open"
        backdropcloseactiondisabled
        :escapecloseactiondisabled="loading"
        :zindex="9999"
        :dimension="size"
        @closed="$emit('cancel')"
    >
        <slot></slot>
        <mc-button
            slot="primaryAction"
            data-test="confirmation-modal/confirm-button"
            :label="confirmButtonLabel"
            :loading="loading"
            :fit="mdsComponentFit.button"
            @click="$emit('confirm')"
        />
        <mc-button
            slot="secondaryAction"
            data-test="confirmation-modal/cancel-button"
            :label="cancelButtonLabel"
            :fit="mdsComponentFit.button"
            variant="secondary"
            @click="$emit('cancel')"
        />
    </mc-modal>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-modal';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { MDS_COMPONENT_FIT } from '@/static';
import i18n from '@/i18n';
import Vue from 'vue';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'confirmation-modal',

    props: {
        open: {
            type: Boolean,
            default: false,
        },
        loading: { type: Boolean, default: false },
        heading: { type: String, default: i18n.t('MODAL.CONFIRM_ACTION').toString() },
        confirmButtonLabel: { type: String, default: i18n.t('CONFIRM').toString() },
        cancelButtonLabel: { type: String, default: i18n.t('CANCEL').toString() },
        size: { type: String, default: 'small' },
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
    },
});
</script>
