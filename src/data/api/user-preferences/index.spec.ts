import axios from '@/data/axios';
import api from '.';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('User Preferences API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('saveFilter ', async () => {
        const data = {};
        mockedAxios.post.mockResolvedValue({ data });

        const payload = { headers: { 'Content-Type': 'application/json' } };
        const output = await api.saveFilter(payload, {});

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(output).toEqual(data);
    });

    it('getSavedFilters ', async () => {
        const data = {};
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getSavedFilters();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(output).toEqual(data);
    });

    it('deleteSavedFilter', async () => {
        const data = {};
        const filterId = 'test';
        mockedAxios.delete.mockResolvedValue({ data });

        const output = await api.deleteSavedFilter(filterId);

        expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
        expect(output).toEqual(data);
    });

    it('updateDefaultFilter', async () => {
        const data = {};
        const filterId = 'test';
        mockedAxios.put.mockResolvedValue({ data });

        const payload = { headers: { 'Content-Type': 'application/json' } };
        await api.updateDefaultFilter(filterId, payload, {});

        expect(mockedAxios.put).toHaveBeenCalledTimes(1);
    });

    it('getUserFavourites ', async () => {
        const data = {
            componentName: 'Destination-DeliveryPlanning-ColumnConfigPreferences',
            customerCode: '100INTMSL',
            userEmail: 'test_user@maersk.com',
            applicationName: 'SCM',
            favouritesData: '[]',
        };
        mockedAxios.get.mockResolvedValue({ data });

        const output = await api.getUserFavourites();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(output).toEqual(data);
    });

    it('saveUserFavourites', async () => {
        const data = {
            applicationName: 'SCM',
            componentName: 'Destination-DeliveryPlanning-ColumnConfigPreferences',
            customerCode: '100INTMSL',
            userEmail: 'test_user@maersk.com',
        };

        mockedAxios.put.mockResolvedValue({ data });

        const payload = {
            applicationName: 'SCM',
            componentName: 'Destination-DeliveryPlanning-ColumnConfigPreferences',
            customerCode: '100INTMSL',
            favouritesData:
                '[{"maxWidth":60,"name":"Select","headerName":"","type":"checkbox","field":"selector","suppressMovable":true,"sortable":false,"resizable":false,"lockPosition":true,"isLocked":true,"sticky":"left","flex":1,"colWidth":60,"hide":false}]',
            userEmail: 'test_user@maersk.com',
        };
        const output = await api.saveUserFavourites(payload, {});

        expect(mockedAxios.put).toHaveBeenCalledTimes(1);
        expect(output).toEqual(data);
    });
});
