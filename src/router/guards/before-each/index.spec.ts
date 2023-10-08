//@ts-nocheck
import { beforeEachGuard } from '.';
import { RouteNameEnum } from '../../routes';

describe('before each guard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls next() if unauthorized', async () => {
        const next = jest.fn();

        await beforeEachGuard({ fullPath: '', name: RouteNameEnum.UNAUTHORIZED }, { fullPath: '' }, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it('calls next()', async () => {
        const next = jest.fn();

        await beforeEachGuard({}, {}, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });
});
