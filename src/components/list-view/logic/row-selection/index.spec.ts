import { ListViewTypeEnum } from '@/static';
import { getRowsToAddAndRemove } from '.';
import { IFclListItem } from '@/interfaces';

describe('row-selection logic', () => {
    describe('getRowsToAddAndRemove', () => {
        it('returns rowsToAdd and rowsToRemove from selectedRows and visibleRows', () => {
            const selectedRows = [{ data: { deliveryPlanId: 'TEST_ID_1' } }, { data: { deliveryPlanId: 'TEST_ID_2' } }] as Array<{ data: IFclListItem }>;
            const visibleRows = [
                { deliveryPlanId: 'TEST_ID_1' },
                { deliveryPlanId: 'TEST_ID_2' },
                { deliveryPlanId: 'TEST_ID_3' },
                { deliveryPlanId: 'TEST_ID_4' },
                { deliveryPlanId: 'TEST_ID_5' },
            ] as Array<IFclListItem>;

            const expectedRowsToAdd = [{ deliveryPlanId: 'TEST_ID_1' }, { deliveryPlanId: 'TEST_ID_2' }] as Array<IFclListItem>;
            const expectedRowsToRemove = [
                { deliveryPlanId: 'TEST_ID_3' },
                { deliveryPlanId: 'TEST_ID_4' },
                { deliveryPlanId: 'TEST_ID_5' },
            ] as Array<IFclListItem>;

            const { rowsToAdd, rowsToRemove } = getRowsToAddAndRemove(ListViewTypeEnum.fcl, selectedRows, visibleRows);

            expect(rowsToAdd).toStrictEqual(expectedRowsToAdd);
            expect(rowsToRemove).toStrictEqual(expectedRowsToRemove);
        });
    });
});
