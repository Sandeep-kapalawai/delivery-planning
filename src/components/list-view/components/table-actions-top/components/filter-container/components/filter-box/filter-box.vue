<template>
    <div class="filter-box">
        <Row :gutter="16" :columns="12" :lg="12" :md="12" :xs="12">
            <Column v-for="(field, index) of fieldsToRender" :key="index" :xs="12" :md="12" :lg="12" :columns="12" :gutter="0">
                <FilterField :field="field" :filter-state="filterState" @filterFieldChange="onFilterFieldChange" />
            </Column>
        </Row>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Row, Column } from '@scm-ui/grid-system';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import { IAppliedFilters, IFilterField, IFilterFieldChangeEvent } from '@/interfaces';
import FilterField from '../filter-field/filter-field.vue';

import './styles/filter-box.scss';

enum EventNameEnum {
    filterFieldChange = 'filterFieldChange',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'filter-box',

    components: {
        Row,
        Column,
        FilterField,
    },

    props: {
        fields: {
            type: Array as PropType<Array<IFilterField>>,
            required: true,
        },
        filterState: {
            type: Object as PropType<IAppliedFilters>,
            required: false,
            default: () => {},
        },
    },

    computed: {
        fieldsToRender() {
            return this.fields;
        },
    },

    methods: {
        onFilterFieldChange(event: IFilterFieldChangeEvent) {
            this.$emit(EventNameEnum.filterFieldChange, event);
        },
    },
});
</script>
