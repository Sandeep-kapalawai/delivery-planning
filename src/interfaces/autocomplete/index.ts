export interface ILocationFullAddress {
    searchPhrase: string;
    facilityCode: string;
    displayName: string;
    displayText: string;
    timeZoneCode: string;
    timeZoneName: string;
    timeZoneId: string;
    utcOffsetMinutes: number;
    isDaylightSavingObserved: boolean;
    daylightSavingTimeZoneCode: string;
    daylightSavingTimeZoneName: string;
    daylightSavingTimeZoneId: string;
    daylightSavingUtcOffsetMinutes: number;
    daylightSavingTimeDisplacementStart: string;
    daylightSavingTimeDisplacementEnd: string;
}

export interface ITransportProvider {
    partyCode: string;
    partyName: string;
}

export interface ILastUpdatedByUser {
    fullName: string;
    userName: string;
    emailAddress: string;
}