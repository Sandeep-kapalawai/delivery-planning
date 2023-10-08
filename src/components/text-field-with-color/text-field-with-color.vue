<template>
    <div class="text-field-with-color" :style="computedStyle">
        <div class="text-field-with-color_label text-grey">{{ label }}</div>
        <div class="text-field-with-color_value">
            <div class="text-field-with-color_value_circle">&nbsp;</div>
            <span>{{ formattedValue }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { formatValueIfEmpty } from 'destination/utilities';
import { IData, IMethods, IComputed, IProps } from './interfaces';

import './styles/text-field-with-color.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'text-field-with-color',

    props: {
        label: {
            type: String,
            required: true,
        },
        value: {
            type: [String, Number],
            default: '',
        },
        color: {
            type: String,
            default: '',
        },
    },

    computed: {
        formattedValue() {
            return formatValueIfEmpty(this.value);
        },
        computedStyle() {
            return {
                '--text-field-value-color': this.color,
            };
        },
    },
});
</script>
