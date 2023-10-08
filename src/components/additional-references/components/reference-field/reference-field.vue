<template>
    <div class="reference-field">
        <BooleanField v-if="field.format === CustomizableFieldFormatEnum.BOOLEAN" :field="field" @change="onChange" />
        <DateTimeField
            v-else-if="field.format === CustomizableFieldFormatEnum.DATE || field.format === CustomizableFieldFormatEnum.DATETIME"
            :field="field"
            @change="onChange"
        />
        <NumberField
            v-else-if="field.format === CustomizableFieldFormatEnum.INTEGER || field.format === CustomizableFieldFormatEnum.DECIMAL"
            :field="field"
            @change="onChange"
        />
        <StringField v-else-if="field.format === CustomizableFieldFormatEnum.STRING" :field="field" @change="onChange" />
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import BooleanField from './components/boolean-field/boolean-field.vue';
import DateTimeField from './components/date-time-field/date-time-field.vue';
import NumberField from './components/number-field/number-field.vue';
import StringField from './components/string-field/string-field.vue';
import i18n from '@/i18n';
import { CustomizableFieldFormatEnum } from '@/static';
import { ICustomizableField } from '@/interfaces';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'reference-field',

    i18n,

    components: {
        BooleanField,
        DateTimeField,
        NumberField,
        StringField,
    },

    props: {
        field: {
            type: Object as PropType<ICustomizableField>,
            required: true,
        },
    },

    data() {
        return {
            CustomizableFieldFormatEnum,
        };
    },

    methods: {
        onChange(value: any) {
            this.$emit('change', { ...this.field, value: value !== null ? new String(value) : null } as ICustomizableField);
        },
    },
});
</script>
