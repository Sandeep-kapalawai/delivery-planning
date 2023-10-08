import { ILastUpdatedByUser } from '@/interfaces';
import { getGenericAutoCompleteResults } from '.';
import { getLastUpdatedByAutoCompleteResult } from './index';

describe('Autocomplete logic', () => {
    describe('getGenericAutoCompleteResults', () => {
        it('returns array of hints', () => {
            const result: Array<any> = ['TEST_DATA_1', 'TEST_DATA_2']
            const expectedOutput: Array<{ value: string; }> = [
                {
                    value: 'TEST_DATA_1',
                },
                {
                    value: 'TEST_DATA_2',
                },
            ];

            const actualOutput = getGenericAutoCompleteResults({result});

            expect(actualOutput).toStrictEqual(expectedOutput);
        });
    });

    describe('getLastUpdatedByAutoCompleteResult', () => {
        it('should return an empty array if the input result is empty', () => {
          const result: Array<ILastUpdatedByUser> = [];
          const expected: Array<{ value: string; secondary: string }> = [];
      
          const output = getLastUpdatedByAutoCompleteResult(result);
      
          expect(output).toEqual(expected);
        });
      
        it('should return an array of user details without duplicates', () => {
          const result: Array<ILastUpdatedByUser> = [
            { fullName: 'John Doe', userName: 'johnd', emailAddress: 'john@example.com' },
            { fullName: 'Jane Doe', userName: 'janed', emailAddress: 'jane@example.com' },
            { fullName: 'John Doe', userName: 'johnd', emailAddress: 'john@example.com' }, // duplicate entry
          ];
          const expected: Array<{ value: string; secondary: string }> = [
            { value: 'johnd', secondary: 'John Doe' },
            { value: 'janed', secondary: 'Jane Doe' },
          ];
      
          const output = getLastUpdatedByAutoCompleteResult(result);
      
          expect(output).toEqual(expected);
        });
      
        it('should handle an empty full name or username', () => {
          const result: Array<ILastUpdatedByUser> = [
            { fullName: '', userName: 'user1', emailAddress: 'user1@example.com' }, // empty full name
            { fullName: 'John Doe', userName: '', emailAddress: 'john@example.com' }, // empty username
          ];
          const expected: Array<{ value: string; secondary: string }> = [
            { value: 'user1', secondary: '' },
            { value: '', secondary: 'John Doe' },
          ];
      
          const output = getLastUpdatedByAutoCompleteResult(result);
      
          expect(output).toEqual(expected);
        });
      });
});
