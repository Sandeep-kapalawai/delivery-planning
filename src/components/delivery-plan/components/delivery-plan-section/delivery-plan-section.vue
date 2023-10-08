<template>
    <div class="delivery-plan-section">
        <div class="delivery-plan-section_header">
            <div v-if="title" class="delivery-plan-section_header_title">
                {{ title }}
            </div>

            <div v-if="infoText" class="delivery-plan-section_header_icon">
                <mc-tooltip :fit="mdsComponentFit.tooltip">
                    <mc-icon icon="info-circle" />

                    <span slot="content">{{ infoText }}</span>
                </mc-tooltip>
            </div>
        </div>

        <div class="delivery-plan-section_content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-icon';
import '@maersk-global/mds-components-core/mc-tooltip';
import Vue from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { MDS_COMPONENT_FIT } from '@/static';

import './styles/delivery-plan-section.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'delivery-plan-section',

    props: {
        title: {
            type: String,
            default: '',
        },
        infoText: {
            type: String,
            default: '',
        },
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
    },
});
</script>
