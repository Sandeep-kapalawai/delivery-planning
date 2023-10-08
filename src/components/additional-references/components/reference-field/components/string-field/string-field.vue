<template>
    <div class="string-field">
        <ValidationProvider v-slot="{ errors }" :rules="{ required: field.isMandatory }">
            <mc-input
                :id="field.fieldId"
                :fit="mdsComponentFit.input"
                :label="`${field.referenceName} ${field.isMandatory ? '' : $t('FIELD.OPTIONAL')}`"
                :hint="field.referenceDescription"
                :required="field.isMandatory"
                :invalid="errors && errors.length > 0"
                :errormessage="errors && errors[0]"
                :value.prop="field.value"
                @input="onInput"
            />
        </ValidationProvider>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-input';
import Vue, { PropType } from 'vue';
import { ValidationProvider } from 'vee-validate';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import { MDS_COMPONENT_FIT } from '@/static';
import { ICustomizableField } from '@/interfaces';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'string-field',

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

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
    },

    methods: {
        onInput(event: InputEvent) {
            this.$emit('change', (event.target as HTMLInputElement).value || null);
        },
    },
});
</script>
