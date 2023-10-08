<template>
    <div class="button-group-switch" :class="$attrs.class">
        <span class="button-group-switch_label">{{ label }}</span>
        <div class="button-group-switch_button_container">
            <button
                v-for="option in options"
                :key="option.value"
                :data-test="`button-group-switch/button/${option.value}`"
                class="button-group-switch_button"
                :class="{ 'button-group-switch_button--active': option.value === value }"
                :disabled="disabled || option.disabled"
                @click="onButtonClick(option)"
            >
                {{ option.label }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { IData, IMethods, IComputed, IProps, IButtonGroupSwitchOption } from './interfaces';

import './styles/button-group-switch.scss';

enum EventNameEnum {
    change = 'change',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'button-group-switch',

    props: {
        label: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Array as PropType<Array<IButtonGroupSwitchOption>>,
            required: true,
        },
        value: {
            type: [String, Number],
            default: '',
        },
    },

    methods: {
        onButtonClick(option: IButtonGroupSwitchOption) {
            this.$emit(EventNameEnum.change, option);
        },
    },
});
</script>
