<template>
    <div class="location-field">
        <div v-if="beCode" class="location-field_becode">{{ beCode }}</div>
        <div v-if="name" class="location-field_name">{{ name }}</div>
        <div v-if="address" class="location-field_address">
            <div v-for="(line, index) in addressLines" :key="index" class="location-field_address-line">{{ line }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { parseAddressLines } from '@/logic';
import Vue from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import './styles/location-field.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'location-field',

    props: {
        beCode: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
    },

    computed: {
        addressLines() {
            return parseAddressLines(this.address);
        },
    },
});
</script>
