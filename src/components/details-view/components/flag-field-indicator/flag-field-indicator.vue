<template>
    <text-field :label="label"> <mc-icon v-if="value" icon="check-circle" /></text-field>
</template>

<script lang="ts">
import Vue from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import TextField from 'destination/components/text-field';
import './styles/flag-field-indicator.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'flag-field-indicator',
    components: {
        TextField,
    },
    props: {
        label: {
            type: String,
            required: true,
        },
        value: {
            type: Boolean,
            default: false,
        },
    },
});
</script>
