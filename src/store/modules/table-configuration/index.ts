import { Module } from 'vuex';
import { clone, isEmpty, debounce } from 'lodash';
import { rearrangeColumnDefinitions, mapColumnDefsForUserPreferences, mapColumnDefsFromUserPreferences } from 'destination/logic';
import { getLoggedInUserDetails } from 'destination/utilities';
import { IRootState } from '@/store/interfaces';
import { IState } from './interfaces';
import { TableConfigurationGetterEnum, TableConfigurationMutationEnum, TableConfigurationActionEnum } from './static';
import { SCMTableColDef, SCMTableTheme } from '@/interfaces';
import api from '@/data/api';

const tableConfiguration: Module<IState, IRootState> = {
    namespaced: true,

    state: () => ({
        initialized: false,
        saveUserPreferencesEnabled: false,
        tableId: '',
        defaultColDef: {},
        originalColumnDefs: [],
        originalColumnDefsMap: new Map(),
        columnDefs: [],
        originalTheme: {} as SCMTableTheme,
        theme: {} as SCMTableTheme,
    }),

    getters: {
        [TableConfigurationGetterEnum.GET_TABLE_ID](state): string {
            return state.tableId;
        },
        [TableConfigurationGetterEnum.GET_DEFAULT_COLUMN_DEF](state): SCMTableColDef {
            return state.defaultColDef;
        },
        [TableConfigurationGetterEnum.GET_COLUMN_DEFS](state): Array<SCMTableColDef> {
            return state.columnDefs;
        },
        [TableConfigurationGetterEnum.GET_THEME](state): SCMTableTheme {
            return state.theme;
        },
    },

    mutations: {
        [TableConfigurationMutationEnum.SET_INITIALIZED](state) {
            state.initialized = true;
        },
        [TableConfigurationMutationEnum.SET_SAVE_USER_PREFERENCES_ENABLED](state, { saveUserPreferencesEnabled }: { saveUserPreferencesEnabled: boolean }) {
            state.saveUserPreferencesEnabled = saveUserPreferencesEnabled;
        },
        [TableConfigurationMutationEnum.SET_TABLE_ID](state, { tableId }: { tableId: string }) {
            state.tableId = tableId;
        },
        [TableConfigurationMutationEnum.SET_DEFAULT_COLUMN_DEF](state, { defaultColDef }: { defaultColDef: SCMTableColDef }) {
            state.defaultColDef = clone(defaultColDef);
        },
        [TableConfigurationMutationEnum.SET_ORIGINAL_COLUMN_DEFS](state, { columnDefs }: { columnDefs: Array<SCMTableColDef> }) {
            const colDefs = columnDefs.map((column) => clone(column));
            state.originalColumnDefs = colDefs;
            state.originalColumnDefsMap = new Map(colDefs.map((item: SCMTableColDef) => [item.name as string, item]));
        },
        [TableConfigurationMutationEnum.SET_COLUMN_DEFS](state, { columnDefs }: { columnDefs: Array<SCMTableColDef> }) {
            state.columnDefs = clone(columnDefs).map((column) => clone(column));
        },
        [TableConfigurationMutationEnum.SET_ORIGINAL_THEME](state, { theme }: { theme: SCMTableTheme }) {
            state.originalTheme = theme;
        },
        [TableConfigurationMutationEnum.SET_THEME](state, { theme }: { theme: SCMTableTheme }) {
            state.theme = theme;
        },
    },

    actions: {
        async [TableConfigurationActionEnum.INITIALIZE](
            { state, commit, dispatch },
            {
                saveUserPreferencesEnabled,
                tableId,
                defaultColDef,
                columnDefs,
                theme,
            }: { saveUserPreferencesEnabled: boolean; tableId: string; defaultColDef: SCMTableColDef; columnDefs: Array<SCMTableColDef>; theme: SCMTableTheme },
        ) {
            if (!state.initialized) {
                commit(TableConfigurationMutationEnum.SET_SAVE_USER_PREFERENCES_ENABLED, { saveUserPreferencesEnabled });
                commit(TableConfigurationMutationEnum.SET_TABLE_ID, { tableId });
                commit(TableConfigurationMutationEnum.SET_DEFAULT_COLUMN_DEF, { defaultColDef });
                commit(TableConfigurationMutationEnum.SET_ORIGINAL_COLUMN_DEFS, { columnDefs });
                commit(TableConfigurationMutationEnum.SET_ORIGINAL_THEME, { theme });

                // Fetching saved user preferences
                const { savedColumnDefs, savedTheme }: { savedColumnDefs: Array<SCMTableColDef>; savedTheme: SCMTableTheme } = await dispatch(
                    TableConfigurationActionEnum.FETCH_USER_PREFERENCES,
                );
                commit(TableConfigurationMutationEnum.SET_COLUMN_DEFS, { columnDefs: savedColumnDefs?.length ? savedColumnDefs : columnDefs });
                commit(TableConfigurationMutationEnum.SET_THEME, { theme: !isEmpty(savedTheme) ? savedTheme : theme });
                commit(TableConfigurationMutationEnum.SET_INITIALIZED);
            }
        },
        async [TableConfigurationActionEnum.FETCH_USER_PREFERENCES]({ state }): Promise<{ savedColumnDefs: Array<SCMTableColDef>; savedTheme: SCMTableTheme }> {
            if (!state.saveUserPreferencesEnabled) {
                return { savedColumnDefs: [], savedTheme: {} as SCMTableTheme };
            }

            try {
                const userDetails = getLoggedInUserDetails();
                const data = await api.userPreferences.getUserFavourites({
                    params: {
                        applicationName: 'SCM',
                        customerCode: '100INTMSL',
                        userEmail: userDetails?.emailAddress,
                        componentName: state.tableId,
                    },
                });
                const { columnDefs: savedColumnDefs, theme: savedTheme }: { columnDefs: Array<SCMTableColDef>; theme: SCMTableTheme } = data
                    ? JSON.parse(data?.favouritesData)
                    : [];

                return {
                    savedColumnDefs: mapColumnDefsFromUserPreferences({ savedColumnDefs, originalColumnDefsMap: state.originalColumnDefsMap }),
                    savedTheme,
                };
            } catch (error: any) {
                console.error(error);
                return { savedColumnDefs: [], savedTheme: {} as SCMTableTheme };
            }
        },
        [TableConfigurationActionEnum.SAVE_USER_PREFERENCES]: debounce(async ({ state }) => {
            if (!state.saveUserPreferencesEnabled) {
                return;
            }

            try {
                const userDetails = getLoggedInUserDetails();
                await api.userPreferences.saveUserFavourites({
                    applicationName: 'SCM',
                    customerCode: '100INTMSL',
                    userEmail: userDetails?.emailAddress,
                    componentName: state.tableId,
                    favouritesData: JSON.stringify({ columnDefs: mapColumnDefsForUserPreferences({ columnDefs: state.columnDefs }), theme: state.theme }),
                });
            } catch (error: any) {
                console.error(error);
            }
        }, 100),
        [TableConfigurationActionEnum.SET_COLUMN_DEFS]({ commit, dispatch }, { columnDefs }: { columnDefs: Array<SCMTableColDef> }) {
            commit(TableConfigurationMutationEnum.SET_COLUMN_DEFS, { columnDefs });
            dispatch(TableConfigurationActionEnum.SAVE_USER_PREFERENCES);
        },
        [TableConfigurationActionEnum.REARRANGE_COLUMN_DEFS]({ state, commit, dispatch }, { columnDefs }: { columnDefs: Array<SCMTableColDef> }) {
            commit(TableConfigurationMutationEnum.SET_COLUMN_DEFS, {
                columnDefs: rearrangeColumnDefinitions({
                    columnDefs,
                    originalColumnDefsMap: state.originalColumnDefsMap,
                }),
            });
            dispatch(TableConfigurationActionEnum.SAVE_USER_PREFERENCES);
        },
        [TableConfigurationActionEnum.SET_THEME]({ commit, dispatch }, { theme }: { theme: SCMTableTheme }) {
            commit(TableConfigurationMutationEnum.SET_THEME, { theme });
            dispatch(TableConfigurationActionEnum.SAVE_USER_PREFERENCES);
        },
        [TableConfigurationActionEnum.RESET_COLUMN_DEFS]({ state, commit, dispatch }) {
            commit(TableConfigurationMutationEnum.SET_COLUMN_DEFS, { columnDefs: state.originalColumnDefs });
            commit(TableConfigurationMutationEnum.SET_THEME, { theme: state.originalTheme });
            dispatch(TableConfigurationActionEnum.SAVE_USER_PREFERENCES);
        },
    },
};

export default tableConfiguration;
