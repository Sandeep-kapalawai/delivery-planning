/** This is being used to update the count and label for this status which is not being part of response , currently the BE is providing the response for only those which has count */
import { validateAccessForUserGroupsV3 } from 'destination/utilities';
import {
    IGroupedQuickFilters,
    IExecutionStatus,
    ILastFreeDays,
    IPlanningStatus,
    IPriorityLevelsStatusGroup,
    IStatus,
    IPlanningStatusQuickFilters,
} from '@/interfaces';

export function getUpdatedStatus(
    statusToCompare: Array<IPlanningStatus | IExecutionStatus | ILastFreeDays | IPriorityLevelsStatusGroup | []>,
    statusKey: string,
    statusGroup: Map<string, IStatus>,
) {
    const result = [];

    for (const status of statusGroup.values()) {
        const matchingObj = statusToCompare?.find((o: any) => o[statusKey] == status.key);

        if (matchingObj) {
            result.push({
                ...matchingObj,
                label: status.text,
                isSelected: false,
                category: status.category || '',
            });
        } else {
            result.push({
                [statusKey]: status.key,
                label: status.text,
                count: '-',
                isSelected: false,
                category: status.category || '',
            });
        }
    }

    return result;
}

export function mapAppliedFiltersToResolvedgroupedQuickFilters(appliedQuickFilters: Array<IGroupedQuickFilters>) {
    debugger;
    if (!appliedQuickFilters?.length) {
        return {};
    }
    return appliedQuickFilters?.reduce((acc: { [key: string]: string }, curr: { id: string; value: string }) => {
        if (!acc[curr.id]) {
            acc[curr.id] = curr.value;
        } else {
            acc[curr.id] += `, ${curr.value}`;
        }
        return acc;
    }, {});
}

const createMap = (arr: IStatus[]): Map<string, IStatus> => {
    return new Map(arr?.map((item) => [item.key, item]));
};

export function getplanningStatusTiles(planningStatus: Array<IPlanningStatusQuickFilters>) {
    const filteredStatus = planningStatus?.filter((status: IPlanningStatusQuickFilters) => validateAccessForUserGroupsV3(status.allowAccessForUserGroups));
    return createMap(filteredStatus);
}
