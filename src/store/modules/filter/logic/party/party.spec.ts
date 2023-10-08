import { ICustomer } from '@/interfaces';
import { getUniqueConsignees } from '.';
function getCustomer({ fullyQualifiedBECode, customerName, type }: { fullyQualifiedBECode: string; customerName: string; type: string }): ICustomer {
    return {
        beCode: '',
        countryCode: '',
        customerId: 0,
        customerName,
        fullyQualifiedBECode,
        functionCode: '',
        isParent: true,
        type,
    };
}

describe('party logic', () => {
    describe('getUniqueMDMConsignees', () => {
        it('returns unique consigees', () => {
            const input: { result: Array<ICustomer> } = {
                result: [
                    getCustomer({ fullyQualifiedBECode: 'USHUFFYHQ', customerName: 'HUFFY CORPORATION', type: 'Consignee' }),
                    getCustomer({ fullyQualifiedBECode: 'GBPRIMARKHQ', customerName: 'PRIMARK LIMITED STORE', type: 'Consignee' }),
                    getCustomer({ fullyQualifiedBECode: 'GBPAPERCHAHQ', customerName: 'PAPERCHASE PRODUCTS LTD', type: 'Consignee' }),
                    getCustomer({ fullyQualifiedBECode: 'GBAMAZONHQ', customerName: 'AMAZON', type: 'Shipper' }),
                ],
            };
            const expectedOutput: Array<{ value: string; secondary: string }> = [
                {
                    value: 'USHUFFYHQ',
                    secondary: 'HUFFY CORPORATION',
                },
                {
                    value: 'GBPRIMARKHQ',
                    secondary: 'PRIMARK LIMITED STORE',
                },
                {
                    value: 'GBPAPERCHAHQ',
                    secondary: 'PAPERCHASE PRODUCTS LTD',
                },
            ];

            const actualOutput = getUniqueConsignees(input);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });
});
