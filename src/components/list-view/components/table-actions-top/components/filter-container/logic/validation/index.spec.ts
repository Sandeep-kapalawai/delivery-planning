import { validateFilterName } from '.';

describe('validation', () => {
    describe('validateFilterName', () => {
        it('requires the filter name to have at least 1 character', () => {
            const input = { filterName: '', savedFilters: [] };

            const { isValid, message } = validateFilterName(input);

            expect(isValid).toBeFalsy();
            expect(message).toBe('FILTERS.FILTER_NAME_CHARACTER_LENGTH_EXCEEDED');
        });

        it('requires the filter name to be within the defined maximum length', () => {
            const input = {
                filterName: 'a'.repeat(51),
                savedFilters: [],
            };

            const { isValid, message } = validateFilterName(input);

            expect(isValid).toBeFalsy();
            expect(message).toBe('FILTERS.FILTER_NAME_CHARACTER_LENGTH_EXCEEDED');
        });

        it('imposes an inclusive minimum length', () => {
            const input = {
                filterName: 'a',
                savedFilters: [],
            };

            const { isValid, message } = validateFilterName(input);

            expect(isValid).toBeTruthy();
            expect(message).toBeUndefined();
        });

        it('imposes an inclusive maximum length', () => {
            const input = {
                filterName: 'a'.repeat(50),
                savedFilters: [],
            };

            const { isValid, message } = validateFilterName(input);

            expect(isValid).toBeTruthy();
            expect(message).toBeUndefined();
        });

        it('handles a valid length', () => {
            const input = {
                filterName: 'Test Filter 1234',
                savedFilters: [],
            };

            const { isValid, message } = validateFilterName(input);

            expect(isValid).toBeTruthy();
            expect(message).toBeUndefined();
        });

        it('requires the filter name to not exist in the saved filters', () => {
            const savedFilters = ['a', 'b', 'c', 'd'].map((name) => ({ name }));
            const input = {
                filterName: 'b',
                savedFilters,
            };

            const { isValid, message } = validateFilterName(input);

            expect(isValid).toBeFalsy();
            expect(message).toBe('FILTERS.FILTER_NAME_EXISTS');
        });

        it('handles a filter name which is not among the saved filters', () => {
            const savedFilters = ['a', 'b', 'c', 'd'].map((name) => ({ name }));
            const input = {
                filterName: 'e',
                savedFilters,
            };

            const { isValid, message } = validateFilterName(input);

            expect(isValid).toBeTruthy();
            expect(message).toBeUndefined();
        });
    });
});
