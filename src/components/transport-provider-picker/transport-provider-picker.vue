<template>
    <div v-click-outside="() => setListVisible(false)" class="transport-provider-picker">
        <ValidationProvider v-slot="{ errors }" ref="validationProvider" mode="eager" :name="id" :rules="{ required }" :skip-if-empty="skipIfEmpty">
            <mc-input
                :data-test="`${id}/transport-provider-picker/input`"
                type="text"
                :fit="mdsComponentFit.input"
                :name="id"
                :label="label"
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

        <div class="transport-provider-picker_list-container">
            <mc-c-list
                v-if="isListVisible && (!isLoading || (providers && providers.length))"
                ref="listElementReference"
                :data-test="`${id}/transport-provider-picker/list`"
            >
                <template v-if="isMinimumCharactersEntered">
                    <template v-if="providers && providers.length">
                        <mc-c-list-item
                            v-for="provider of providers"
                            :key="provider.partyCode"
                            :data-test="`${id}/transport-provider-picker/list-item/${provider.partyCode}`"
                            @click="onListItemClick(provider)"
                        >
                            <span>{{ provider.partyCode }}</span>
                            <span slot="secondary">{{ provider.partyName }}</span>
                        </mc-c-list-item>
                    </template>

                    <mc-c-list-item v-else :data-test="`${id}/transport-provider-picker/list-item/no-results-message`" disabled>
                        {{ noResultsMessage }}
                    </mc-c-list-item>
                </template>

                <mc-c-list-item v-else :data-test="`${id}/transport-provider-picker/list-item/minimum-characters-message`" disabled>
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
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { debounce, isEmpty } from 'lodash';
import { IData, IMethods, IComputed, IProps } from './interfaces';
import i18n from '@/i18n';
import { MDS_COMPONENT_FIT, NotificationComponentEnum } from '@/static';
import { ITransportProvider } from '@/interfaces';
import api from '@/data/api';
import { getNotificationMessageFromAPIErrors, addNotification, clearNotifications } from 'destination/utilities';

import './styles/transport-provider-picker.scss';

enum EventNameEnum {
    change = 'change',
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
    name: 'transport-provider-picker',

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
            default: i18n.t('FIELD.PROVIDER').toString(),
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
            providers: [],
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
        async fetchTransportProviders(value: string) {
            clearNotifications(NotificationComponentEnum.DP_ROOT);
            
            if (!this.isMinimumCharactersEntered) {
                this.providers = [];
                return;
            }

            try {
                this.isLoading = true;
                this.providers = await api.autocomplete.getTransportProviders({ params: { searchPhrase: value } });
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

            this.syncValue();
            await validationProvider.validate();
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
            await this.fetchTransportProviders(this.inputValue);
        },
        onListItemClick(provider: ITransportProvider) {
            this.$emit(EventNameEnum.change, provider);
            this.validate();
            this.inputValue = provider.partyCode;
            this.providers = [provider];
            this.setListVisible(false);
        },
    },
});
</script>
