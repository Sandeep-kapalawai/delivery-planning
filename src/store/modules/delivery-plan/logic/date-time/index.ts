import { isEmpty } from 'lodash';
import { getFormattedDateInISO8601 } from 'destination/utilities';
import { ILocationFullAddress } from '@/interfaces';

export function getTimeFromDateTimeString({ date }: { date: string }) {
    if (!date) {
        return null;
    }

    const timeString = date.split('T')[1];
    if (!timeString) {
        return null;
    }

    const [HH, MM] = timeString.split(':');
    return `${HH}:${MM}`;
}

export function getDateTimeStringFromDateAndTimeValues({ date, time }: { date: string; time: string }): string | null {
    if (!date) {
        return null;
    }
    date = getFormattedDateInISO8601({ date });

    if (!time) {
        time = '00:00:00';
    } else {
        const timeArray = time.split(':');
        time = timeArray.length < 3 ? [...timeArray, '00'].join(':') : time;
    }

    return `${date}T${time}.000Z`;
}

export function getUTCDateTime({ date, utcOffsetMinutes }: { date: string | null; utcOffsetMinutes: number | null }): string | null {
    if (!date) {
        return null;
    }

    const dateObject = new Date(date);
    return new Date(dateObject.getTime() + -(utcOffsetMinutes || 0) * 60000).toISOString();
}

export function getTimeZoneForSelectedLocationAndDate({ location, date }: { location?: ILocationFullAddress; date?: string | null }): {
    timeZone: string;
    utcOffsetMinutes: number;
} {
    if (isEmpty(location)) {
        return {
            timeZone: 'UTC',
            utcOffsetMinutes: 0,
        };
    }

    const isDaylightSavingApplicable = location.isDaylightSavingObserved
        ? isDateWithinRange(date, location.daylightSavingTimeDisplacementStart, location.daylightSavingTimeDisplacementEnd)
        : false;
    if (!isDaylightSavingApplicable || !date) {
        return {
            timeZone: location.timeZoneCode,
            utcOffsetMinutes: location.utcOffsetMinutes,
        };
    }

    return {
        timeZone: location.daylightSavingTimeZoneCode,
        utcOffsetMinutes: location.daylightSavingUtcOffsetMinutes,
    };
}

function isDateWithinRange(compare?: string | null, start?: string, end?: string): boolean {
    if (!compare || !start || !end) {
        return false;
    }
    compare = getFormattedDateInISO8601({ date: compare }) as string;

    const YEAR = 2000;
    const [, month, date] = compare.split('T')[0].split('-');
    const [, startMonth, startDate] = start.split('T')[0].split('-');
    const [, endMonth, endDate] = end.split('T')[0].split('-');

    const compareDateObject = new Date(`${YEAR}-${month}-${date}`);
    const startDateObject = new Date(`${YEAR}-${startMonth}-${startDate}`);
    const endDateObject = new Date(`${YEAR}-${endMonth}-${endDate}`);

    return compareDateObject >= startDateObject && compareDateObject <= endDateObject;
}
