/* istanbul ignore file */
import { MDS_COMPONENT_TYPE, MDS_COMPONENT_FIT } from '../../static/mds-component-fit';

export function getMDSComponentFit(component?: MDS_COMPONENT_TYPE) {
    return (component && MDS_COMPONENT_FIT[component]) || MDS_COMPONENT_FIT.global;
}

export default { getMDSComponentFit };
