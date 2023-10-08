<template>
    <div class="transport-provider">
        <div class="transport-provider_header-info">
         <div>
            <span>{{ $t('FIELD.EQUIPMENT_NUMBER') }}</span>
            <span>{{ selectedRow.cargoStuffingNumber }}</span>
         </div>
        </div>
       <div class="party-card-header"> <PartyCard :parties="transportlegDetails" data-spec="transport-provider/party-card" /></div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import i18n from '@/i18n';
import { IFclListItem, ILclListItem, ILegDetails } from '@/interfaces';
import { ServicePlanTransportModeDisplayName, getTransportModeIcons} from '@/static';
import { PartyCard } from '@scm-ui/party-card';

import './styles/transport-provider-details.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'TransportProviderDetails',
    i18n,
    components: {
        PartyCard,
    },

    props: {
        selectedRow: {
            type: Object as PropType<IFclListItem |  ILclListItem>,
            required: true,
        },
    },

    computed: {
        transportlegDetails() {
            return this.selectedRow?.legDetails?.map((ele: ILegDetails, index: number) => ({
                title: ele.sequence === 1000 ? i18n.t('DELIVERY_PLAN.EMPTY_RETURN_LEG').toString() : `${i18n.t('DELIVERY_PLAN.LEG').toString()} ${index + 1}`,
                headerIcon: getTransportModeIcons(ele.transportMode),
                details: [
                    { label: i18n.t('FIELD.PROVIDER').toString(), value: ele.transportProvider },
                    { label: i18n.t('FIELD.MODE').toString(), value: ServicePlanTransportModeDisplayName[ele.transportMode] },
                    { label: i18n.t('FIELD.PICKUP_DELIVERY').toString(), value: `${ele.pickUpLocation} - ${ele.dropOffLocation}` },
                ],
            }));
        },
    },
});
</script>
