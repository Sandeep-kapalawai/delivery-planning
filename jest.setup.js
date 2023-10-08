import { config } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import 'regenerator-runtime/runtime';
import { initializeValidations } from './src/logic';

const MONTH_LOOKUP = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
};

jest.spyOn(global.console, 'debug').mockImplementation(() => {
    // This is intentional
});
jest.spyOn(global.console, 'error').mockImplementation(() => {
    // This is intentional
});
// jest.spyOn(global.console, 'log').mockImplementation(() => {
//     // This is intentional
// });
jest.spyOn(global.console, 'warn').mockImplementation(() => {
    // This is intentional
});

process.env.CONTEXT_PATH = '/';

initializeValidations();

// Mocking translations function
jest.mock('vue-i18n');
jest.mock(
    '@/i18n',
    () => ({
        t: jest.fn().mockImplementation((text) => text || ''),
    }),
    { virtual: true },
);
VueI18n.t = jest.fn().mockImplementation((text) => text || '');
config.mocks['$t'] = jest.fn().mockImplementation((text) => text || '');

// Mocking @maersk-global/telemetry-web-sdk
jest.mock('@maersk-global/telemetry-web-sdk', () => ({
    RumInit: jest.fn(),
}));

// Mock Destination Shell's components
['destination/components/notifications'].forEach((dependency) => {
    jest.mock(dependency, () => jest.fn(), { virtual: true });
});
['destination/components/text-field'].forEach((dependency) => {
    jest.mock(dependency, () => jest.fn(), { virtual: true });
});
['destination/components/time-input'].forEach((dependency) => {
    jest.mock(dependency, () => jest.fn(), { virtual: true });
});
// Mocking Destination Shell's axios module instance
jest.mock(
    'destination/axios',
    () => ({
        get: jest.fn(),
        delete: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
    }),
    { virtual: true },
);

// Mocking Destination Shell's router guards module instance
jest.mock(
    'destination/router/guards',
    () => ({
        authenticationGuard: jest.fn(),
        featureToggleGuard: jest.fn(),
    }),
    { virtual: true },
);

jest.mock(
    'destination/store/utilities',
    () => ({
        createMutationConstants: jest.fn().mockImplementation((action) => ({
            STARTED: `${action}_STARTED`,
            SUCCEEDED: `${action}_SUCCEEDED`,
            FAILED: `${action}_FAILED`,
        })),
    }),
    { virtual: true },
);

jest.mock(
    'destination/logic',
    () => ({
        // table-configuration
        rearrangeColumnDefinitions: ({ columnDefs, originalColumnDefsMap }) => columnDefs,
        mapColumnDefsForUserPreferences: ({ columnDefs }) => columnDefs,
        mapColumnDefsFromUserPreferences: ({ savedColumnDefs, originalColumnDefsMap }) => savedColumnDefs,
    }),
    { virtual: true },
);

jest.mock(
    'destination/utilities',
    () => ({
        // application
        isApplicationOpenedWithinHub: jest.fn().mockImplementation(() => false),
        // axios
        getAPIErrorMessages: jest.fn().mockImplementation((error) => ['Mock API error message']),
        getNotificationMessageFromAPIErrors: jest.fn().mockImplementation(({ id, error }) => {
            heading: 'Mock API error message';
        }),
        // browser
        setBrowserQueryParams: jest.fn(),
        // date-time
        getFormattedDate: jest.fn().mockImplementation(({ date }) => date),
        getFormattedDateTime: jest.fn().mockImplementation(({ date }) => date),
        getFormattedDateForFilename: jest.fn().mockImplementation(({ date }) => date),
        getFormattedTime: jest.fn().mockImplementation(({ date }) => date),
        getFormattedDateInISO8601: jest.fn().mockImplementation(({ date }) => {
            if (!date || typeof date !== 'string') {
                return date;
            }

            const [DD, MMM, YYYY] = date.split(' ');
            return `${YYYY}-${MONTH_LOOKUP[MMM.toLowerCase()]}-${DD}`;
        }),
        // feature-toggle
        isFeatureEnabled: jest.fn().mockReturnValue(true),
        // files
        downloadXlsx: jest.fn(),
        // notifications
        addNotification: jest.fn(),
        removeNotification: jest.fn(),
        clearNotifications: jest.fn(),
        clearAllNotifications: jest.fn(),
        // party
        getConsigneesBECode: jest.fn().mockImplementation(() => ['TEST_CONSIGNEE_1', 'TEST_CONSIGNEE_2']),
        // router
        getBasePathForApplication: jest.fn().mockImplementation(({ applicationRoute }) => applicationRoute),
        // tool-panel
        toolPanelPosition: jest.fn().mockImplementation(() => ({})),
        // user-permissions
        getLoggedInUserDetails: jest.fn().mockImplementation((value) => value),
        validateAccessForUserGroupsV3: jest.fn().mockReturnValue(true),
        userHasRequiredPermissions: jest.fn().mockReturnValue(true),
        userHasRequiredPermissionV3: jest.fn().mockReturnValue(true),
        // utilities
        isEmptyValue: jest.fn().mockImplementation((value) => {
            return (
                value === undefined ||
                value === null ||
                Number.isNaN(value) ||
                (typeof value === 'string' && value.trim().length === 0) ||
                (typeof value === 'object' && Object.keys(value).length === 0)
            );
        }),
        formatValueIfEmpty: jest.fn().mockImplementation((value) => value || '-'),
        getEnumDisplayName: jest.fn().mockImplementation((value) => value),
        parseMultilineText: jest.fn().mockImplementation((value) => value),
    }),
    { virtual: true },
);

// Stubbing MDS components
config.stubs['mc-button'] = true;
config.stubs['mc-checkbox'] = true;
config.stubs['mc-icon'] = true;
config.stubs['mc-input'] = true;
config.stubs['mc-input-date'] = true;
config.stubs['mc-modal'] = true;
config.stubs['mc-notification'] = true;
config.stubs['mc-radio'] = true;
config.stubs['mc-radio-group'] = true;
config.stubs['mc-select'] = true;
config.stubs['mc-tab'] = true;
config.stubs['mc-tab-bar'] = true;
config.stubs['mc-tag'] = true;
config.stubs['mc-textarea'] = true;
config.stubs['mc-c-avatar'] = true;
config.stubs['mc-c-list'] = true;
config.stubs['mc-c-list-item'] = true;
