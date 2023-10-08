import { cloneDeep } from 'lodash';
import { getFormattedDate } from 'destination/utilities';
import { getTimeFromDateTimeString, getDateTimeStringFromDateAndTimeValues, getUTCDateTime } from '../date-time';
import {
    ServiceLegTypeEnum,
    ServiceLegStatusEnum,
    ServicePlanTransportModeEnum,
    ServiceLegSpecialInstructionEnum,
    ServiceLegDeliveryTypeEnum,
    ServiceLegDeliveryTimeOptionEnum,
} from '@/static';
import { ICustomizableFieldPayload, ILocationFullAddress, IServiceLeg, IServiceLegPayload, IServicePlan, IServicePlanPayload } from '@/interfaces';

export function mapDeliveryPlanCustomProperties(deliveryPlan: IServicePlan): IServicePlan {
    if (!deliveryPlan || !deliveryPlan.serviceLegs || !deliveryPlan.serviceLegs.length) {
        return deliveryPlan;
    }

    deliveryPlan.serviceLegs = deliveryPlan.serviceLegs.map((leg) => mapDeliveryLegCustomProperties(leg));

    return deliveryPlan;
}

export function mapDeliveryLegCustomProperties(leg: IServiceLeg): IServiceLeg {
    if (!leg || !isServiceLegActive(leg)) {
        return leg;
    }

    // Pickup
    leg.pickupData.pickupOnDate = getFormattedDate({ date: leg.pickupData.pickupFromDateTime as string });
    leg.pickupData.pickupFromTime = leg.pickupData.isScheduledPickupFromTimeSetByUser
        ? getTimeFromDateTimeString({ date: leg.pickupData.pickupFromDateTime as string })
        : null;

    // Delivery
    leg.deliveryData.deliveryOnDate = getFormattedDate({ date: leg.deliveryData.deliveryFromDateTime as string });
    leg.deliveryData.deliveryFromTime = leg.deliveryData.isScheduledArrivalFromTimeSetByUser
        ? getTimeFromDateTimeString({ date: leg.deliveryData.deliveryFromDateTime as string })
        : null;
    leg.deliveryData.deliveryToTime = leg.deliveryData.isScheduledArrivalToTimeSetByUser
        ? getTimeFromDateTimeString({ date: leg.deliveryData.deliveryToDateTime as string })
        : null;

    return leg;
}

export function isServiceLegActive(leg: IServiceLeg): boolean {
    return (
        leg.status === ServiceLegStatusEnum.CREATED ||
        leg.status === ServiceLegStatusEnum.UPDATED ||
        leg.status === ServiceLegStatusEnum.SENT ||
        leg.status === ServiceLegStatusEnum.ACCEPTED
    );
}

export function isServiceLegSent(leg: IServiceLeg): boolean {
    return (
        (leg.status === ServiceLegStatusEnum.UPDATED || leg.status === ServiceLegStatusEnum.SENT || leg.status === ServiceLegStatusEnum.ACCEPTED) &&
        leg.deliveryOrder != null
    );
}

export function isServiceLegStatusSentOrAccepted(leg: IServiceLeg): boolean {
    return (leg.status === ServiceLegStatusEnum.SENT || leg.status === ServiceLegStatusEnum.ACCEPTED) && leg.deliveryOrder != null;
}

export function isServiceLegCancelled(leg: IServiceLeg): boolean {
    return leg.status === ServiceLegStatusEnum.CANCELLED;
}

export function isServiceLegRejected(leg: IServiceLeg): boolean {
    return leg.status === ServiceLegStatusEnum.REJECTED;
}

export function isEmptyReturnLeg(leg: IServiceLeg): boolean {
    return leg.legType === ServiceLegTypeEnum.EMPTY_RETURN_LEG;
}

export function isNotEmptyReturnLeg(leg: IServiceLeg): boolean {
    return !isEmptyReturnLeg(leg);
}

export function mapLocationToAddress(location: ILocationFullAddress): { beCode?: string; displayName?: string; displayText?: string } {
    if (!location) {
        return {
            beCode: undefined,
            displayName: undefined,
            displayText: undefined,
        };
    }

    return {
        beCode: location.facilityCode,
        displayName: location.displayName,
        displayText: location.displayText,
    };
}

export function mapDeliveryPlanToPaylaod(deliveryPlan: IServicePlan, isSendServicePlanRequest: boolean = false): IServicePlanPayload | null {
    if (!deliveryPlan || !deliveryPlan.serviceLegs || !deliveryPlan.serviceLegs.length) {
        return null;
    }

    const deliveryPlanClone = cloneDeep(deliveryPlan);
    const deliveryLegs = deliveryPlanClone.serviceLegs;
    const activeDeliveryLegs = deliveryLegs.filter(isServiceLegActive).filter(isNotEmptyReturnLeg);
    const lastActiveDeliveryLeg = activeDeliveryLegs[activeDeliveryLegs.length - 1];
    const activeEmptyReturnLegs = deliveryLegs.filter(isServiceLegActive).filter(isEmptyReturnLeg);
    const cancelledLegs = deliveryLegs.filter(isServiceLegCancelled);
    const rejectedLegs = deliveryLegs.filter(isServiceLegRejected);

    activeEmptyReturnLegs.forEach((leg) => {
        if (leg.status === ServiceLegStatusEnum.CREATED) {
            /** If the status of ERL is CREATED, then serviceLegId should be removed from payload */
            delete leg.serviceLegId;
        }

        /** Pickup address for ERL should be same as delivery address of the last active delivery leg */
        leg.pickupData.pickUpAddress = lastActiveDeliveryLeg?.deliveryData.deliveryAddress;
        leg.pickupData.pickupDateTimeZone = lastActiveDeliveryLeg?.deliveryData.deliveryTimeZone;
        leg.pickupData.pickupUtcOffsetMinutes = lastActiveDeliveryLeg?.deliveryData.deliveryUtcOffsetMinutes;
    });

    const deliveryLegsForPayload: Array<IServiceLeg> = [...activeDeliveryLegs, ...activeEmptyReturnLegs, ...cancelledLegs, ...rejectedLegs];
    const deliveryPlanPayload: IServicePlanPayload = {
        deliveryPlanType: deliveryPlan.deliveryPlanType,
        isFinalized: deliveryPlan.isFinalized ?? false,
        isStopOffLocation: deliveryPlan.isStopOffLocation || false,
        isSendServicePlanRequest,
        serviceLegs: deliveryLegsForPayload.map(mapDeliveryLegToPaylaod),
    };

    return deliveryPlanPayload;
}

function mapDeliveryLegToPaylaod(deliveryLeg: IServiceLeg): IServiceLegPayload {
    let pickupFromDateTime, pickupFromDateTimeUTC;
    let deliveryFromDateTime, deliveryFromDateTimeUTC, deliveryToDateTime, deliveryToDateTimeUTC;

    if (isServiceLegActive(deliveryLeg)) {
        pickupFromDateTime = getDateTimeStringFromDateAndTimeValues({
            date: deliveryLeg.pickupData.pickupOnDate as string,
            time: deliveryLeg.pickupData.pickupFromTime as string,
        });
        pickupFromDateTimeUTC = getUTCDateTime({ date: pickupFromDateTime, utcOffsetMinutes: deliveryLeg.pickupData.pickupUtcOffsetMinutes });

        deliveryFromDateTime = getDateTimeStringFromDateAndTimeValues({
            date: deliveryLeg.deliveryData.deliveryOnDate as string,
            time: deliveryLeg.deliveryData.deliveryFromTime as string,
        });
        deliveryFromDateTimeUTC = getUTCDateTime({ date: deliveryFromDateTime, utcOffsetMinutes: deliveryLeg.deliveryData.deliveryUtcOffsetMinutes });

        deliveryToDateTime =
            deliveryLeg.deliveryData.deliveryTimeOption === ServiceLegDeliveryTimeOptionEnum.TIME_SLOT
                ? getDateTimeStringFromDateAndTimeValues({
                      date: deliveryLeg.deliveryData.deliveryOnDate as string,
                      time: deliveryLeg.deliveryData.deliveryToTime as string,
                  })
                : null;
        deliveryToDateTimeUTC = getUTCDateTime({ date: deliveryToDateTime, utcOffsetMinutes: deliveryLeg.deliveryData.deliveryUtcOffsetMinutes });
    } else {
        pickupFromDateTime = deliveryLeg.pickupData.pickupFromDateTime;
        pickupFromDateTimeUTC = deliveryLeg.pickupData.pickupFromDateTimeUTC;

        deliveryFromDateTime = deliveryLeg.deliveryData.deliveryFromDateTime;
        deliveryFromDateTimeUTC = deliveryLeg.deliveryData.deliveryFromDateTimeUTC;
        deliveryToDateTime = deliveryLeg.deliveryData.deliveryToDateTime;
        deliveryToDateTimeUTC = deliveryLeg.deliveryData.deliveryToDateTimeUTC;
    }

    return {
        sequence: deliveryLeg.sequence,
        serviceLegId: deliveryLeg.serviceLegId,
        legType: deliveryLeg.legType,
        version: deliveryLeg.version,
        status: deliveryLeg.status,
        pickupData: {
            pickUpAddress: deliveryLeg.pickupData.pickUpAddress,
            specialInstruction: deliveryLeg.pickupData.specialInstruction,
            pickupDateTimeZone: deliveryLeg.pickupData.pickupDateTimeZone,
            pickupFromDateTime,
            pickupFromDateTimeUTC,
            pickupUtcOffsetMinutes: deliveryLeg.pickupData.pickupUtcOffsetMinutes,
            isScheduledPickupFromTimeSetByUser: deliveryLeg.pickupData.isScheduledPickupFromTimeSetByUser,
        },
        deliveryData: {
            deliveryAddress: deliveryLeg.deliveryData.deliveryAddress,
            deliveryReference: deliveryLeg.deliveryData.deliveryReference,
            deliveryType: deliveryLeg.deliveryData.deliveryType,
            deliveryTimeZone: deliveryLeg.deliveryData.deliveryTimeZone,
            deliveryFromDateTime,
            deliveryFromDateTimeUTC,
            deliveryToDateTime,
            deliveryToDateTimeUTC,
            deliveryUtcOffsetMinutes: deliveryLeg.deliveryData.deliveryUtcOffsetMinutes,
            isScheduledArrivalFromTimeSetByUser: deliveryLeg.deliveryData.isScheduledArrivalFromTimeSetByUser,
            isScheduledArrivalToTimeSetByUser: deliveryLeg.deliveryData.isScheduledArrivalToTimeSetByUser,
        },
        transportData: {
            transportMode: deliveryLeg.transportData.transportMode || ServicePlanTransportModeEnum.ROAD,
            provider: deliveryLeg.transportData.provider,
            additionalInstruction: deliveryLeg.transportData.additionalInstruction,
        },
    };
}

export function mapAdditionalReferencesToPaylaod(additionalReferences: Map<number, ICustomizableFieldPayload>): {
    customizableFields: Array<ICustomizableFieldPayload>;
} | null {
    if (!additionalReferences || !additionalReferences.size) {
        return null;
    }

    return { customizableFields: Array.from(additionalReferences.values()) };
}

export function createEmptyDeliveryLeg({
    legType,
    copyLastLegDeliveryToPickup,
    lastActiveDeliveryLeg,
}: {
    legType: ServiceLegTypeEnum;
    copyLastLegDeliveryToPickup?: boolean;
    lastActiveDeliveryLeg?: IServiceLeg;
}): IServiceLeg {
    const sequence = (lastActiveDeliveryLeg?.sequence || 100) + 1;

    const { pickUpAddress, pickupDateTimeZone, pickupUtcOffsetMinutes } =
        copyLastLegDeliveryToPickup && lastActiveDeliveryLeg
            ? {
                  pickUpAddress: lastActiveDeliveryLeg.deliveryData.deliveryAddress,
                  pickupDateTimeZone: lastActiveDeliveryLeg.deliveryData.deliveryTimeZone,
                  pickupUtcOffsetMinutes: lastActiveDeliveryLeg.deliveryData.deliveryUtcOffsetMinutes,
              }
            : {
                  pickUpAddress: {
                      beCode: undefined,
                      displayName: undefined,
                      displayText: undefined,
                  },
                  pickupDateTimeZone: undefined,
                  pickupUtcOffsetMinutes: null,
              };

    return {
        sequence: legType === ServiceLegTypeEnum.EMPTY_RETURN_LEG ? 1000 : sequence,
        serviceLegId: undefined,
        legType: legType ?? ServiceLegTypeEnum.SERVICE_LEG,
        status: ServiceLegStatusEnum.CREATED,
        pickupData: {
            pickUpAddress,
            specialInstruction: ServiceLegSpecialInstructionEnum.NONE,
            pickupDateTimeZone,
            pickupFromDateTimeUTC: undefined,
            pickupFromDateTime: undefined,
            pickupUtcOffsetMinutes,
            isScheduledPickupFromTimeSetByUser: false,
        },
        deliveryData: {
            deliveryAddress: {
                beCode: undefined,
                displayName: undefined,
                displayText: undefined,
            },
            deliveryReference: undefined,
            deliveryType: legType === ServiceLegTypeEnum.EMPTY_RETURN_LEG ? null : ServiceLegDeliveryTypeEnum.LIVE_UNLOAD,
            deliveryTimeOption: ServiceLegDeliveryTimeOptionEnum.SPECIFIC_TIME,
            deliveryTimeZone: undefined,
            deliveryFromDateTimeUTC: undefined,
            deliveryFromDateTime: undefined,
            deliveryToDateTimeUTC: undefined,
            deliveryToDateTime: undefined,
            deliveryUtcOffsetMinutes: null,
            isScheduledArrivalFromTimeSetByUser: false,
            isScheduledArrivalToTimeSetByUser: false,
        },
        transportData: {
            transportMode: ServicePlanTransportModeEnum.ROAD,
            provider: {
                providerName: undefined,
                providerBECode: undefined,
            },
            additionalInstruction: undefined,
        },
    } as IServiceLeg;
}

export function createDuplicateDeliveryLeg({ leg, lastActiveDeliveryLeg }: { leg: IServiceLeg; lastActiveDeliveryLeg?: IServiceLeg }): IServiceLeg {
    const sequence = (lastActiveDeliveryLeg?.sequence || 100) + 1;

    const duplicateLeg = cloneDeep(leg);
    duplicateLeg.sequence = sequence;
    duplicateLeg.serviceLegId = undefined;
    duplicateLeg.status = ServiceLegStatusEnum.CREATED;
    duplicateLeg.statusBeforeAction = undefined;
    duplicateLeg.deliveryOrder = undefined;
    duplicateLeg.actionTakenAsPartOfDeliveryOrder = undefined;
    duplicateLeg.version = 1;

    return duplicateLeg;
}
