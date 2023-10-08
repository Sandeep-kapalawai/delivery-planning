<template>
    <div class="boolean-field">
        <div class="boolean-field_mc-select">
            <ValidationProvider v-slot="{ errors }" mode="eager" :rules="{ required: field.isMandatory }">
                <mc-select
                    :id="field.fieldId"
                    v-model="vModelValue"
                    :fit="mdsComponentFit.select"
                    :label="`${field.referenceName} ${field.isMandatory ? '' : $t('FIELD.OPTIONAL')}`"
                    :hint="field.referenceDescription"
                    :options.prop="options"
                    :required="field.isMandatory"
                    :invalid="errors && errors.length > 0"
                    :errormessage="errors && errors[0]"
                    :value.prop="vModelValue"
                    @change="onChange"
                />
            </ValidationProvider>
        </div>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-select';
import Vue, { PropType } from 'vue';
import { ValidationProvider } from 'vee-validate';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import { MDS_COMPONENT_FIT } from '@/static';
import { ICustomizableField } from '@/interfaces';

import './styles/boolean-field.scss';

const OPTIONS: Array<{ label: string; value: string }> = [
    { label: i18n.t('YES').toString(), value: 'true' },
    { label: i18n.t('NO').toString(), value: 'false' },
];

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'boolean-field',

    i18n,

    components: {
        ValidationProvider,
    },

    props: {
        field: {
            type: Object as PropType<ICustomizableField>,
            required: true,
        },
    },

    data() {
        const selectedValue = OPTIONS.find((option) => option.value === this.field.value);
        return {
            options: OPTIONS,
            vModelValue: selectedValue ? [selectedValue] : undefined,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
    },

    methods: {
        onChange(event: CustomEvent) {
            const selectedOption = event.detail.selectedOptions[0];
            this.vModelValue = selectedOption ? [selectedOption] : undefined;
            this.$emit('change', selectedOption?.value || null);
        },
    },
});
</script>
