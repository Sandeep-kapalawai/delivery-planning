<template>
    <div class="column-configurator">
        <mc-icon data-test="column-configurator/column-configurator-icon" icon="cog" @click="toggleColumnConfigurator" />

        <ToolsPanel
            v-if="showColumnConfigurator"
            :title="$t('LIST_VIEW.CUSTOMIZE_COLUMNS').toString()"
            :panel-position="toolPanelPosition"
            :primary-button-label="$t('APPLY').toString()"
            :secondary-button-label="$t('RESET').toString()"
            @close-panel="showColumnConfigurator = false"
            @primary-action="onApplyButtonClick"
            @secondary-action="onResetButtonClick"
        >
            <SCMColumnConfigurator
                :columns="draftColumnDefs"
                :table-theme="draftTheme"
                @configured-columns="onColumnsChange"
                @row-spacing-changed="onRowSpacingChange"
            />
        </ToolsPanel>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '@/i18n';
import { ToolsPanel } from '@scm-ui/tools-panel';
import { ColumnConfigurator as SCMColumnConfigurator } from '@scm-ui/column-configurator';
import { toolPanelPosition } from 'destination/utilities';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import { SCMTableColDef } from '@/interfaces';
import {
    NAMESPACE as TABLE_CONFIGURATION_NAMESPACE,
    TableConfigurationGetterEnum,
    TableConfigurationActionEnum,
} from '@/store/modules/table-configuration/static';

import './styles/column-configurator.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'column-configurator-comp',

    i18n,

    components: {
        ToolsPanel,
        SCMColumnConfigurator,
    },

    props: {
        listViewModule: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            showColumnConfigurator: false,
            draftColumnDefs: [],
            draftTheme: undefined,
        };
    },

    computed: {
        toolPanelPosition() {
            return toolPanelPosition().valueOf();
        },
        columnDefs() {
            return this.$store.getters[`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_COLUMN_DEFS}`];
        },
        theme() {
            return this.$store.getters[`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationGetterEnum.GET_THEME}`];
        },
    },

    watch: {
        columnDefs() {
            this.draftColumnDefs = this.columnDefs;
            this.draftTheme = this.theme;
        },
    },

    methods: {
        toggleColumnConfigurator() {
            if (!this.showColumnConfigurator) {
                this.draftColumnDefs = this.columnDefs;
            }
            this.showColumnConfigurator = !this.showColumnConfigurator;
        },
        onColumnsChange(updatedColumnDefs: Array<SCMTableColDef>) {
            this.draftColumnDefs = updatedColumnDefs;
        },
        onRowSpacingChange(spacing) {
            this.draftTheme = { ...this.draftTheme, spacing };
        },
        onApplyButtonClick() {
            this.$store.dispatch(`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationActionEnum.SET_COLUMN_DEFS}`, {
                columnDefs: this.draftColumnDefs.map((column) => {
                    column.hide = !!column.isHidden;
                    return column;
                }),
            });

            this.$store.dispatch(`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationActionEnum.SET_THEME}`, {
                theme: this.draftTheme,
            });

            this.showColumnConfigurator = false;
        },
        onResetButtonClick() {
            this.$store.dispatch(`${this.listViewModule}/${TABLE_CONFIGURATION_NAMESPACE}/${TableConfigurationActionEnum.RESET_COLUMN_DEFS}`);
            this.showColumnConfigurator = false;
        },
    },
});
</script>
