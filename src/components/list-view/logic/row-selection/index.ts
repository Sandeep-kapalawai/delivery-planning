import { ListViewTypeEnum } from '@/static';
import { IFclListItem, ILclListItem } from '@/interfaces';
import { getDeliveryPlanId } from '@/logic';

export function getRowsToAddAndRemove(
    viewType: ListViewTypeEnum,
    selectedRows: Array<{ data: IFclListItem | ILclListItem }>,
    visibleRows: Array<IFclListItem | ILclListItem>,
): { rowsToAdd: Array<any>; rowsToRemove: Array<any> } {
    const rowsToAdd: Array<any> = [],
        rowsToRemove: Array<any> = [];

    const selectedRowsMap = new Map(selectedRows.map(({ data }) => [getDeliveryPlanId(viewType, data), data]));

    visibleRows.forEach((row) => {
        const deliveryPlanId = getDeliveryPlanId(viewType, row);
        selectedRowsMap.has(deliveryPlanId) ? rowsToAdd.push(row) : rowsToRemove.push(row);
    });

    return { rowsToAdd, rowsToRemove };
}
