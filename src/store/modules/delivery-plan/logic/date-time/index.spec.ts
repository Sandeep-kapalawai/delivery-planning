import { ILocationFullAddress } from '@/interfaces';
import { getTimeFromDateTimeString, getDateTimeStringFromDateAndTimeValues, getUTCDateTime, getTimeZoneForSelectedLocationAndDate } from '.';

describe('delivery-plan store date-time logic', () => {
    describe('getTimeFromDateTimeString', () => {
        it.each([
            ['', null],
            ['2023-01-01', null],
            ['2023-01-01T12:30:00Z', '12:30'],
        ])('for date: %s, getTimeFromDateTimeString returns: %s', (date: string, expectedOutput: string | null) => {
            expect(getTimeFromDateTimeString({ date })).toBe(expectedOutput);
        });
    });

    describe('getDateTimeStringFromDateAndTimeValues', () => {
        it.each([
            ['', '', null],
            ['01 Jan 2023', '', '2023-01-01T00:00:00.000Z'],
            ['01 Jan 2023', '12:30', '2023-01-01T12:30:00.000Z'],
            ['01 Jan 2023', '12:30:30', '2023-01-01T12:30:30.000Z'],
        ])('for date: %s and time: %s, getDateTimeStringFromDateAndTimeValues returns: %s', (date: string, time: string, expectedOutput: string | null) => {
            expect(getDateTimeStringFromDateAndTimeValues({ date, time })).toBe(expectedOutput);
        });
    });

    describe('getUTCDateTime', () => {
        it.each([
            ['', 0, null],
            ['2023-01-01T12:30:00Z', 0, '2023-01-01T12:30:00.000Z'],
            ['2023-01-01T12:30:00Z', 30, '2023-01-01T12:00:00.000Z'],
            ['2023-01-01T12:30:00Z', -30, '2023-01-01T13:00:00.000Z'],
        ])('for date: %s and utc offset: %d, getUTCDateTime returns: %s', (date: string, utcOffsetMinutes: number, expectedOutput: string | null) => {
            expect(getUTCDateTime({ date, utcOffsetMinutes })).toBe(expectedOutput);
        });
    });

    describe('getTimeZoneForSelectedLocationAndDate', () => {
        it.each([
            ['returns UTC time zone when location is empty', {} as ILocationFullAddress, '', { timeZone: 'UTC', utcOffsetMinutes: 0 }],
            [
                'return location time zone when date is empty',
                {
                    timeZoneCode: 'CET',
                    utcOffsetMinutes: 60,
                    isDaylightSavingObserved: true,
                    daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
                    daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
                    daylightSavingTimeZoneCode: 'CEST',
                    daylightSavingUtcOffsetMinutes: 120,
                } as ILocationFullAddress,
                '',
                { timeZone: 'CET', utcOffsetMinutes: 60 },
            ],
            [
                'return location time zone when daylight saving date range is empty',
                {
                    timeZoneCode: 'CET',
                    utcOffsetMinutes: 60,
                    isDaylightSavingObserved: true,
                    daylightSavingTimeDisplacementStart: '',
                    daylightSavingTimeDisplacementEnd: '',
                    daylightSavingTimeZoneCode: 'CEST',
                    daylightSavingUtcOffsetMinutes: 120,
                } as ILocationFullAddress,
                '01 Jan 2022',
                { timeZone: 'CET', utcOffsetMinutes: 60 },
            ],
            [
                'return location time zone when date is present but out of daylight saving date range',
                {
                    timeZoneCode: 'CET',
                    utcOffsetMinutes: 60,
                    isDaylightSavingObserved: true,
                    daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
                    daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
                    daylightSavingTimeZoneCode: 'CEST',
                    daylightSavingUtcOffsetMinutes: 120,
                } as ILocationFullAddress,
                '01 Jan 2022',
                { timeZone: 'CET', utcOffsetMinutes: 60 },
            ],
            [
                'return location daylight saving time zone when date is present and within daylight saving date range',
                {
                    timeZoneCode: 'CET',
                    utcOffsetMinutes: 60,
                    isDaylightSavingObserved: true,
                    daylightSavingTimeDisplacementStart: '2022-03-27T00:00:00',
                    daylightSavingTimeDisplacementEnd: '2022-10-30T00:00:00',
                    daylightSavingTimeZoneCode: 'CEST',
                    daylightSavingUtcOffsetMinutes: 120,
                } as ILocationFullAddress,
                '01 Apr 2022',
                { timeZone: 'CEST', utcOffsetMinutes: 120 },
            ],
            [
                'return location time zone when daylight saving is not observed',
                {
                    timeZoneCode: 'IST',
                    utcOffsetMinutes: 330,
                    isDaylightSavingObserved: false,
                    daylightSavingTimeDisplacementStart: '',
                    daylightSavingTimeDisplacementEnd: '',
                    daylightSavingTimeZoneCode: '',
                    daylightSavingUtcOffsetMinutes: 0,
                } as ILocationFullAddress,
                '01 Jan 2022',
                { timeZone: 'IST', utcOffsetMinutes: 330 },
            ],
        ])('%s', (_: string, location: ILocationFullAddress, date: string | null, expectedOutput: { timeZone: string; utcOffsetMinutes: number }) => {
            expect(getTimeZoneForSelectedLocationAndDate({ location: location as ILocationFullAddress, date })).toStrictEqual(expectedOutput);
        });
    });
});
