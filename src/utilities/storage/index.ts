import StorageStrategyEnum from '@/static/storage';

// storage can be blocked by client
// which will throw an error. Lets handle it..
function storageInterceptor<T extends () => void, U>(callback: T, fallback?: U): ReturnType<T> | U {
    try {
        return <ReturnType<T>>callback();
    } catch (err) {
        // in prod, this is removed and we fail silently..
        console.debug('[STORAGE INACCESSIBLE]: ', err);
    }
    return <U>fallback;
}

// storage utility
export default {
    // get
    get: (key: string, storageScope = StorageStrategyEnum.LOCAL): string | null => {
        return storageInterceptor(() => {
            return window[storageScope].getItem(key);
        }, null);
    },

    // set
    set: (key: string, value: string, storageScope = StorageStrategyEnum.LOCAL): void => {
        return storageInterceptor(() => {
            return window[storageScope].setItem(key, value);
        });
    },

    // delete
    del: (key: string, storageScope = StorageStrategyEnum.LOCAL): void => {
        return storageInterceptor(() => {
            return window[storageScope].removeItem(key);
        });
    },

    // clear all
    clear: (storageScope = StorageStrategyEnum.LOCAL) => {
        return storageInterceptor(() => {
            return window[storageScope].clear();
        });
    },
};
