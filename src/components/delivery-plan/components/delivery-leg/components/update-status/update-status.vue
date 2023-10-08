<template>
    <div class="updatemodals">
        <mc-modal
            open
            backdropcloseactiondisabled
            escapecloseactiondisabled
            :heading="$t('MESSAGE.ACCEPT_DO_MODAL_HEADER')"
            height="30vh"
            width="40vw"
            @closed="closeStatusModal"
        >
            <div class="update-delivery-order-status-modeal-content">
                <Row :gutter="8" :columns="12" :lg="12" :md="12" :xs="12">
                    <div
                        class="update-delivery-order-status-modeal-content__delivery-order-confirmation-message"
                        data-test="update-delivery-order-status-modeal-content/message"
                    >
                        {{ $t('MESSAGE.ACCEPT_DO_CONFIRMATION_MESSAGE', { number: deliveryOrder }).toString() }}
                    </div>
                </Row>
            </div>
            <mc-button
                slot="primaryAction"
                :data-test="`update-delivery-order-status-modeal-content/update-button`"
                :fit="mdsComponentFit.button"
                focusstartanchor
                variant="primary"
                dialog-action="save"
                @click="updateStatusConfirmed"
            >
                {{ $t('BUTTONS.ACCEPT') }}
            </mc-button>

            <mc-button
                slot="secondaryAction"
                data-test="update-delivery-order-status-modeal-content/cancel-button"
                :fit="mdsComponentFit.button"
                focusendanchor
                variant="secondary"
                dialog-action="cancel"
                @click="closeStatusModal"
            >
                {{ $t('CANCEL') }}
            </mc-button>
        </mc-modal>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-button';
import '@maersk-global/mds-components-core/mc-select';
import '@maersk-global/mds-components-core/mc-notification';
import Vue from 'vue';
import { Row } from '@scm-ui/grid-system';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import { MDS_COMPONENT_FIT, ServiceLegStatusEnum } from '@/static';
import { UserActionsEventNameEnum } from '@/components/delivery-plan/static/user-actions-events';

import './styles/update-status.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'update-status',

    i18n,

    components: {
        Row,
    },

    props: {
        deliveryOrder: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            isRequestInProgress: false,
            requestSuccessMessage: '',
            statusModalOpen: true,
            requestErrors: [],
            value: ServiceLegStatusEnum.ACCEPTED,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
    },

    methods: {
        closeStatusModal() {
            this.$emit(UserActionsEventNameEnum.close);
        },
        updateStatusConfirmed() {
            this.$emit('updateStatusConfirmed', ServiceLegStatusEnum.ACCEPTED);
        },
        onChangeSelectedValue(event: CustomEvent) {
            this.value = event.detail.selectedOptions[0]?.value;
            this.$emit('updateStatus', this.value);
        },
    },
});
</script>
