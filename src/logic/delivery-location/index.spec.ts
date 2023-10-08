import { DeliveryLocation } from '@/interfaces';
import { parseFinalDeliveryLocation } from '.';

describe('delivery location logic', () => {
    describe('parseFinalDeliveryLocation', () => {
        it('parses final delivery locations from API response', () => {
            const input =
                '[{"FacilityCode":"USSPQTRM","FacilityCountryCode":null,"FacilityCityCode":null,"FacilityFunctionCode":null,"FacilityName":"Pune","PostalAddress":{"HouseNumber":"","SubDivisionName":"CA","Line1":"PORT OF SAN PEDRO BERTH121-126","Line2":"","Line3":null,"CityName":"San Pedro","CityCode":"SPQ","CountryName":"United States","CountryCode":"US","PostalCode":"90731","PostOfficeBox":null,"FullAddress":"\\nPORT OF SAN PEDRO BERTH121-126\\n\\nSan Pedro 90731\\nCA\\nUnited States"}}]';
            const expectedResult: DeliveryLocation[] = [
                { addressLines: ['PORT OF SAN PEDRO BERTH121-126', 'San Pedro 90731', 'CA', 'United States'], beCode: 'USSPQTRM', label: 'Pune' },
            ];

            const result = parseFinalDeliveryLocation(input);

            expect(result).toEqual(expectedResult);
        });

        it('returns an empty array if input is undefined', () => {
            const result = parseFinalDeliveryLocation(undefined as any);

            expect(result).toBeTruthy();
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toEqual(0);
        });

        it('returns an empty array if input is an empty string', () => {
            const result = parseFinalDeliveryLocation('');

            expect(result).toBeTruthy();
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toEqual(0);
        });

        it('can handle an empty address string', () => {
            const input =
                '[{"FacilityCode":"INPNQ(CZ","FacilityCountryCode":null,"FacilityCityCode":null,"FacilityFunctionCode":null,"FacilityName":"Pune","PostalAddress":{"HouseNumber":"","SubDivisionName":"CA","Line1":"PORT OF SAN PEDRO BERTH121-126","Line2":"","Line3":null,"CityName":"San Pedro","CityCode":"SPQ","CountryName":"United States","CountryCode":"US","PostalCode":"90731","PostOfficeBox":null,"FullAddress":""}}]';
            const expectedResult: DeliveryLocation[] = [{ label: 'Pune', beCode: 'INPNQ(CZ', addressLines: [] }];

            const result = parseFinalDeliveryLocation(input);

            expect(result).toEqual(expectedResult);
        });
    });
});
