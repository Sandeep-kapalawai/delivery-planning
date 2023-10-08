import { ICustomer } from '@/interfaces';

export function getUniqueConsignees({ result }: { result: Array<ICustomer> }): Array<{ value: string; secondary: string }> {
    const consigneeArray: Array<{ value: string; secondary: string }> = [],
        consigneeMap: { [key: string]: { value: string; secondary: string } } = {};

    result.forEach((consignee) => {
        if (consignee.type?.toLowerCase() !== 'consignee' || consigneeMap[consignee.fullyQualifiedBECode]) {
            return;
        }

        const consigneeItem = {
            value: consignee.fullyQualifiedBECode,
            secondary: consignee.customerName,
        };

        consigneeArray.push(consigneeItem);
        consigneeMap[consigneeItem.value] = consigneeItem;
    });

    return consigneeArray;
}
