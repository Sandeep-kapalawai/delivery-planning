import { ListViewTypeEnum } from '@/static';
import * as logic from './index';

describe('logic', () => {
    describe('calculateTabIndexFromCurrentRoute', () => {
        it('calculates the correct tab index when the route is FCL', () => {
            const route = { name: ListViewTypeEnum.fcl };

            const result = logic.calculateTabIndexFromCurrentRoute(route as any);

            expect(result).toEqual(0);
        });

        it('calculates the correct tab index when the route is LCL', () => {
            const route = { name: ListViewTypeEnum.lcl };

            const result = logic.calculateTabIndexFromCurrentRoute(route as any);

            expect(result).toEqual(1);
        });
    });

    describe('calculateListViewTypeFromTabIndex', () => {
        it('calculates the correct list view type for FCL', () => {
            const tabIndex = 0;

            const result = logic.calculateListViewTypeFromTabIndex(tabIndex);

            expect(result).toEqual(ListViewTypeEnum.fcl);
        });

        it('calculates the correct list view type for LCL', () => {
            const tabIndex = 1;

            const result = logic.calculateListViewTypeFromTabIndex(tabIndex);

            expect(result).toEqual(ListViewTypeEnum.lcl);
        });
    });
});
