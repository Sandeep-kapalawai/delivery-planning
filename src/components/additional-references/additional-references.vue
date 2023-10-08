<template>
    <div class="additional-references">
        <Row :gutter="24">
            <Column v-for="field in fields" :key="field.fieldId" :xs="12" :md="6" :lg="4" :gutter="24">
                <ReferenceField :field="field" @change="$emit('change', $event)" />
            </Column>
        </Row>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Row, Column } from '@scm-ui/grid-system';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import ReferenceField from './components/reference-field/reference-field.vue';
import { ICustomizableField } from '@/interfaces';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'additional-references',

    components: {
        Row,
        Column,
        ReferenceField,
    },

    props: {
        fields: {
            type: Array as PropType<Array<ICustomizableField>>,
            required: true,
        },
    },
});
</script>
