<template>
    <div v-click-outside="() => setListVisible(false)" class="location-picker" :class="{ 'hide-label': hideLabel }">
        <ValidationProvider v-slot="{ errors }" ref="validationProvider" mode="eager" :name="id" :rules="{ required, ...rules }" :skip-if-empty="skipIfEmpty">
            <mc-input
                :data-test="`${id}/location-picker/input`"
                type="text"
                :fit="mdsComponentFit.input"
                :name="id"
                :label="hideLabel ? '' : label"
                :placeholder="placeholder"
                :clearbutton="true"
                :loading="isLoading"
                :disabled="disabled"
                :required="required"
                :invalid="errors && errors.length > 0"
                :errormessage="errors && errors[0]"
                :value="inputValue"
                @input="onInput"
                @click="setListVisible(true)"
                @focus="setListVisible(true)"
                @blur="validate"
            />
        </ValidationProvider>

        <div class="location-picker_list-container" :class="{ 'hide-label': hideLabel }">
            <mc-c-list
                v-if="isListVisible && (!isLoading || (locations && locations.length))"
                ref="listElementReference"
                :data-test="`${id}/location-picker/list`"
            >
                <template v-if="isMinimumCharactersEntered">
                    <template v-if="locations && locations.length">
                        <mc-c-list-item
                            v-for="(location, index) in locations"
                            :key="'location-option-' + index"
                            :data-test="`${id}/location-picker/list-item/${location.facilityCode}`"
                            @click="onListItemClick(location)"
                        >
                            <span>{{ location.displayName }} - {{ location.facilityCode }}</span>
                            <span slot="secondary">{{ location.displayText }}</span>
                        </mc-c-list-item>
                    </template>

                    <mc-c-list-item v-else :data-test="`${id}/location-picker/list-item/no-results-message`" disabled>
                        {{ noResultsMessage }}
                    </mc-c-list-item>
                </template>

                <mc-c-list-item v-else :data-test="`${id}/location-picker/list-item/minimum-characters-message`" disabled>
                    {{ minimumCharactersMessage }}
                </mc-c-list-item>
            </mc-c-list>
        </div>
    </div>
</template>

<script lang="ts">
import '@maersk-global/mds-components-core/mc-input';
import '@maersk-global/mds-components-community/mc-c-list';
import '@maersk-global/mds-components-community/mc-c-list-item';
import Vue from 'vue';
import { CombinedVueInstance } from 'vue/types/vue';
import { ValidationProvider } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { debounce, isEmpty } from 'lodash';
import { getNotificationMessageFromAPIErrors, addNotification, clearNotifications } from 'destination/utilities';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import { ILocationFullAddress } from '@/interfaces';
import { MDS_COMPONENT_FIT, NotificationComponentEnum } from '@/static';
import api from '@/data/api';

import './styles/location-picker.scss';

enum EventNameEnum {
    change = 'change',
    clear = 'clear',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'location-picker',

    components: {
        ValidationProvider,
    },

    props: {
        id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: i18n.t('FIELD.LOCATION').toString(),
        },
        hideLabel: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
        rules: {
            type: Object,
            default: () => {},
        },
        skipIfEmpty: {
            type: Boolean,
            default: false,
        },
        value: {
            type: String,
            default: '',
        },
        minimumCharacters: {
            type: Number,
            default: 4,
            validator(value: number) {
                return value > 0;
            },
        },
        minimumCharactersMessage: {
            type: String,
            default: i18n.t('MESSAGE.MINIMUM_CHARACTERS_MESSAGE').toString(),
        },
        noResultsMessage: {
            type: String,
            default: i18n.t('MESSAGE.NO_RESULTS_MESSAGE').toString(),
        },
        listMaxHeight: {
            type: String,
            default: '400px',
        },
    },

    data() {
        return {
            isLoading: false,
            isListVisible: false,
            inputValue: '',
            locations: [],
        };
    },

    computed: {
        mdsComponentFit() {
            return MDS_COMPONENT_FIT;
        },
        isMinimumCharactersEntered() {
            return this.inputValue?.length >= this.minimumCharacters;
        },
    },

    watch: {
        value() {
            this.inputValue = this.value;
            this.validate();
        },
    },

    created() {
        this.inputValue = this.value;
    },

    mounted() {
        this.syncValue();
    },

    async updated() {
        await this.$nextTick();
        this.setListMaxHeight();
    },

    methods: {
        async fetchLocations(value: string) {
            clearNotifications(NotificationComponentEnum.DP_ROOT);

            if (!this.isMinimumCharactersEntered) {
                this.locations = [];
                return;
            }

            try {
                this.isLoading = true;
                this.locations = await api.autocomplete.getLocationFullAddress({ params: { searchPhrase: value } });
            } catch (error) {
                addNotification(NotificationComponentEnum.DP_ROOT, getNotificationMessageFromAPIErrors({ error }));
            } finally {
                this.isLoading = false;
            }
        },
        syncValue() {
            const validationProvider = this.$refs.validationProvider as InstanceType<typeof ValidationProvider>;
            if (!validationProvider) {
                return;
            }

            validationProvider.syncValue(this.value);
        },
        async validate() {
            const validationProvider = this.$refs.validationProvider as InstanceType<typeof ValidationProvider>;
            if (!validationProvider) {
                return;
            }

            this.$nextTick(async () => {
                this.syncValue();
                await validationProvider.validate();
            });
        },
        setListVisible(isVisible: boolean) {
            this.isListVisible = isVisible;
        },
        setListMaxHeight() {
            const listElementReferenceHost = (this.$refs.listElementReference as Element)?.shadowRoot?.firstElementChild as HTMLElement;
            if (!listElementReferenceHost) {
                return;
            }

            listElementReferenceHost.style.overflow = 'auto';
            listElementReferenceHost.style.maxHeight = this.listMaxHeight;
        },
        onInput: debounce(async function (this: CombinedVueInstance<Vue, IData, IMethods, IComputed, Readonly<IProps>>, event: InputEvent) {
            const value = (event.target as HTMLInputElement).value;
            if (isEmpty(value)) {
                this.$emit(EventNameEnum.change, undefined);
                this.validate();
            }

            await this.setInputValue(value);
            this.setListVisible(true);
        }, 300),
        async setInputValue(value: string) {
            if (this.inputValue === value) {
                return;
            }

            this.inputValue = value;
            if (!value) {
                this.$emit(EventNameEnum.clear);
            }

            await this.fetchLocations(this.inputValue);
        },
        onListItemClick(location: ILocationFullAddress) {
            this.$emit(EventNameEnum.change, location);
            this.validate();
            this.inputValue = location.facilityCode;
            this.locations = [location];
            this.setListVisible(false);
        },
    },
});
</script>
