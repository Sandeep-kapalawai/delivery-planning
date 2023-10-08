<template>
    <div class="saved-filter-card-item" :class="{ active: isSelected }">
        <div class="saved-filter-card" data-test="saved-filter-card">
            <mc-tooltip :fit="mdsComponentFit.tooltip" data-test="saved-filter-item/saved-filter-card/tooltip">
                <span slot="content" class="tooltip">{{ savedFilterItem.name }}</span>
                <div class="saved-filter-card_labels">
                    <div class="saved-filter-name" data-test="saved-filter-item/saved-filter-card/saved-filter-name">
                        <span>{{ savedFilterItem.name }}</span>
                        <mc-tag v-if="savedFilterItem.isUserDefault" :label="$t('FILTERS.DEFAULT')" :fit="mdsComponentFit.tag"> </mc-tag>
                    </div>
                </div>
            </mc-tooltip>
            <div class="action-buttons">
                <mc-button
                    variant="outlined"
                    data-test="saved-filter-item/saved-filter-card/apply-saved-filter-button"
                    icon="check-circle"
                    hiddenlabel
                    :fit="mdsComponentFit.button"
                    @click="handleApplySavedFilter"
                />
                <OverflowMenu
                    :dropdown-options="actionsItems"
                    data-test="saved-filter-item/saved-filter-card/overflow-menu"
                    @handle-action-click="handleActionItems"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import '@maersk-global/mds-components-core/mc-tag';
import '@maersk-global/mds-components-core/mc-tooltip';
import i18n from '@/i18n';
import Vue, { PropType } from 'vue';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import { ListViewTypeEnum, MDS_COMPONENT_FIT } from '@/static';
import { OverflowMenu } from '@scm-ui/overflow-menu';
import { ISavedFilterItem } from '@/interfaces';

import './styles/saved-filter-item.scss';

enum EventNameEnum {
    onSavedFilterDelete = 'on-saved-filter-delete',
    onsavedFilterApplied = 'on-saved-filter-applied',
    onSetAsDefault = 'on-set-as-default',
    onUnsetAsDefault = 'on-unset-as-default',
}
export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'saved-filter-item',
    i18n,
    components: {
        OverflowMenu,
    },
    props: {
        listViewType: {
            type: String as PropType<ListViewTypeEnum>,
            default: ListViewTypeEnum.fcl,
        },
        savedFilterItem: {
            type: Object as PropType<ISavedFilterItem>,
            required: true,
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        handleApplySavedFilter() {
            this.$emit(EventNameEnum.onsavedFilterApplied, this.savedFilterItem);
        },
        handleActionItems(event: any) {
            event.actionMethod();
        },
    },
    computed: {
        actionsItems() {
            return [
                {
                    label: i18n.t('FILTERS.DELETE_FILTER').toString(),
                    actionMethod: () => {
                        this.$emit(EventNameEnum.onSavedFilterDelete, this.savedFilterItem);
                    },
                },
                {
                    label: this.savedFilterItem.isUserDefault ? i18n.t('FILTERS.REMOVE_AS_DEFAULT').toString() : i18n.t('FILTERS.SET_AS_DEFAULT').toString(),
                    actionMethod: () => {
                        if (this.savedFilterItem.isUserDefault) {
                            this.$emit(EventNameEnum.onUnsetAsDefault, this.savedFilterItem);
                        } else {
                            this.$emit(EventNameEnum.onSetAsDefault, this.savedFilterItem);
                        }
                    },
                },
            ];
        },
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
    },
});
</script>
