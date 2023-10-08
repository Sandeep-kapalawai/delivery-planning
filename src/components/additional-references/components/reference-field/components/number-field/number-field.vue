<template>
    <div class="number-field">
        <ValidationProvider v-slot="{ errors }" :rules="{ required: field.isMandatory }">
            <mc-input
                :id="field.fieldId"
                :fit="mdsComponentFit.input"
                type="number"
                inputmode="numeric"
                :label="`${field.referenceName} ${field.isMandatory ? '' : $t('FIELD.OPTIONAL')}`"
                :hint="field.referenceDescription"
                :required="field.isMandatory"
                :min="minValue"
                :max="maxValue"
                :invalid="errors && errors.length > 0"
                :errormessage="errors && errors[0]"
                :value.prop="field.value"
                @keydown="onKeydown"
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
import { MDS_COMPONENT_FIT, CustomizableFieldFormatEnum } from '@/static';
import { ICustomizableField } from '@/interfaces';

// values matching c# integer limitations
export const MAX_VALUE = 2147483647;
export const MIN_VALUE = -2147483647;

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'number-field',

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
        isDecimalAllowed() {
            return this.field.format === CustomizableFieldFormatEnum.DECIMAL;
        },
    },

    data() {
        return {
            minValue: MIN_VALUE,
            maxValue: MAX_VALUE,
        };
    },

    methods: {
        onKeydown(event: KeyboardEvent) {
            // prevent exponential character (69 === e/E)
            if (event.keyCode === 69) {
                event.preventDefault();
            }

            if (!this.isDecimalAllowed) {
                // for integer field prevent decimal separator (190 === '.', 188 === ',')
                if (event.keyCode === 190 || event.keyCode === 188) {
                    event.preventDefault();
                }
            }
        },
        onInput(event: InputEvent) {
            if (event !== undefined) {
                const inputValue = (event.target as HTMLInputElement).value;
                if (inputValue !== '') {
                    let newNumber = this.isDecimalAllowed ? Number.parseFloat(inputValue) : Number.parseInt(inputValue);
                    if (newNumber > MAX_VALUE) {
                        newNumber = MAX_VALUE;
                    } else if (newNumber < MIN_VALUE) {
                        newNumber = MIN_VALUE;
                    }

                    this.$emit('change', newNumber);
                    event.preventDefault();
                } else {
                    this.$emit('change', null);
                    event.preventDefault();
                }
            }
        },
    },
});
</script>
