<template>
    <div class="bl-number-section">
        <DestinationNotifications :component="NotificationComponentEnum.DP_BL_DETAILS" :position="NotificationPositionEnum.absolute" :top="65" />
        <div class="summary-section">
            <Row :gutter="28">
                <Column class="header-section_column_container">
                    <span>{{ $t('MESSAGE.BL_NUMBER_DETAILS_FOR_SELECTED_EQUIPMENT') }}</span>
                </Column>

                <Column class="searchField_column">
                    <mc-input
                        data-test="bl-details-search/input"
                        type="text"
                        :fit="mdsComponentFit.input"
                        :clearbutton="true"
                        hiddenlabel
                        :placeholder="''"
                        :value.prop="searchQuery"
                        @input="searchQuery = $event.target.value"
                    />
                </Column>

                <Column>
                    <mc-button
                        data-test="blDetails/search-button"
                        variant="primary"
                        placeholder="$t('SEARCH_REFERENCE')"
                        :label="$t('SEARCH')"
                        :fit="mdsComponentFit.button"
                        @click="triggerSearch()"
                    />
                </Column>
            </Row>
        </div>

        <div class="table-wrapper">
            <SCMTable
                :table-id="1"
                :column-defs="columnDefs"
                :is-loading="isFetching || false"
                :row-data="rowData"
                :pagination="true"
                :pagination-drop-down="pageSizeOptions"
                :pagination-page-size="orignalRowData.length"
            />
        </div>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-button';
import '@maersk-global/mds-components-core/mc-input';
import Vue, { PropType } from 'vue';
import i18n from '@/i18n';
import { Row, Column } from '@scm-ui/grid-system';
import { Table as SCMTable } from '@scm-ui/table';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import { getDefaultColDef, getColumnDefs } from './static';
import { ListViewTypeEnum, MDS_COMPONENT_FIT, NotificationComponentEnum, NotificationPositionEnum } from '@/static';
import { getNotificationMessageFromAPIErrors, addNotification, clearNotifications } from 'destination/utilities';
import { IFclListItem, ILclListItem } from '@/interfaces';
import { getDeliveryPlanId } from '@/logic';
import api from '@/data/api';
import { getSubListPageSizeOptions } from '@/store/modules/pagination/static';
import DestinationNotifications from 'destination/components/notifications';

enum NOTIFICATION_ID {
    FETCH_BL_LIST = 'DP_FETCH_BL_LIST',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'BlDetailsSection',

    i18n,

    components: {
        Row,
        Column,
        SCMTable,
        DestinationNotifications,
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
        selectedRow: {
            type: Object as PropType<ILclListItem | IFclListItem>,
            required: true,
        },
    },

    data() {
        return {
            pageSizeOptions: getSubListPageSizeOptions(),
            isFetching: false,
            orignalRowData: [],
            rowData: [],
            searchQuery: '',
            NotificationPositionEnum: NotificationPositionEnum,
            NotificationComponentEnum: NotificationComponentEnum,
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        defaultColDef() {
            return getDefaultColDef({ listViewType: this.listViewType });
        },
        columnDefs() {
            return getColumnDefs({ listViewType: this.listViewType });
        },
    },

    async created() {
        this.fetchList();
    },

    destroyed() {
        clearNotifications(NotificationComponentEnum.DP_BL_DETAILS);
    },

    methods: {
        async fetchList() {
            clearNotifications(NotificationComponentEnum.DP_BL_DETAILS);

            try {
                this.isFetching = true;
                const deliveryPlanId = getDeliveryPlanId(this.listViewType, this.selectedRow);
                const data = await api.fcl.getTransportDocuments(deliveryPlanId);
                this.orignalRowData = this.rowData = Array.isArray(data) ? data : [];
            } catch (error) {
                addNotification(NotificationComponentEnum.DP_BL_DETAILS, getNotificationMessageFromAPIErrors({ error }));
            } finally {
                this.isFetching = false;
            }
        },
        triggerSearch() {
            if (!this.searchQuery) {
                this.rowData = this.orignalRowData;
            } else {
                this.rowData = this.orignalRowData.filter(({ documentNumber }) => documentNumber.match(new RegExp(this.searchQuery, 'i')));
            }
        },
    },
});
</script>
