<template>
    <div>
        <div v-if="level" :class="`priority priority-level-${level}`">
            <div class="priority-circle">&nbsp;</div>
            <div>{{ displayName }} (P{{ level }})</div>
        </div>
        <div v-else>-</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import './styles/priority.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'priority',
    props: {
        level: {
            type: Number,
            default: 0,
        },
        displayName: {
            type: String,
            default: '-',
        },
    },
});
</script>
