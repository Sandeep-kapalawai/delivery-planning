import { parseFinalDeliveryLocationFromApiResponse } from '@/utilities/final-delivery-location';
import * as destinationUtilities from 'destination/utilities';

jest.mock('destination/utilities');

describe('path', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('when api response is not valid it will return empty array', () => {
        expect(parseFinalDeliveryLocationFromApiResponse('')).toStrictEqual([]);
    });

    test('when api response is provided with locationObjects', () => {
        const samepleData =
            '[{"FacilityCode":"USSPQTRM","FacilityCountryCode":null,"FacilityCityCode":null,"FacilityFunctionCode":null,"FacilityName":"Pune","PostalAddress":{"HouseNumber":"","SubDivisionName":"CA","Line1":"PORT OF SAN PEDRO BERTH121-126","Line2":"","Line3":null,"CityName":"San Pedro","CityCode":"SPQ","CountryName":"United States","CountryCode":"US","PostalCode":"90731","PostOfficeBox":null,"FullAddress":"\\nPORT OF SAN PEDRO BERTH121-126\\n\\nSan Pedro 90731\\nCA\\nUnited States"}}]';
        destinationUtilities.parseMultilineText.mockReturnValue(['\r\nINDUSTRIAL AREA', 'DONGDA DAOKOU DONGCH', 'Ningbo 317005', 'Zhejiang', 'China']);

        expect(parseFinalDeliveryLocationFromApiResponse(samepleData)).toEqual([
            expect.objectContaining({
                beCode: 'USSPQTRM',
                name: 'Pune',
                addressLines: ['\r\nINDUSTRIAL AREA', 'DONGDA DAOKOU DONGCH', 'Ningbo 317005', 'Zhejiang', 'China'],
            }),
        ]);
    });
});
