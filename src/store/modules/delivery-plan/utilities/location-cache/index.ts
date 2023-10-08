import { ILocationFullAddress } from '@/interfaces';
import api from '@/data/api';

export class LocationCache {
    private _cache: Map<string, ILocationFullAddress> = new Map();

    async getLocation(facilityCode: string): Promise<ILocationFullAddress> {
        if (!facilityCode) {
            return {} as ILocationFullAddress;
        }

        if (!this._cache.has(facilityCode)) {
            try {
                const data: Array<ILocationFullAddress> = await api.autocomplete.getLocationFullAddress({ params: { searchPhrase: facilityCode } });
                data.forEach(this.setLocation.bind(this));
            } catch (error: any) {
                console.error(error);
            }
        }

        return this._cache.get(facilityCode) || ({} as ILocationFullAddress);
    }

    setLocation(location: ILocationFullAddress): void {
        if (!location || this._cache.has(location.facilityCode)) {
            return;
        }

        this._cache.set(location.facilityCode, location);
    }
}

export const locationCache = new LocationCache();
