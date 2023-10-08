<template>
    <div>
        <div class="delivery-legs-basic-info">
            <div>
                <span>{{ finalDeliveryLocationLabel.containerNumber }}</span>
                <span>{{ cargoStuffingNumber }}</span>
            </div>
        </div>
        <div>
            <div v-for="(address, key) in locations" :key="key" class="delivery-legs">
                <div class="delivery-legs__header">
                    <div>
                        <span class="mi-20px mi-pin iconbg" aria-hidden="true" />
                    </div>

                    <div>{{ finalDeliveryLocationLabel.deliveryLocation }} {{ key + 1 }}</div>
                </div>

                <div class="delivery-legs__location">
                    <div class="label">{{ finalDeliveryLocationLabel.location }}</div>
                    <div data-spec="finalDeliveryLocation/addressName" class="labelValue">{{ address.name }}</div>
                </div>
                <div class="delivery-legs__location">
                    <div class="label">{{ finalDeliveryLocationLabel.beCode }}</div>

                    <div data-spec="finalDeliveryLocation/addressbeCode" class="labelValue">{{ address.beCode }}</div>
                </div>

                <div class="delivery-legs__location">
                    <div class="label">{{ finalDeliveryLocationLabel.address }}</div>
                    <div class="labelValue">
                        <div v-for="(addr, index) in address.addressLines" :key="index" data-spec="finalDeliveryLocation/addressLines">
                            {{ addr }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import i18n from '@/i18n';
import { IData, IComputed, IMethods, IProps } from './interfaces';
import { IFinalDeliveryLocation } from '@/interfaces';

import './styles/final-delivery-locations.scss';

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'FinalDeliveryLocations',
    data() {
        return {
            finalDeliveryLocationLabel: {
                location: i18n.t('FIELD.LOCATION').toString(),
                beCode: i18n.t('FIELD.BE_CODE').toString(),
                address: i18n.t('FIELD.ADDRESS').toString(),
                containerNumber: i18n.t('FIELD.EQUIPMENT_NUMBER').toString(),
                deliveryLocation: i18n.t('DELIVERY_LOCATION').toString(),
            },
            test: i18n.t('FIELD.FDL').toString(),
        };
    },
    props: {
        index: {
            type: Number,
        },
        cargoStuffingNumber: {
            type: String,
        },
        locations: {
            type: Array as PropType<Array<IFinalDeliveryLocation>>,
        },
    },
});
</script>
