//@ts-nocheck
import tableConfiguration from '.';
import { mapColumnDefsForUserPreferences } from 'destination/logic';
import * as destinationUtilities from 'destination/utilities';
import { IState } from './interfaces';
import { TableConfigurationGetterEnum, TableConfigurationMutationEnum, TableConfigurationActionEnum } from './static';
import { SCMTableColDef, SCMTableTheme } from '@/interfaces';
import api from '@/data/api';

const MOCK_USER_PREFERENCE_RESPONSE = {
    componentName: 'TEST_TABLE_ID',
    customerCode: 'TEST_CUSTOMER_CODE',
    userEmail: 'test_user@maersk.com',
    applicationName: 'SCM',
    favouritesData: JSON.stringify({
        columnDefs: [
            {
                name: 'Test1',
                headerName: 'Test1',
                field: 'Test1',
                colWidth: 100,
            },
        ] as Array<SCMTableColDef>,
        theme: {
            spacing: 'compact',
        } as SCMTableTheme,
    }),
};
const MOCK_DEFAULT_COL_DEF: SCMTableColDef = { name: 'Test1', headerName: 'Test1' };
const MOCK_COLUMN_DEFS: Array<SCMTableColDef> = [{ name: 'Test1', headerName: 'Test1', field: 'Test1' }];
const MOCK_THEME: SCMTableTheme = { spacing: 'default' };

const createState = (overrides?: Partial<IState>): IState => ({
    initialized: false,
    saveUserPreferencesEnabled: false,
    tableId: '',
    columnDefs: [],
    defaultColDef: {},
    originalColumnDefs: [],
    originalColumnDefsMap: new Map(),
    originalTheme: {},
    theme: {},
    ...overrides,
});

beforeAll(() => {
    jest.useFakeTimers();
});

beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(destinationUtilities, 'getLoggedInUserDetails').mockReturnValue({ emailAddress: 'test_user@maersk.com' });
});

afterAll(() => {
    jest.clearAllMocks();
});

describe('state', () => {
    it('returns a default state', () => {
        expect(tableConfiguration.state()).toEqual(createState());
    });
});

describe('getters', () => {
    it('GET_TABLE_ID returns tableId from state', () => {
        const { tableId } = createState({ tableId: 'TEST_TABLE_ID_FCL' });

        expect(tableConfiguration.getters[TableConfigurationGetterEnum.GET_TABLE_ID]({ tableId })).toEqual(tableId);
    });
    it('GET_DEFAULT_COLUMN_DEF returns defaultColmunDef from state', () => {
        const { defaultColDef } = createState({ defaultColDef: { headerName: 'Test1', name: 'Test1' } });
        expect(tableConfiguration.getters[TableConfigurationGetterEnum.GET_DEFAULT_COLUMN_DEF]({ defaultColDef })).toEqual(defaultColDef);
    });

    it('GET_COLUMN_DEFS returns columnDefs from state', () => {
        const { columnDefs } = createState({ columnDefs: [{ headerName: 'Test1', name: 'Test1' }] });
        expect(tableConfiguration.getters[TableConfigurationGetterEnum.GET_COLUMN_DEFS]({ columnDefs })).toEqual(columnDefs);
    });
    it('GET_THEME returns tabletheme from state', () => {
        const { theme } = createState({ theme: { spacing: 'default' } });
        expect(tableConfiguration.getters[TableConfigurationGetterEnum.GET_THEME]({ theme })).toEqual(theme);
    });
});

describe('mutations', () => {
    it('SET_INITIALIZED sets initialized in state', () => {
        const state = createState();
        const initialized = true;

        tableConfiguration.mutations[TableConfigurationMutationEnum.SET_INITIALIZED](state, { initialized });
        expect(state).toEqual(createState({ initialized }));
    });

    it('SET_SAVE_USER_PREFERENCES_ENABLED sets saveUserPreferencesEnabled in state', () => {
        const state = createState();
        const saveUserPreferencesEnabled = true;

        tableConfiguration.mutations[TableConfigurationMutationEnum.SET_SAVE_USER_PREFERENCES_ENABLED](state, { saveUserPreferencesEnabled });
        expect(state).toEqual(createState({ saveUserPreferencesEnabled }));
    });

    it('SET_TABLE_ID sets tableId in state', () => {
        const state = createState();
        const tableId = 'TEST_TABLE_ID_FCL';

        tableConfiguration.mutations[TableConfigurationMutationEnum.SET_TABLE_ID](state, { tableId });

        expect(state).toEqual(createState({ tableId }));
    });

    it('SET_DEFAULT_COLUMN_DEF sets defaultColDef in state', () => {
        const state = createState();

        tableConfiguration.mutations[TableConfigurationMutationEnum.SET_DEFAULT_COLUMN_DEF](state, { defaultColDef: MOCK_DEFAULT_COL_DEF });

        expect(state).toEqual(createState({ defaultColDef: MOCK_DEFAULT_COL_DEF }));
    });

    it('SET_ORIGINAL_COLUMN_DEFS sets originalColumnDefs in state', () => {
        const state = createState();
        const columnDefs = [
            { headerName: 'Test1', name: 'Test1', field: 'Test1' },
            { headerName: 'Test2', name: 'Test2', field: 'Test2' },
        ];

        tableConfiguration.mutations[TableConfigurationMutationEnum.SET_ORIGINAL_COLUMN_DEFS](state, { columnDefs });

        expect(state).toEqual(
            createState({
                originalColumnDefs: columnDefs,
                originalColumnDefsMap: new Map([
                    ['Test1', { headerName: 'Test1', name: 'Test1', field: 'Test1' }],
                    ['Test2', { headerName: 'Test2', name: 'Test2', field: 'Test2' }],
                ]),
            }),
        );
    });

    it('SET_COLUMN_DEFS sets columnDefs in state', () => {
        const state = createState();
        const columnDefs = [
            { headerName: 'Test1', name: 'Test1' },
            { headerName: 'Test2', name: 'Test2' },
        ];

        tableConfiguration.mutations[TableConfigurationMutationEnum.SET_COLUMN_DEFS](state, { columnDefs });
        expect(state).toEqual(createState({ columnDefs }));
    });

    it('SET_ORIGINAL_THEME sets original theme in state', () => {
        const state = createState();
        const theme = { spacing: 'default' };

        tableConfiguration.mutations[TableConfigurationMutationEnum.SET_ORIGINAL_THEME](state, { theme });
        expect(state.originalTheme).toEqual(theme);
    });

    it('SET_THEME sets theme in state', () => {
        const state = createState();
        const theme = { spacing: 'compact' };

        tableConfiguration.mutations[TableConfigurationMutationEnum.SET_THEME](state, { theme });
        expect(state).toEqual(createState({ theme }));
    });
});

describe('actions', () => {
    it('INITIALIZE commits SET_SAVE_USER_PREFERENCES_ENABLED, SET_TABLE_ID, SET_DEFAULT_COLUMN_DEF, SET_ORIGINAL_COLUMN_DEFS, SET_ORIGINAL_THEME, SET_COLUMN_DEFS, SET_THEME, SET_INITIALIZED mutations and dispatches FETCH_USER_PREFERENCES when initialized is set to false', async () => {
        const savedColumnDefs: Array<SCMTableColDef> = [];
        const savedTheme: SCMTableTheme = {};
        const state = createState();
        const commit = jest.fn();
        const dispatch = jest.fn().mockImplementation((type: string) => {
            switch (type) {
                case TableConfigurationActionEnum.FETCH_USER_PREFERENCES:
                    return Promise.resolve({ savedColumnDefs, savedTheme });
                default:
                    return Promise.resolve(null);
            }
        });

        await tableConfiguration.actions[TableConfigurationActionEnum.INITIALIZE](
            { state, commit, dispatch },
            {
                saveUserPreferencesEnabled: true,
                tableId: 'TEST_TABLE_ID',
                defaultColDef: MOCK_DEFAULT_COL_DEF,
                columnDefs: MOCK_COLUMN_DEFS,
                theme: MOCK_THEME,
            },
        );

        expect(commit).toHaveBeenCalledTimes(8);
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_SAVE_USER_PREFERENCES_ENABLED, { saveUserPreferencesEnabled: true });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_TABLE_ID, { tableId: 'TEST_TABLE_ID' });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_DEFAULT_COLUMN_DEF, { defaultColDef: MOCK_DEFAULT_COL_DEF });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_ORIGINAL_COLUMN_DEFS, { columnDefs: MOCK_COLUMN_DEFS });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_ORIGINAL_THEME, { theme: MOCK_THEME });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_COLUMN_DEFS, { columnDefs: MOCK_COLUMN_DEFS });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_THEME, { theme: MOCK_THEME });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_INITIALIZED);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toBeCalledWith(TableConfigurationActionEnum.FETCH_USER_PREFERENCES);
    });

    it('INITIALIZE commits SET_COLUMN_DEFS and SET_THEME with saved columnDefs and theme if user preferences are available', async () => {
        const savedColumnDefs: Array<SCMTableColDef> = [{ name: 'Test1', headerName: 'Test1', field: 'Test1', colWidth: 100 }];
        const savedTheme: SCMTableTheme = { spacing: 'compact' };
        const state = createState();
        const commit = jest.fn();
        const dispatch = jest.fn().mockImplementation((type: string) => {
            switch (type) {
                case TableConfigurationActionEnum.FETCH_USER_PREFERENCES:
                    return Promise.resolve({ savedColumnDefs, savedTheme });
                default:
                    return Promise.resolve(null);
            }
        });

        await tableConfiguration.actions[TableConfigurationActionEnum.INITIALIZE](
            { state, commit, dispatch },
            {
                saveUserPreferencesEnabled: true,
                tableId: 'TEST_TABLE_ID',
                defaultColDef: MOCK_DEFAULT_COL_DEF,
                columnDefs: MOCK_COLUMN_DEFS,
                theme: MOCK_THEME,
            },
        );

        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_COLUMN_DEFS, { columnDefs: savedColumnDefs });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_THEME, { theme: savedTheme });
    });

    it('INITIALIZE commits SET_COLUMN_DEFS and SET_THEME with columnDefs and theme from argument if user preferences are not available', async () => {
        const savedColumnDefs: Array<SCMTableColDef> = [];
        const savedTheme: SCMTableTheme = {};
        const state = createState();
        const commit = jest.fn();
        const dispatch = jest.fn().mockImplementation((type: string) => {
            switch (type) {
                case TableConfigurationActionEnum.FETCH_USER_PREFERENCES:
                    return Promise.resolve({ savedColumnDefs, savedTheme });
                default:
                    return Promise.resolve(null);
            }
        });

        await tableConfiguration.actions[TableConfigurationActionEnum.INITIALIZE](
            { state, commit, dispatch },
            {
                saveUserPreferencesEnabled: true,
                tableId: 'TEST_TABLE_ID',
                defaultColDef: MOCK_DEFAULT_COL_DEF,
                columnDefs: MOCK_COLUMN_DEFS,
                theme: MOCK_THEME,
            },
        );

        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_COLUMN_DEFS, { columnDefs: MOCK_COLUMN_DEFS });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_THEME, { theme: MOCK_THEME });
    });

    it('INITIALIZE does not commit any mutation when table configuration is already initialized', async () => {
        const state = createState({ initialized: true });
        const commit = jest.fn();
        const dispatch = jest.fn();

        await tableConfiguration.actions[TableConfigurationActionEnum.INITIALIZE](
            { state, commit, dispatch },
            {
                saveUserPreferencesEnabled: true,
                tableId: 'TEST_TABLE_ID',
                defaultColDef: MOCK_DEFAULT_COL_DEF,
                columnDefs: MOCK_COLUMN_DEFS,
                theme: MOCK_THEME,
            },
        );

        expect(commit).toHaveBeenCalledTimes(0);
    });

    it('FETCH_USER_PREFERENCES returns empty columnDefs and theme when saveUserPreferencesEnabled is false', async () => {
        jest.spyOn(api.userPreferences, 'getUserFavourites').mockResolvedValue(MOCK_USER_PREFERENCE_RESPONSE);
        const state = createState({ saveUserPreferencesEnabled: false });

        const { savedColumnDefs, savedTheme } = await tableConfiguration.actions[TableConfigurationActionEnum.FETCH_USER_PREFERENCES]({ state });

        expect(savedColumnDefs).toStrictEqual([]);
        expect(savedTheme).toStrictEqual({});
    });

    it('FETCH_USER_PREFERENCES returns saved columnDefs and theme when saveUserPreferencesEnabled is true and API call is successful', async () => {
        jest.spyOn(api.userPreferences, 'getUserFavourites').mockResolvedValue(MOCK_USER_PREFERENCE_RESPONSE);
        const state = createState({
            saveUserPreferencesEnabled: true,
            tableId: 'TEST_TABLE_ID',
            originalColumnDefsMap: new Map([
                [
                    'Test1',
                    {
                        name: 'Test1',
                        headerName: 'Test1',
                        field: 'Test1',
                    },
                ],
            ]),
        });

        const { savedColumnDefs, savedTheme } = await tableConfiguration.actions[TableConfigurationActionEnum.FETCH_USER_PREFERENCES]({ state });

        expect(savedColumnDefs).toStrictEqual([{ name: 'Test1', headerName: 'Test1', field: 'Test1', colWidth: 100 }]);
        expect(savedTheme).toStrictEqual({ spacing: 'compact' });
    });

    it('FETCH_USER_PREFERENCES returns empty columnDefs and theme when saveUserPreferencesEnabled is true and API call has failed', async () => {
        jest.spyOn(api.userPreferences, 'getUserFavourites').mockRejectedValue({ message: 'error' });
        const state = createState({ saveUserPreferencesEnabled: true });

        const { savedColumnDefs, savedTheme } = await tableConfiguration.actions[TableConfigurationActionEnum.FETCH_USER_PREFERENCES]({ state }).catch(() => {
            // This is intentional
        });

        expect(savedColumnDefs).toStrictEqual([]);
        expect(savedTheme).toStrictEqual({});
    });

    it('SAVE_USER_PREFERENCES does not save user preferences when saveUserPreferencesEnabled is false', async () => {
        const spySaveUserFavourites = jest.spyOn(api.userPreferences, 'saveUserFavourites').mockResolvedValue();
        const state = createState({ saveUserPreferencesEnabled: false });

        await tableConfiguration.actions[TableConfigurationActionEnum.SAVE_USER_PREFERENCES]({ state });

        expect(spySaveUserFavourites).toHaveBeenCalledTimes(0);
    });

    it('SAVE_USER_PREFERENCES save user preferences when saveUserPreferencesEnabled is true and API call is successful', async () => {
        const spySaveUserFavourites = jest.spyOn(api.userPreferences, 'saveUserFavourites').mockResolvedValue();
        const state = createState({
            saveUserPreferencesEnabled: true,
            columnDefs: [
                {
                    name: 'Test1',
                    headerName: 'Test1',
                    field: 'Test1',
                },
            ],
            theme: {
                spacing: 'default',
            },
            tableId: 'TEST_TABLE_ID_FCL',
        });

        await tableConfiguration.actions[TableConfigurationActionEnum.SAVE_USER_PREFERENCES]({ state });
        jest.runAllTimers();

        expect(spySaveUserFavourites).toHaveBeenCalledTimes(1);
        expect(spySaveUserFavourites).toHaveBeenCalledWith({
            applicationName: 'SCM',
            customerCode: '100INTMSL',
            userEmail: 'test_user@maersk.com',
            componentName: state.tableId,
            favouritesData: JSON.stringify({
                columnDefs: mapColumnDefsForUserPreferences({ columnDefs: state.columnDefs }),
                theme: state.theme,
            }),
        });
    });

    it('SAVE_USER_PREFERENCES handles error when saveUserPreferencesEnabled is true and API call has failed', async () => {
        const spySaveUserFavourites = jest.spyOn(api.userPreferences, 'saveUserFavourites').mockRejectedValue({ message: 'error' });
        const state = createState({
            saveUserPreferencesEnabled: true,
            columnDefs: [
                {
                    name: 'Test1',
                    headerName: 'Test1',
                    field: 'Test1',
                },
            ],
            theme: {
                spacing: 'default',
            },
            tableId: 'TEST_TABLE_ID_FCL',
        });

        await tableConfiguration.actions[TableConfigurationActionEnum.SAVE_USER_PREFERENCES]({ state }).catch(() => {});
        jest.runAllTimers();

        expect(spySaveUserFavourites).toHaveBeenCalledTimes(1);
        expect(spySaveUserFavourites).toHaveBeenCalledWith({
            applicationName: 'SCM',
            customerCode: '100INTMSL',
            userEmail: 'test_user@maersk.com',
            componentName: state.tableId,
            favouritesData: JSON.stringify({
                columnDefs: mapColumnDefsForUserPreferences({ columnDefs: state.columnDefs }),
                theme: state.theme,
            }),
        });
    });

    it('REARRANGE_COLUMN_DEFS commits SET_COLUMN_DEFS mutation and dispatches SAVE_USER_PREFERENCES', async () => {
        const columnDefs = [{ field: 'Test1', name: 'Test1', colWidth: 100, flex: 1, hide: false, isHidden: false, sticky: false }];
        const originalColumnDefsMap = new Map([['Test1', { field: 'Test1', name: 'Test1' }]]);
        const state = createState({ columnDefs, originalColumnDefsMap });
        const commit = jest.fn();
        const dispatch = jest.fn();

        await tableConfiguration.actions[TableConfigurationActionEnum.REARRANGE_COLUMN_DEFS]({ state, commit, dispatch }, { columnDefs });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_COLUMN_DEFS, { columnDefs });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toBeCalledWith(TableConfigurationActionEnum.SAVE_USER_PREFERENCES);
    });

    it('SET_COLUMN_DEFS commits SET_COLUMN_DEFS mutation and dispatches SAVE_USER_PREFERENCES action', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const columnDefs = [{ headerName: 'Test1', name: 'Test1' }];
        const state = createState({ columnDefs });
        await tableConfiguration.actions[TableConfigurationActionEnum.SET_COLUMN_DEFS]({ state, commit, dispatch }, { columnDefs });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_COLUMN_DEFS, { columnDefs });
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toBeCalledWith(TableConfigurationActionEnum.SAVE_USER_PREFERENCES);
    });

    it('SET_THEME commits SET_THEME mutation and dispatches SAVE_USER_PREFERENCES action', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();

        await tableConfiguration.actions[TableConfigurationActionEnum.SET_THEME]({ commit, dispatch }, { theme: 'compact' });

        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_THEME, { theme: 'compact' });
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toBeCalledWith(TableConfigurationActionEnum.SAVE_USER_PREFERENCES);
    });

    it('RESET_COLUMN_DEFS commits SET_COLUMN_DEFS, SET_THEME mutation and dispatches SAVE_USER_PREFERENCES', async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const originalColumnDefs = [{ headerName: 'Test1', name: 'Test1' }];
        const originalTheme = { spacing: 'default' };
        const state = createState({ originalColumnDefs, originalTheme });

        await tableConfiguration.actions[TableConfigurationActionEnum.RESET_COLUMN_DEFS]({ state, commit, dispatch });

        expect(commit).toHaveBeenCalledTimes(2);
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_COLUMN_DEFS, { columnDefs: originalColumnDefs });
        expect(commit).toBeCalledWith(TableConfigurationMutationEnum.SET_THEME, { theme: originalTheme });
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toBeCalledWith(TableConfigurationActionEnum.SAVE_USER_PREFERENCES);
    });
});
