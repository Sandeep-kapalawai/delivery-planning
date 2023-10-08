import { LocationCache } from '.';
import { ILocationFullAddress } from '@/interfaces';
import api from '@/data/api';

const TEST_LOCATION_1: ILocationFullAddress = {
    facilityCode: 'TEST_FACILITY_CODE_1',
    displayName: 'TEST_DISPLAY_NAME_1',
} as ILocationFullAddress;

describe('delivery-plan store location-cache utility', () => {
    let locationCache: LocationCache;

    beforeEach(() => {
        jest.resetAllMocks();
        locationCache = new LocationCache();
    });

    it('getLocation fetches and returns the location if it is not available in cache', async () => {
        const spy = jest.spyOn(api.autocomplete, 'getLocationFullAddress').mockResolvedValue([TEST_LOCATION_1]);

        const facilityCode = TEST_LOCATION_1.facilityCode;
        const location = await locationCache.getLocation(facilityCode);

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ params: { searchPhrase: facilityCode } });

        expect(location).toEqual(TEST_LOCATION_1);
    });

    it('getLocation returns the location from cache if it is available', async () => {
        const spy = jest.spyOn(api.autocomplete, 'getLocationFullAddress').mockResolvedValue([TEST_LOCATION_1]);
        locationCache.setLocation(TEST_LOCATION_1);

        const facilityCode = TEST_LOCATION_1.facilityCode;
        const location = await locationCache.getLocation(facilityCode);

        expect(spy).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(0);

        expect(location).toEqual(TEST_LOCATION_1);
    });

    it('getLocation returns empty object when location is not available in cache and fetch call errors out', async () => {
        const spy = jest.spyOn(api.autocomplete, 'getLocationFullAddress').mockRejectedValue({ message: 'error' });

        const facilityCode = TEST_LOCATION_1.facilityCode;
        const location = await locationCache.getLocation(facilityCode).catch(() => {});

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ params: { searchPhrase: facilityCode } });

        expect(location).toEqual({});
    });

    it('getLocation returns empty object when facilityCode is not available', async () => {
        const location = await locationCache.getLocation('');

        expect(location).toEqual({});
    });
});
