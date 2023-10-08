import { calculateDetailsTabFromTabIndex } from './index';
import { DetailsTabEnum } from '@/static';

describe('logic', () => {
    describe('calculateListViewTypeFromTabIndex', () => {
        it('calculates the correct list view type for FCL', () => {
            const tabIndex = 0;

            const result = calculateDetailsTabFromTabIndex(tabIndex);

            expect(result).toEqual(DetailsTabEnum.PurchaseOrders);
        });

        it('calculates the correct list view type for LCL', () => {
            const tabIndex = 1;

            const result = calculateDetailsTabFromTabIndex(tabIndex);

            expect(result).toEqual(DetailsTabEnum.FinOps);
        });

        it('calculates the correct list view type for LCL', () => {
            const tabIndex = 2;

            const result = calculateDetailsTabFromTabIndex(tabIndex);

            expect(result).toEqual(DetailsTabEnum.Comments);
        });
    });
});
