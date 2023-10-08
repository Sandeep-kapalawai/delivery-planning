/* istanbul ignore file */

/* Maersk Design System */
import '@maersk-global/mds-components-core/mc-icon';
import '@maersk-global/mds-components-core/mc-loading-indicator';
import '@maersk-global/fonts/maeu/fonts.css';
import '@maersk-global/icons/fonts/web/20px/icons.min.css';
import '@maersk-global/icons/fonts/web/24px/icons.min.css';
import '@maersk-global/mds-design-tokens/maersk/light/web/css/design-tokens.css';
import '@maersk-global/mds-foundations/foundations.css';

import { initializeValidations, initializePensieveRUM } from './logic';

// initialize
const initialize = async (window: Window, initializeShell: boolean = true) => {
    try {
        if (initializeShell) {
            const initialize = (await import('destination/initialize')).default;
            await (initialize as any)(window);
        }

        initializeValidations();
        initializePensieveRUM();
        return Promise.resolve();
    } catch (e) {
        console.log(e);
    }
};

export default initialize;
