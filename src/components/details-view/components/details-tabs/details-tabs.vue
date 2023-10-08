<template>
    <div class="details">
        <DetailsTabsContainer :items="tabs" @activated="handleActivated" />

        <PurchaseOrders
            v-if="activeTab.name === 'PurchaseOrders'"
            :notification-component="NotificationComponentEnum.DP_DETAILS_PAGE"
            :list-view-type="viewType"
            :list-view-module="viewModule"
            :selected-row="details.result"
        />

        <FinOpsSection
            v-if="activeTab.name === 'FinOps'"
            :cargo-stuffing-number="details.result.cargoStuffingNumber"
            :transport-document-numbers="details.result.transportDocumentNumber"
        />

        <CommentsComponent
            v-if="activeTab.name === 'Comments'"
            data-test="comments-section/comments-component"
            :filter-fields="filterFields"
            :comments="comments.result"
            :comments-total-count="comments.resultTotalCount"
            :is-comments-fetching="comments.isFetching"
            :is-add-comment-enabled="isAddCommentEnabled"
            :is-adding-comment="addComment.isRequestInProgress"
            :is-filters-enabled="false"
            :is-pagination-enabled="false"
            @addComment="onAddComment"
        />
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { getNotificationMessageFromAPIErrors, addNotification, removeNotification } from 'destination/utilities';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { getDetailsTabs, getFilters } from './static';
import DetailsTabsContainer from './components/details-tabs-container/details-tabs-container.vue';
import FinOpsSection from './components/finops-section/finops-section.vue';
import PurchaseOrders from '../../../list-view/components/purchase-orders/purchase-orders.vue';
import { DetailsTabEnum, ListViewTypeEnum, RelatedObjectTypeEnum, NotificationComponentEnum } from '@/static';
import { ICargoStuffingDetails, ICommentAppliedFilters } from '@/interfaces';
import { listViewTypeSpecificAction } from '@/logic';
import { NAMESPACE as COMMENTS_NAMESPACE, CommentsGetterEnum, CommentsActionEnum } from '@/store/modules/comments/static';

import './styles/details-tabs.scss';

enum NOTIFICATION_ID {
    FETCH_COMMENTS = 'DP_DETAILS_FETCH_COMMENTS',
    ADD_COMMENT = 'DP_DETAILS_ADD_COMMENT',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'details-tabs',

    components: {
        DetailsTabsContainer,
        CommentsComponent: () => import('destination/components/comments'),
        PurchaseOrders,
        FinOpsSection,
    },

    props: {
        id: {
            type: [Number, String],
            required: true,
        },
        viewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
        viewModule: {
            type: String,
            required: true,
        },
        details: {
            type: Object as PropType<{ result: ICargoStuffingDetails }>,
            required: true,
        },
    },

    data() {
        return {
            NotificationComponentEnum: NotificationComponentEnum,
            activeTab: {
                index: 0,
                name: DetailsTabEnum.PurchaseOrders,
            },
            isAddCommentEnabled: true,
        };
    },

    computed: {
        tabs() {
            return getDetailsTabs();
        },
        objectType() {
            return listViewTypeSpecificAction(this.viewType, {
                [ListViewTypeEnum.fcl]: () => {
                    return RelatedObjectTypeEnum.CargoStuffing;
                },
                [ListViewTypeEnum.lcl]: () => {
                    return RelatedObjectTypeEnum.TransportDocument;
                },
            });
        },
        filterFields() {
            return getFilters();
        },
        appliedFilters() {
            return this.$store.getters[`${this.viewModule}/${COMMENTS_NAMESPACE}/${CommentsGetterEnum.GET_APPLIED_FILTERS}`];
        },
        comments() {
            return this.$store.getters[`${this.viewModule}/${COMMENTS_NAMESPACE}/${CommentsGetterEnum.GET_COMMENTS}`];
        },
        addComment() {
            return this.$store.getters[`${this.viewModule}/${COMMENTS_NAMESPACE}/${CommentsGetterEnum.GET_ADD_COMMENT}`];
        },
    },

    watch: {
        appliedFilters() {
            this.fetchComments();
        },
    },

    methods: {
        handleActivated(tab) {
            this.activeTab = tab;
            if (tab.name === 'Comments') {
                this.fetchComments();
            }
        },
        async fetchComments() {
            removeNotification(NotificationComponentEnum.DP_DETAILS_PAGE, NOTIFICATION_ID.FETCH_COMMENTS);

            try {
                await this.$store.dispatch(`${this.viewModule}/${COMMENTS_NAMESPACE}/${CommentsActionEnum.FETCH_COMMENTS}`, { deliveryPlanId: this.id });
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, getNotificationMessageFromAPIErrors({ id: NOTIFICATION_ID.FETCH_COMMENTS, error }));
            }
        },
        async onLoadMoreComments() {
            removeNotification(NotificationComponentEnum.DP_DETAILS_PAGE, NOTIFICATION_ID.FETCH_COMMENTS);

            try {
                await this.$store.dispatch(`${this.viewModule}/${COMMENTS_NAMESPACE}/${CommentsActionEnum.LOAD_MORE_COMMENTS}`, { deliveryPlanId: this.id });
            } catch (error: any) {
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, getNotificationMessageFromAPIErrors({ id: NOTIFICATION_ID.FETCH_COMMENTS, error }));
            }
        },
        async onAddComment(comment: string) {
            removeNotification(NotificationComponentEnum.DP_DETAILS_PAGE, NOTIFICATION_ID.ADD_COMMENT);

            try {
                await this.$store.dispatch(`${this.viewModule}/${COMMENTS_NAMESPACE}/${CommentsActionEnum.ADD_COMMENT}`, {
                    deliveryPlanId: this.id,

                    comment,
                });
                this.fetchComments();
            } catch (error) {
                addNotification(NotificationComponentEnum.DP_DETAILS_PAGE, getNotificationMessageFromAPIErrors({ id: NOTIFICATION_ID.ADD_COMMENT, error }));
            }
        },
        onFilterChange(appliedFilters: ICommentAppliedFilters) {
            this.$store.dispatch(`${this.viewModule}/${COMMENTS_NAMESPACE}/${CommentsActionEnum.SET_APPLIED_FILTERS}`, { appliedFilters });
        },
    },
});
</script>
