<template>
    <div class="table-actions-top">
        <Row class="table-actions-top_row" :gutter="16" :columns="12" :lg="12" :md="12" :xs="12">
            <Column class="table-actions-top_row_column" :xs="12" :md="7" :lg="7" :columns="12" :gutter="0">
                <FilterContainer :list-view-type="listViewType" />
            </Column>

            <Column class="table-actions-top_row_column" :xs="12" :md="5" :lg="5" :columns="12" :gutter="0">
                <div class="table-actions-top_import-export-wrapper">
                    <ImportExport :list-view-module="listViewModule" />
                </div>

                <div class="table-actions-top_column-configurator-wrapper">
                    <ColumnConfigurator :list-view-module="listViewModule" />
                </div>

                <div class="table-actions-top_pagination-wrapper">
                    <PaginationComponent :list-view-module="listViewModule" />
                </div>
            </Column>
        </Row>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-button';
import '@maersk-global/mds-components-core/mc-select';
import Vue, { PropType } from 'vue';
import { Row, Column } from '@scm-ui/grid-system';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import FilterContainer from './components/filter-container/filter-container.vue';
import ImportExport from './components/import-export/import-export.vue';
import ColumnConfigurator from '@/components/column-configurator/column-configurator.vue';
import PaginationComponent from '@/components/pagination/pagination.vue';
import { ListViewTypeEnum } from '@/static';

import './styles/table-actions-top.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'table-actions-top',

    components: {
        Row,
        Column,
        PaginationComponent,
        ColumnConfigurator,
        FilterContainer,
        ImportExport,
    },

    props: {
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
        listViewModule: {
            type: String,
            required: true,
        },
    },
});
</script>
