<template>
    <div class="update-details-section">
        <div class="update-details-section_header">
            <div v-if="title" class="update-details-section_header_title">
                <strong>{{ title }}</strong>
            </div>
        </div>

        <div class="update-details-section_content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';

import './styles/update-details-section.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'update-details-section',

    props: {
        title: {
            type: String,
            default: '',
        },
    },
});
</script>
