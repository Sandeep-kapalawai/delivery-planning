import { initializePensieveRUM } from './index';
import telemetryWebSdk from '@maersk-global/telemetry-web-sdk';

describe('pensieve logic', () => {
    describe('initializePensieveRUM', () => {
        it('calls the respective Telemetry Web SDK function', () => {
            const init = jest.spyOn(telemetryWebSdk, 'RumInit');

            initializePensieveRUM();

            expect(init).toBeCalledTimes(1);
        });
    });
});
