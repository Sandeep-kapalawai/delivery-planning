import { debug } from 'console';
import { isEmpty, isFunction, cloneDeep } from 'lodash';


export function mapBrowserQueryParamsToAppliedQuickFilters({
    filters,
    browserQueryParams,
}: {
    // filters: { filtersArray: Array<any>; filtersMap: { [key: string]: any }; fieldMap: { [key: string]: any } };
    filters: any;
    browserQueryParams: any;
}): any {
    debugger;
    let appliedFilters: any = cloneDeep(browserQueryParams);
    for (const id in appliedFilters) {
        // const mathcingFiled = filters.find((o:any) => o[id] === id);
        // console.log(mathcingFiled,"mathcingFiled")
       
        let mathcingFiled;
        if (filters.hasOwnProperty(id)) {
            console.log(appliedFilters[id],"appliedFilters[id]")
            // console.log(mathcingFiled = filters[id].result.map((label:any) =>  ({
            //     label === appliedFilters[id]
            // })), 'mathcingFiled');
            mathcingFiled = filters[id].result.find((item:any) => item.label === decodeURIComponent(appliedFilters[id]));
            console.log(mathcingFiled,"mathcingFiled")
            // filters[id].result.filter((label:any, index:number) => {
            //     if(label == appliedFilters[id]){
            //         return filters[id]?.result[index];
            //     }
            // });
        
            return mathcingFiled;
          
          }
        
        const field = filters?.id;
        if (isEmpty(field)) {
            delete appliedFilters[id];
            continue;
        }

        const mappingRules = field?.id;
        if (isEmpty(mappingRules)) {
            continue;
        }

        mappingRules.forEach((id: string | number) => {
            // if (!isFunction(REVERSE_MAPPING_RULES_CONFIG[rule])) {
            //     return;
            // }

            appliedFilters = appliedFilters[id].split(',');
            return appliedFilters;
        });
    }

    return appliedFilters;
}