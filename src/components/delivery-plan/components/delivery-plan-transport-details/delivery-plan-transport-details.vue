<template>
    <div class="delivery-plan-transport-details">
        <Row class="delivery-plan-transport-details_row">
            <Column :xs="12">
                <div class="delivery-plan-transport-details_fields">
                    <ButtonGroupSwitch
                        data-test="delivery-plan-type"
                        :label="$t('FIELD.DELIVERY_PLAN_TYPE')"
                        :options="deliveryPlanTypeOptions"
                        :value="deliveryPlan.response.deliveryPlanType"
                        @change="setDeliveryPlanType({ plan: deliveryPlan.response, deliveryPlanType: $event.value })"
                    />
                </div>
            </Column>
        </Row>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapMutations } from 'vuex';
import { Row, Column } from '@scm-ui/grid-system';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import ButtonGroupSwitch from '@/components/button-group-switch/button-group-switch.vue';
import { getDeliveryPlanTypeOptions } from '@/components/delivery-plan/static';
import { NAMESPACE as DELIVERY_PLAN_NAMESPACE, DeliveryPlanMutationEnum } from '@/store/modules/delivery-plan/static';
import { IServicePlan } from '@/interfaces';

import './styles/delivery-plan-transport-details.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'delivery-plan-transport-details',

    i18n,

    components: {
        Row,
        Column,
        ButtonGroupSwitch,
    },

    props: {
        deliveryPlan: {
            type: Object as PropType<{ response: IServicePlan }>,
            required: true,
        },
    },

    computed: {
        deliveryPlanTypeOptions() {
            return getDeliveryPlanTypeOptions();
        },
    },

    methods: {
        ...mapMutations(DELIVERY_PLAN_NAMESPACE, {
            setDeliveryPlanType: DeliveryPlanMutationEnum.SET_DELIVERY_PLAN_TYPE,
        }),
    },
});
</script>
