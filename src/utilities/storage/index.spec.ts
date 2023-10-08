import storage from '@/utilities/storage';
import StorageStrategyEnum from '@/static/storage';

const OLD_STORAGE = {
    [StorageStrategyEnum.LOCAL]: window.localStorage,
    [StorageStrategyEnum.SESSION]: window.sessionStorage,
};

const STRATS = [StorageStrategyEnum.LOCAL, StorageStrategyEnum.SESSION];

const invalidScope = 'invalid';

const initStorage = (storageType: StorageStrategyEnum) => {
    Object.defineProperty(window, storageType, {
        writable: true,
    });
};

const setStorage = <T>(storageType: StorageStrategyEnum, mockStorage: { [k: string]: jest.Mock<T, []> }) => {
    window[storageType] = <Storage>mockStorage;
};

const resetStorage = (storageType: StorageStrategyEnum) => {
    window[storageType] = OLD_STORAGE[storageType];
};

const key = 'key';
const value = 'value';

describe('storage', () => {
    beforeAll(() => {
        initStorage(StorageStrategyEnum.LOCAL);
        initStorage(StorageStrategyEnum.SESSION);
    });

    afterAll(() => {
        resetStorage(StorageStrategyEnum.LOCAL);
        resetStorage(StorageStrategyEnum.SESSION);
    });

    describe('get', () => {
        it.each(STRATS)('returns item from %s storage', (scope) => {
            const getItem = jest.fn(() => value);
            setStorage(scope, { getItem });

            const output = storage.get(key, scope);

            expect(getItem).toHaveBeenCalledTimes(1);
            expect(getItem).toHaveBeenCalledWith(key);

            expect(output).toEqual(value);
        });

        it('returns item from local storage if the scope is NOT specified', () => {
            const getItem = jest.fn(() => value);
            setStorage(StorageStrategyEnum.LOCAL, { getItem });

            const output = storage.get(key);

            expect(getItem).toHaveBeenCalledTimes(1);
            expect(getItem).toHaveBeenCalledWith(key);

            expect(output).toEqual(value);
        });

        it('returns null if the scope is invalid', () => {
            //@ts-expect-error we're testing an invalid key, TS throws err as it should
            expect(storage.get(key, invalidScope)).toBe(null);
        });
    });

    describe('set', () => {
        it.each(STRATS)('sets item to %s storage', (scope) => {
            const setItem = jest.fn(() => undefined);
            setStorage(scope, { setItem });

            const output = storage.set(key, value, scope);

            expect(setItem).toHaveBeenCalledTimes(1);
            expect(setItem).toHaveBeenCalledWith(key, value);

            expect(output).toEqual(undefined);
        });

        it('sets item to local storage if the scope is NOT specified', () => {
            const setItem = jest.fn(() => undefined);
            setStorage(StorageStrategyEnum.LOCAL, { setItem });

            const output = storage.set(key, value);

            expect(setItem).toHaveBeenCalledTimes(1);
            expect(setItem).toHaveBeenCalledWith(key, value);

            expect(output).toEqual(undefined);
        });

        it('throws an error if the scope is invalid', () => {
            //@ts-expect-error we're testing an invalid key, TS throws err as it should
            expect(storage.set(key, value, invalidScope)).toBeUndefined();
        });
    });
    describe('del', () => {
        it.each(STRATS)('deletes item from %s storage', (scope) => {
            const removeItem = jest.fn();
            setStorage(scope, { removeItem });

            storage.del(key, scope);

            expect(removeItem).toHaveBeenCalledTimes(1);
            expect(removeItem).toHaveBeenCalledWith(key);
        });

        it('deletes item from local storage if the scope is NOT specified', () => {
            const removeItem = jest.fn();
            setStorage(StorageStrategyEnum.LOCAL, { removeItem });

            storage.del(key);

            expect(removeItem).toHaveBeenCalledTimes(1);
            expect(removeItem).toHaveBeenCalledWith(key);
        });

        it('throws an error if the scope is invalid', () => {
            //@ts-expect-error we're testing an invalid key, TS throws err as it should
            expect(storage.del(key, invalidScope)).toBeUndefined();
        });
    });

    describe('clear', () => {
        it.each(STRATS)('clears %s storage', (scope) => {
            const clear = jest.fn();
            setStorage(scope, { clear });

            storage.clear(scope);

            expect(clear).toHaveBeenCalledTimes(1);
            expect(clear).toHaveBeenCalledWith();
        });

        it('clears local storage if the scope is NOT specified', () => {
            const clear = jest.fn();
            setStorage(StorageStrategyEnum.LOCAL, { clear });

            storage.clear();

            expect(clear).toHaveBeenCalledTimes(1);
            expect(clear).toHaveBeenCalledWith();
        });

        it('throws an error if the scope is invalid', () => {
            //@ts-expect-error we're testing an invalid key, TS throws err as it should
            expect(storage.clear(invalidScope)).toBeUndefined();
        });
    });
});
