import { getFieldNameForSorting } from '.';
describe('sorting logic', () => {
    describe('getFieldNameForSorting', () => {
        test.each`
            input                       | expectedResult
            ${'consigneeName'}          | ${'customer'}
            ${'primaryExecutiveStatus'} | ${'executiveStatus'}
            ${'priorityShipment'}       | ${'cargoStuffingPriority'}
            ${'AnyTestData'}            | ${'AnyTestData'}
        `('getFieldNameForSorting returns $expectedResult when passed with $input', ({ input, expectedResult }) => {
            expect(getFieldNameForSorting(input)).toBe(expectedResult);
        });
    });
});
