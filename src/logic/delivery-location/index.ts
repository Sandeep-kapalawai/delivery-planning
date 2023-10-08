import { DeliveryLocation } from '@/interfaces';

export function parseAddressLines(text: string | undefined): string[] {
    if (!text) {
        return [];
    }

    return text
        .split(/\r\n|\n/)
        .map((line) => line.trim())
        .filter((item) => item);
}

export function parseFinalDeliveryLocation(apiResponse: string): DeliveryLocation[] {
    if (!apiResponse) {
        return [];
    }

    const locationObjects = JSON.parse(apiResponse);

    const locations: DeliveryLocation[] = locationObjects.map((item: any) => ({
        beCode: item['FacilityCode'],
        label: item['FacilityName'],
        addressLines: parseAddressLines(item?.PostalAddress['FullAddress']),
    }));
    return locations;
}
