export function getFieldNameForSorting(columnId: string) {
    switch (columnId) {
        case 'consigneeName':
            return 'customer';
        case 'primaryExecutiveStatus':
            return 'executiveStatus';
        case 'priorityShipment':
            return 'cargoStuffingPriority';
        default:
            return columnId;
    }
}
