import { listViewTypeSpecificAction } from '.';
import { ListViewTypeEnum } from '@/static';

describe('filter logic', () => {
    describe('listViewTypeSpecificAction', () => {
        const config: { [key in ListViewTypeEnum]: () => any } = {
            [ListViewTypeEnum.fcl]: () => {
                return ListViewTypeEnum.fcl;
            },
            [ListViewTypeEnum.lcl]: () => {
                return ListViewTypeEnum.lcl;
            },
        };

        it('executes fcl function from config when list view type enum is neither fcl nor lcl', () => {
            const listViewType: ListViewTypeEnum = 'random_type' as any;
            const expectedOutput: ListViewTypeEnum = ListViewTypeEnum.fcl;

            const actualOutput = listViewTypeSpecificAction(listViewType, config);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('executes fcl function from config when list view type enum is fcl', () => {
            const listViewType: ListViewTypeEnum = ListViewTypeEnum.fcl;
            const expectedOutput: ListViewTypeEnum = ListViewTypeEnum.fcl;

            const actualOutput = listViewTypeSpecificAction(listViewType, config);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('executes lcl function from config when list view type enum is lcl', () => {
            const listViewType: ListViewTypeEnum = ListViewTypeEnum.lcl;
            const expectedOutput: ListViewTypeEnum = ListViewTypeEnum.lcl;

            const actualOutput = listViewTypeSpecificAction(listViewType, config);

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });
});
