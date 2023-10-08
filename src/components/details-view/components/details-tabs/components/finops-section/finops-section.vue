<template>
    <div class="finops-section">
        <div class="finops-section__header font--medium"> {{ $t('FINOPS_LINK_INFO') }}</div>
        <div class="finops-section__link" data-spec="FinOpsSection/link">
            <span @click="openExternalUrl">
                <a class="finops-section__view-link">
                    {{ $t('FINOPS_LINK') }}
                    <mc-icon class="finops-section__new-tab" icon="square-arrow-up-right" />
                </a>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { FINOPS_UI_URL } from '@/static';
import Vue from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';

import './styles/finops-section.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'details-tabs-container',
    i18n,
    
    components: {},
    props: {
        cargoStuffingNumber: {
            type: String,
            default: '',
        },
        transportDocumentNumbers: {
            type: String,
            default: '',
        },
    },
    methods: {
        openExternalUrl() {
            window.open(`${FINOPS_UI_URL}?EquipmentNumber=${this.cargoStuffingNumber}&CBLNumber=${this.transportDocumentNumbers}`, '_blank');
        },
    },
});
</script>
