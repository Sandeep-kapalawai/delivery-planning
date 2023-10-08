import { getValidationObserverError } from '.';

describe('validations logic', () => {
    describe('getValidationObserverError', () => {
        it('returns empty string when errors are not present', () => {
            const validationError = getValidationObserverError({
                test_field_1: [],
                test_field_2: [],
            });

            expect(validationError).toEqual('');
        });

        it('returns validation error message when errors are present', () => {
            const validationError = getValidationObserverError({
                test_field_1: [],
                test_field_2: ['test_field_2 error message'],
            });

            expect(validationError).toEqual('test_field_2 error message');
        });
    });
});
