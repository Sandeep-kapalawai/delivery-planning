<template>
    <div class="delivery-location">
        <div>{{ label }}</div>
        <div>{{ beCode }}</div>
        <div class="address-lines">
            <div v-for="(line, index) in addressLines" :key="'address-line-' + index">{{ line }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import './styles/delivery-location.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'delivery-location',
    props: {
        label: {
            type: String,
            required: true,
        },
        beCode: {
            type: String,
            required: true,
        },
        addressLines: {
            type: Array,
            required: true,
        },
    },
});
</script>
