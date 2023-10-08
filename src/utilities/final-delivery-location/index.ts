import { parseMultilineText } from 'destination/utilities';
import { IFinalDeliveryLocation } from '@/interfaces/list-view';

export function parseFinalDeliveryLocationFromApiResponse(apiResponse: string): IFinalDeliveryLocation[] {
    if (!apiResponse) {
        return [];
    }

    const locationObjects = JSON.parse(apiResponse);
    const locations: IFinalDeliveryLocation[] = locationObjects.map((item: any) => {
        const addressLines = item?.PostalAddress?.FullAddress ? parseMultilineText(item.PostalAddress.FullAddress) : [];
        return {
            beCode: item['FacilityCode'],
            name: item['FacilityName'],
            addressLines: addressLines,
        };
    });

    return locations;
}
