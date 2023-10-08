<template>
    <div class="location-cell">
        <div ref="cell" class="location-cell_content">
            <LocationField :be-code="params.value.beCode" :name="params.value.name" />
        </div>

        <div ref="tooltip" class="mdsc-tooltip-content location-cell_tooltip">
            <LocationField :be-code="params.value.beCode" :name="params.value.name" :address="params.value.address" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ICellRendererParams } from 'ag-grid-community';
import tippy from 'tippy.js';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import LocationField from '@/components/location-field/location-field.vue';

import './styles/location-cell.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'location-cell',

    components: {
        LocationField,
    },

    props: {
        params: {
            type: Object as PropType<ICellRendererParams>,
            default: null,
        },
    },

    data() {
        return {
            tippyInstance: undefined,
        };
    },

    mounted() {
        this.tippyInstance = tippy(this.$refs.cell as Element);
        this.tippyInstance.setProps({
            allowHTML: true,
            appendTo: document.body,
            content: this.$refs.tooltip as Element,
            followCursor: true,
            interactive: true,
            placement: 'top',
            theme: 'mdsc',
        });
    },
});
</script>
