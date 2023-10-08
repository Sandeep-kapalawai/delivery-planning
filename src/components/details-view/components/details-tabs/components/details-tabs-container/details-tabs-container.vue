<template>
    <div id="tabs" class="details-tabs-container">
        <mc-tab-bar data-test="details-tabs/tab-bar" :currentindex="currentTab.index" fit="medium" @change="onTabChange">
            <mc-tab v-for="(tab, tabIndex) of items" :id="tab.name" :key="tabIndex" slot="tab" :icon="tab.icon" :label="tab.title" />
            <div v-for="item in items" :key="item.id" :slot="item.slot" />
        </mc-tab-bar>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import { calculateDetailsTabFromTabIndex } from './logic';
import { DetailsTabEnum } from '@/static';
import { EventBus, EventBusEventName } from '@/utilities';

import './styles/details-tabs-container.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'details-tabs-container',

    components: {},
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            currentTab: {
                index: 0,
                name: DetailsTabEnum.PurchaseOrders,
            },
        };
    },
    computed: {},

    created() {
        EventBus.$on(EventBusEventName.SCROLL_COMMENTS_SECTION_INTO_VIEW, () => {
            const commentsTabElement = document.querySelector('[label="Comments"]') as HTMLElement;
            commentsTabElement?.click();
            setTimeout(() => {
                const commentList = document.querySelector('[class="comment-list"]') as HTMLElement;
                commentList?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });
    },
    destroyed() {
        EventBus.$off(EventBusEventName.SCROLL_COMMENTS_SECTION_INTO_VIEW);
    },
    methods: {
        onTabChange(event: { detail: number }) {
            this.setSelectedTab(event.detail);
            this.$emit('activated', this.currentTab);
        },
        setSelectedTab(tabIndex: number) {
            this.currentTab = {
                index: tabIndex,
                name: calculateDetailsTabFromTabIndex(tabIndex),
            };
        },
    },
});
</script>
