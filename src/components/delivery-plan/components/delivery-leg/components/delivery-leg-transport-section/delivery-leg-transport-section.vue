<template>
    <div class="delivery-leg-transport-section">
        <div class="delivery-leg-transport-section_header">{{ $t('FIELD.TRANSPORT') }}</div>

        <Row class="delivery-leg-transport-section_row">
            <Column :xs="12">
                <ButtonGroupSwitch
                    :id="`leg/${legIndex}/transport/mode`"
                    :data-test="`leg/${legIndex}/transport/mode`"
                    :label="$t('FIELD.MODE')"
                    :disabled="isLegSent || disabled"
                    :options="transportModeOptions"
                    :value="leg.transportData.transportMode"
                    @change="setTransportMode({ leg, transportMode: $event.value })"
                />
            </Column>
        </Row>

        <Row class="delivery-leg-transport-section_row">
            <Column :xs="10">
                <TransportProviderPicker
                    :id="`leg/${legIndex}/transport/provider`"
                    :data-test="`leg/${legIndex}/transport/provider/transport-provider-picker`"
                    :disabled="isLegSent || disabled"
                    :required="true"
                    :value="leg.transportData.provider.providerBECode"
                    @change="setTransportProvider({ leg, provider: $event })"
                />
            </Column>
        </Row>

        <Row v-if="leg.transportData.provider.providerBECode" class="delivery-leg-transport-section_row">
            <Column :xs="12">
                <TransportProviderField
                    :data-test="`leg/${legIndex}/transport/provider/transport-provider-field`"
                    :name="leg.transportData.provider.providerName"
                    :code="leg.transportData.provider.providerBECode"
                    :disabled="disabled"
                />
            </Column>
        </Row>

        <Row class="delivery-leg-transport-section_row">
            <Column :xs="12">
                <mc-textarea
                    :data-test="`leg/${legIndex}/transport/additional-instruction`"
                    :fit="mdsComponentFit.textarea"
                    :rows="5"
                    :maxlength="2000"
                    name="additionalInstruction"
                    :label="$t('FIELD.ADDITIONAL_INSTRUCTIONS')"
                    :value.prop="leg.transportData.additionalInstruction"
                    :disabled="disabled"
                    @input="setAdditionalInstruction({ leg, additionalInstruction: $event.target.value })"
                />
            </Column>
        </Row>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-textarea';
import Vue, { PropType } from 'vue';
import { mapMutations } from 'vuex';
import { Row, Column } from '@scm-ui/grid-system';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import ButtonGroupSwitch from '@/components/button-group-switch/button-group-switch.vue';
import TransportProviderField from '@/components/transport-provider-field/transport-provider-field.vue';
import TransportProviderPicker from '@/components/transport-provider-picker/transport-provider-picker.vue';
import { getTransportModeOptions } from '@/components/delivery-plan/static';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanMutationEnum } from '@/store/modules/delivery-plan/static';
import { MDS_COMPONENT_FIT } from '@/static';
import { IServiceLeg } from '@/interfaces';

import './styles/delivery-leg-transport-section.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'delivery-leg-transport-section',

    i18n,

    components: {
        Row,
        Column,
        ButtonGroupSwitch,
        TransportProviderField,
        TransportProviderPicker,
    },

    props: {
        leg: {
            type: Object as PropType<IServiceLeg>,
            required: true,
        },
        legIndex: {
            type: Number,
            required: true,
        },
        isLegSent: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        transportModeOptions() {
            return getTransportModeOptions();
        },
    },

    methods: {
        ...mapMutations(DELIVERY_PLAN_NAMESPACE, {
            setTransportMode: DeliveryPlanMutationEnum.SET_TRANSPORT_MODE,
            setTransportProvider: DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER,
            setAdditionalInstruction: DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION,
        }),
    },
});
</script>
