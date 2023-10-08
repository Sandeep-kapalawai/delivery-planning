<template>
    <div class="transport-provider-field">
        <div v-if="name" class="transport-provider-field_name">{{ name }}</div>
        <div v-if="code" class="transport-provider-field_code">({{ code }})</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';

import './styles/transport-provider-field.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'transport-provider-field',

    props: {
        name: {
            type: String,
            default: '',
        },
        code: {
            type: String,
            default: '',
        },
    },
});
</script>
