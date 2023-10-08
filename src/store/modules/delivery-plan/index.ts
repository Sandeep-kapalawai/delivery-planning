import { Module } from 'vuex';
import { IRootState } from '../../interfaces';
import { IState } from './interfaces';
import { DeliveryPlanGetterEnum, DeliveryPlanMutationEnum, DeliveryPlanActionEnum } from './static';
import {
    mapDeliveryPlanCustomProperties,
    mapDeliveryLegCustomProperties,
    isEmptyReturnLeg,
    isNotEmptyReturnLeg,
    isServiceLegActive,
    isServiceLegSent,
    isServiceLegCancelled,
    isServiceLegRejected,
    mapDeliveryPlanToPaylaod,
    mapLocationToAddress,
    createEmptyDeliveryLeg,
    createDuplicateDeliveryLeg,
    getTimeZoneForSelectedLocationAndDate,
    mapAdditionalReferencesToPaylaod,
} from './logic';
import { locationCache } from './utilities';
import api from '@/data/api';
import {
    ICustomizableField,
    ICustomizableFieldPayload,
    ICustomizableFieldRequestParams,
    ILocationFullAddress,
    IServiceLeg,
    IServicePlan,
    ITransportProvider,
} from '@/interfaces';
import {
    DeliveryPlanTypeEnum,
    RelatedObjectTypeEnum,
    ServiceLegDirectionToMoveEnum,
    ServiceLegDeliveryTimeOptionEnum,
    ServiceLegDeliveryTypeEnum,
    ServiceLegSpecialInstructionEnum,
    ServiceLegStatusEnum,
    ServiceLegTypeEnum,
    ServicePlanTransportModeEnum,
} from '@/static';

const getDefaultState = (): IState => ({
    deliveryPlan: {
        isFetching: false,
        isSaving: false,
        isSending: false,
        response: {} as IServicePlan,
    },
    additionalReference: {
        isFetching: false,
        response: [],
        payload: new Map(),
    },
});

const deliveryPlan: Module<IState, IRootState> = {
    namespaced: true,

    state: getDefaultState,

    getters: {
        [DeliveryPlanGetterEnum.GET_DELIVERY_PLAN](state): {
            isFetching: boolean;
            response: IServicePlan;
        } {
            return state.deliveryPlan;
        },
        [DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS](_, getters): Array<IServiceLeg> {
            const { response }: { response: IServicePlan } = getters[DeliveryPlanGetterEnum.GET_DELIVERY_PLAN];
            return response?.serviceLegs || [];
        },
        [DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS](_, getters): Array<IServiceLeg> {
            const deliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS];
            return deliveryLegs.filter(isServiceLegActive).filter(isNotEmptyReturnLeg);
        },
        [DeliveryPlanGetterEnum.GET_FIRST_ACTIVE_DELIVERY_LEG](_, getters): IServiceLeg | undefined {
            const activeDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS];
            return activeDeliveryLegs.length ? activeDeliveryLegs[0] : undefined;
        },
        [DeliveryPlanGetterEnum.GET_LAST_ACTIVE_DELIVERY_LEG](_, getters): IServiceLeg | undefined {
            const activeDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS];
            return activeDeliveryLegs.length ? activeDeliveryLegs[activeDeliveryLegs.length - 1] : undefined;
        },
        [DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG](_, getters): IServiceLeg {
            const deliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS];
            const emptyReturnLegs = deliveryLegs.filter(isServiceLegActive).filter(isEmptyReturnLeg);
            return emptyReturnLegs[0];
        },
        [DeliveryPlanGetterEnum.GET_CANCELLED_LEGS](_, getters): Array<IServiceLeg> {
            const deliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS];
            return deliveryLegs.filter(isServiceLegCancelled);
        },
        [DeliveryPlanGetterEnum.GET_REJECTED_LEGS](_, getters): Array<IServiceLeg> {
            const deliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS];
            return deliveryLegs.filter(isServiceLegRejected);
        },
        [DeliveryPlanGetterEnum.GET_ADDITIONAL_REFERENCE](state): {
            isFetching: boolean;
            response: Array<ICustomizableField>;
            payload: Map<number, ICustomizableFieldPayload>;
        } {
            return state.additionalReference;
        },
        [DeliveryPlanGetterEnum.GET_IS_STOP_OFF_LOCATION](state) {
            return state.deliveryPlan.response.isStopOffLocation;
        },
    },

    mutations: {
        // Delivery Plan
        [DeliveryPlanMutationEnum.RESET_STATE](state) {
            Object.assign(state, getDefaultState());
        },
        [DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.STARTED](state) {
            state.deliveryPlan.isFetching = true;
        },
        [DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.SUCCEEDED](state, response: IServicePlan) {
            state.deliveryPlan.isFetching = false;
            state.deliveryPlan.response = response;
        },
        [DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.FAILED](state) {
            state.deliveryPlan.isFetching = false;
        },
        [DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.STARTED](state) {
            state.deliveryPlan.isSaving = true;
        },
        [DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.SUCCEEDED](state) {
            state.deliveryPlan.isSaving = false;
        },
        [DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.FAILED](state) {
            state.deliveryPlan.isSaving = false;
        },
        [DeliveryPlanMutationEnum.CANCEL_DELIVERY_PLAN]: (state) => {
            state.deliveryPlan?.response?.serviceLegs.filter(isServiceLegSent).forEach((leg) => {
                leg.statusBeforeAction = leg.status;
                leg.status = ServiceLegStatusEnum.CANCELLED;
                leg.actionTakenAsPartOfDeliveryOrder = leg.deliveryOrder;
            });
        },
        [DeliveryPlanMutationEnum.SET_DELIVERY_PLAN_TYPE](_, { plan, deliveryPlanType }: { plan: IServicePlan; deliveryPlanType: DeliveryPlanTypeEnum }) {
            plan.deliveryPlanType = deliveryPlanType;
        },
        [DeliveryPlanMutationEnum.SET_IS_STOP_OFF_LOCATION]: (state, { isStopOffLocation }: { isStopOffLocation: boolean }) => {
            state.deliveryPlan.response = { ...state.deliveryPlan.response, isStopOffLocation };
        },

        // Delivery Leg
        [DeliveryPlanMutationEnum.SORT_DELIVERY_LEGS](state) {
            const activeServiceLegs: Array<IServiceLeg> = [],
                inactiveServiceLegs: Array<IServiceLeg> = [];
            state.deliveryPlan.response.serviceLegs.forEach((leg) => (isServiceLegActive(leg) ? activeServiceLegs.push(leg) : inactiveServiceLegs.push(leg)));

            state.deliveryPlan.response.serviceLegs = [...activeServiceLegs.sort((leg1, leg2) => leg1.sequence - leg2.sequence), ...inactiveServiceLegs];
        },
        [DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS](state) {
            let sequence: number = 101;
            state.deliveryPlan.response.serviceLegs
                .filter(isServiceLegActive)
                .filter(isNotEmptyReturnLeg)
                .forEach((leg) => {
                    leg.sequence = sequence++;
                });
        },
        [DeliveryPlanMutationEnum.SWAP_DELIVERY_LEGS](_, { leg1, leg2 }: { leg1: IServiceLeg; leg2: IServiceLeg }) {
            const swap: number = leg1.sequence;
            leg1.sequence = leg2.sequence;
            leg2.sequence = swap;
        },
        [DeliveryPlanMutationEnum.ADD_DELIVERY_LEG](state, { leg }: { leg: IServiceLeg }) {
            if (!state.deliveryPlan.response) {
                return;
            }

            state.deliveryPlan.response.serviceLegs = [...state.deliveryPlan.response.serviceLegs, leg];
        },
        [DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG](state, { leg }: { leg: IServiceLeg }) {
            state.deliveryPlan.response.serviceLegs = state.deliveryPlan.response.serviceLegs.filter((serviceLeg) => serviceLeg !== leg);
        },
        [DeliveryPlanMutationEnum.CANCEL_DELIVERY_LEG]: (state, { leg }: { leg: IServiceLeg }) => {
            state.deliveryPlan?.response?.serviceLegs
                .filter((sl) => sl.deliveryOrder === leg.deliveryOrder)
                .forEach((sl) => {
                    sl.statusBeforeAction = sl.status;
                    sl.status = ServiceLegStatusEnum.CANCELLED;
                    sl.actionTakenAsPartOfDeliveryOrder = leg.deliveryOrder;
                });
        },
        [DeliveryPlanMutationEnum.ACCEPT_DELIVERY_LEG]: (state, { leg }: { leg: IServiceLeg }) => {
            leg.statusBeforeAction = leg.status;
            state.deliveryPlan?.response?.serviceLegs
                .filter((sl) => sl.deliveryOrder === leg.deliveryOrder)
                .forEach((sl) => (sl.status = ServiceLegStatusEnum.ACCEPTED));
        },
        [DeliveryPlanMutationEnum.REJECT_DELIVERY_LEG]: (state, { leg }: { leg: IServiceLeg }) => {
            state.deliveryPlan?.response?.serviceLegs
                .filter((sl) => sl.deliveryOrder === leg.deliveryOrder)
                .forEach((sl) => {
                    sl.statusBeforeAction = sl.status;
                    sl.status = ServiceLegStatusEnum.REJECTED;
                    sl.actionTakenAsPartOfDeliveryOrder = leg.deliveryOrder;
                });
        },
        [DeliveryPlanMutationEnum.CANCEL_OR_REJECT_EMPTY_RETURN_LEG]: (
            _,
            { leg, cancelledOrRejectedLeg }: { leg: IServiceLeg; cancelledOrRejectedLeg: IServiceLeg },
        ) => {
            leg.statusBeforeAction = leg.status;
            leg.status = cancelledOrRejectedLeg.status;
            leg.actionTakenAsPartOfDeliveryOrder = cancelledOrRejectedLeg.deliveryOrder;
        },
        [DeliveryPlanMutationEnum.UNDO_CANCEL_REJECT_DELIVERY_LEG]: (state, { leg }: { leg: IServiceLeg }) => {
            state.deliveryPlan?.response?.serviceLegs
                .filter((sl) => sl.actionTakenAsPartOfDeliveryOrder === leg.actionTakenAsPartOfDeliveryOrder)
                .forEach((sl) => {
                    sl.status = sl.statusBeforeAction as ServiceLegStatusEnum;
                    sl.statusBeforeAction = undefined;
                    sl.actionTakenAsPartOfDeliveryOrder = undefined;
                });
        },

        // Pick-up
        async [DeliveryPlanMutationEnum.SET_PICKUP_TIMEZONE_AND_OFFSET](
            _,
            { leg, location, date }: { leg: IServiceLeg; location?: ILocationFullAddress; date?: string | null },
        ) {
            location = location ?? (await locationCache.getLocation(leg.pickupData.pickUpAddress.beCode as string));
            date = date ?? leg.pickupData.pickupOnDate;

            const { timeZone, utcOffsetMinutes } = getTimeZoneForSelectedLocationAndDate({ location, date });
            leg.pickupData.pickupDateTimeZone = timeZone;
            leg.pickupData.pickupUtcOffsetMinutes = utcOffsetMinutes;
        },
        [DeliveryPlanMutationEnum.SET_PICKUP_LOCATION](_, { leg, location }: { leg: IServiceLeg; location: ILocationFullAddress }) {
            leg.pickupData.pickUpAddress = mapLocationToAddress(location);
            locationCache.setLocation(location);
        },
        [DeliveryPlanMutationEnum.SET_PICKUP_ON_DATE](_, { leg, date }: { leg: IServiceLeg; date: string }) {
            leg.pickupData.pickupOnDate = date;
            leg.pickupData.isScheduledPickupFromTimeSetByUser = !!(leg.pickupData.pickupOnDate && leg.pickupData.pickupFromTime);
        },
        [DeliveryPlanMutationEnum.SET_PICKUP_FROM_TIME](_, { leg, time }: { leg: IServiceLeg; time: string }) {
            leg.pickupData.pickupFromTime = time;
            leg.pickupData.isScheduledPickupFromTimeSetByUser = !!(leg.pickupData.pickupOnDate && leg.pickupData.pickupFromTime);
        },
        [DeliveryPlanMutationEnum.SET_SPECIAL_INSTRUCTION]: (
            _,
            { leg, specialInstruction }: { leg: IServiceLeg; specialInstruction: ServiceLegSpecialInstructionEnum },
        ) => {
            leg.pickupData.specialInstruction = specialInstruction;
        },

        // Delivery
        async [DeliveryPlanMutationEnum.SET_DELIVERY_TIMEZONE_AND_OFFSET](
            _,
            { leg, location, date }: { leg: IServiceLeg; location?: ILocationFullAddress; date?: string | null },
        ) {
            location = location ?? (await locationCache.getLocation(leg.deliveryData.deliveryAddress.beCode as string));
            date = date ?? leg.deliveryData.deliveryOnDate;

            const { timeZone, utcOffsetMinutes } = getTimeZoneForSelectedLocationAndDate({ location, date });
            leg.deliveryData.deliveryTimeZone = timeZone;
            leg.deliveryData.deliveryUtcOffsetMinutes = utcOffsetMinutes;
        },
        [DeliveryPlanMutationEnum.SET_DELIVERY_LOCATION](_, { leg, location }: { leg: IServiceLeg; location: ILocationFullAddress }) {
            leg.deliveryData.deliveryAddress = mapLocationToAddress(location);
            locationCache.setLocation(location);
        },
        [DeliveryPlanMutationEnum.SET_DELIVERY_ON_DATE](_, { leg, date }: { leg: IServiceLeg; date: string }) {
            leg.deliveryData.deliveryOnDate = date;
            leg.deliveryData.isScheduledArrivalFromTimeSetByUser = !!(leg.deliveryData.deliveryOnDate && leg.deliveryData.deliveryFromTime);
            leg.deliveryData.isScheduledArrivalToTimeSetByUser = !!(leg.deliveryData.deliveryOnDate && leg.deliveryData.deliveryToTime);
        },
        [DeliveryPlanMutationEnum.SET_DELIVERY_TIME_OPTION]: (
            _,
            { leg, deliveryTimeOption }: { leg: IServiceLeg; deliveryTimeOption: ServiceLegDeliveryTimeOptionEnum },
        ) => {
            leg.deliveryData.deliveryTimeOption = deliveryTimeOption;
            if (deliveryTimeOption === ServiceLegDeliveryTimeOptionEnum.TIME_SLOT) {
                leg.deliveryData.isScheduledArrivalToTimeSetByUser = !!(leg.deliveryData.deliveryOnDate && leg.deliveryData.deliveryToTime);
            } else {
                leg.deliveryData.isScheduledArrivalToTimeSetByUser = false;
            }
        },
        [DeliveryPlanMutationEnum.SET_DELIVERY_FROM_TIME](_, { leg, time }: { leg: IServiceLeg; time: string }) {
            leg.deliveryData.deliveryFromTime = time;
            leg.deliveryData.isScheduledArrivalFromTimeSetByUser = !!(leg.deliveryData.deliveryOnDate && leg.deliveryData.deliveryFromTime);
        },
        [DeliveryPlanMutationEnum.SET_DELIVERY_TO_TIME](_, { leg, time }: { leg: IServiceLeg; time: string }) {
            leg.deliveryData.deliveryToTime = time;
            leg.deliveryData.isScheduledArrivalToTimeSetByUser = !!(leg.deliveryData.deliveryOnDate && leg.deliveryData.deliveryToTime);
        },
        [DeliveryPlanMutationEnum.SET_DELIVERY_REFERENCE]: (_, { leg, deliveryReference }: { leg: IServiceLeg; deliveryReference: string }) => {
            leg.deliveryData.deliveryReference = deliveryReference;
        },
        [DeliveryPlanMutationEnum.SET_DELIVERY_TYPE]: (_, { leg, deliveryType }: { leg: IServiceLeg; deliveryType: ServiceLegDeliveryTypeEnum }) => {
            leg.deliveryData.deliveryType = deliveryType;
        },

        // Transport
        [DeliveryPlanMutationEnum.SET_TRANSPORT_MODE](_, { leg, transportMode }: { leg: IServiceLeg; transportMode: ServicePlanTransportModeEnum }) {
            leg.transportData.transportMode = transportMode;
            leg.deliveryData.deliveryType = ServiceLegDeliveryTypeEnum.LIVE_UNLOAD;
        },
        [DeliveryPlanMutationEnum.SET_TRANSPORT_PROVIDER]: (_, { leg, provider }: { leg: IServiceLeg; provider?: ITransportProvider }) => {
            leg.transportData.provider = {
                providerBECode: provider?.partyCode,
                providerName: provider?.partyName,
            };
        },
        [DeliveryPlanMutationEnum.SET_ADDITIONAL_INSTRUCTION]: (_, { leg, additionalInstruction }: { leg: IServiceLeg; additionalInstruction: string }) => {
            leg.transportData.additionalInstruction = additionalInstruction;
        },

        // Additional Reference(s)
        [DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.STARTED](state) {
            state.additionalReference.isFetching = true;
            state.additionalReference.payload = new Map();
        },
        [DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.SUCCEEDED](state, response: Array<ICustomizableField>) {
            state.additionalReference.isFetching = false;
            state.additionalReference.response = response;
        },
        [DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.FAILED](state) {
            state.additionalReference.isFetching = false;
        },
        [DeliveryPlanMutationEnum.SET_ADDITIONAL_REFERENCE_FIELD]: (
            state,
            {
                relatedObjectId,
                relatedObjectType,
                field,
            }: { relatedObjectId: number | string; relatedObjectType: RelatedObjectTypeEnum; field: ICustomizableField },
        ) => {
            const fieldInState = state.additionalReference?.response?.find((item) => item.fieldReferenceId === field.fieldReferenceId);
            if (!fieldInState) {
                return;
            }

            fieldInState.value = field.value;
            state.additionalReference.response = [...state.additionalReference?.response]; // To trigger reactivity

            state.additionalReference.payload.set(field.fieldReferenceId, {
                relatedObjectId,
                relatedObjectType,
                fieldReferenceId: field.fieldReferenceId,
                referenceCode: field.referenceCode,
                value: field.value,
            });
        },
    },

    actions: {
        // Delivery Plan
        [DeliveryPlanActionEnum.RESET_STATE]({ commit }) {
            commit(DeliveryPlanActionEnum.RESET_STATE);
        },
        async [DeliveryPlanActionEnum.FETCH_DELIVERY_PLAN]({ commit }, { deliveryPlanId }: { deliveryPlanId: number | string }) {
            try {
                commit(DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.STARTED);
                const response = await api.deliveryPlan.getFCLServicePlans(deliveryPlanId);
                commit(DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.SUCCEEDED, mapDeliveryPlanCustomProperties(response));
            } catch (error: any) {
                commit(DeliveryPlanMutationEnum.FETCH_DELIVERY_PLAN.FAILED);
                throw error;
            }
        },
        async [DeliveryPlanActionEnum.FETCH_ADDITIONAL_REFERENCE]({ commit }, { params }: { params: ICustomizableFieldRequestParams }) {
            try {
                commit(DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.STARTED);
                const response = await api.deliveryPlan.getCustomizableField({ params });
                commit(DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.SUCCEEDED, response);
            } catch (error: any) {
                commit(DeliveryPlanMutationEnum.FETCH_ADDITIONAL_REFERENCE.FAILED);
                throw error;
            }
        },
        async [DeliveryPlanActionEnum.SAVE_DELIVERY_PLAN](
            { state, commit },
            { deliveryPlanId, isSendServicePlanRequest }: { deliveryPlanId: number | string; isSendServicePlanRequest: boolean },
        ) {
            const deliveryPlanPayload = mapDeliveryPlanToPaylaod(state.deliveryPlan.response, isSendServicePlanRequest);
            const additionalReferencesPayload = mapAdditionalReferencesToPaylaod(state.additionalReference.payload);
            if (!deliveryPlanPayload) {
                return;
            }

            try {
                commit(DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.STARTED);
                await Promise.all([
                    api.deliveryPlan.updateFCLServicePlans(deliveryPlanId, deliveryPlanPayload),
                    additionalReferencesPayload ? api.deliveryPlan.updateCustomizableField(additionalReferencesPayload) : Promise.resolve(),
                ]);
                commit(DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.SUCCEEDED);
            } catch (error: any) {
                commit(DeliveryPlanMutationEnum.SAVE_DELIVERY_PLAN.FAILED);
                throw error;
            }
        },
        [DeliveryPlanActionEnum.CANCEL_DELIVERY_PLAN]({ commit, dispatch }) {
            commit(DeliveryPlanMutationEnum.CANCEL_DELIVERY_PLAN);
            dispatch(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
            dispatch(DeliveryPlanActionEnum.CHECK_AND_REMOVE_EMPTY_RETURN_LEG);
            dispatch(DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION);
            commit(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);
        },
        [DeliveryPlanActionEnum.SET_IS_STOP_OFF_LOCATION]({ commit, dispatch }, { isStopOffLocation }: { isStopOffLocation: boolean }) {
            commit(DeliveryPlanMutationEnum.SET_IS_STOP_OFF_LOCATION, { isStopOffLocation });

            if (!isStopOffLocation) {
                dispatch(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
            }
        },

        // Delivery Leg
        [DeliveryPlanActionEnum.ADD_DELIVERY_LEG]({ commit, dispatch, getters }) {
            const activeDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS];
            const lastActiveDeliveryLeg: IServiceLeg = activeDeliveryLegs[activeDeliveryLegs.length - 1];

            commit(DeliveryPlanMutationEnum.ADD_DELIVERY_LEG, {
                leg: createEmptyDeliveryLeg({
                    legType: ServiceLegTypeEnum.SERVICE_LEG,
                    copyLastLegDeliveryToPickup: true,
                    lastActiveDeliveryLeg,
                }),
            });
            dispatch(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
        },
        [DeliveryPlanActionEnum.COPY_DELIVERY_LEG]({ commit, dispatch, getters }, { leg }: { leg: IServiceLeg }) {
            const activeDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS];
            const lastActiveDeliveryLeg: IServiceLeg = activeDeliveryLegs[activeDeliveryLegs.length - 1];
            const duplicateDeliveryLeg = createDuplicateDeliveryLeg({ leg, lastActiveDeliveryLeg });

            commit(DeliveryPlanMutationEnum.ADD_DELIVERY_LEG, { leg: mapDeliveryLegCustomProperties(duplicateDeliveryLeg) });
            dispatch(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
        },
        [DeliveryPlanActionEnum.REMOVE_DELIVERY_LEG]({ commit, dispatch }, { leg }: { leg: IServiceLeg }) {
            commit(DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG, { leg });
            dispatch(DeliveryPlanActionEnum.CHECK_AND_REMOVE_EMPTY_RETURN_LEG);
            dispatch(DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION);
            commit(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);
        },
        [DeliveryPlanActionEnum.CANCEL_DELIVERY_LEG]({ commit, dispatch }, { leg }: { leg: IServiceLeg }) {
            commit(DeliveryPlanMutationEnum.CANCEL_DELIVERY_LEG, { leg });
            dispatch(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
            dispatch(DeliveryPlanActionEnum.CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG, { cancelledOrRejectedLeg: leg });
            dispatch(DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION);
            commit(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);
        },
        [DeliveryPlanActionEnum.MOVE_DELIVERY_LEG]({ commit, getters }, { leg, direction }: { leg: IServiceLeg; direction: ServiceLegDirectionToMoveEnum }) {
            const activeDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS];
            const indexOfLegToSwap: number = activeDeliveryLegs.indexOf(leg);
            const indexOfLegToSwapWith: number = direction === ServiceLegDirectionToMoveEnum.UP ? indexOfLegToSwap - 1 : indexOfLegToSwap + 1;
            const legToSwapWith = activeDeliveryLegs[indexOfLegToSwapWith];
            if (!legToSwapWith) {
                return;
            }

            commit(DeliveryPlanMutationEnum.SWAP_DELIVERY_LEGS, { leg1: leg, leg2: legToSwapWith });
            commit(DeliveryPlanMutationEnum.SORT_DELIVERY_LEGS);
        },
        [DeliveryPlanActionEnum.ACCEPT_DELIVERY_LEG]({ commit }, { leg }: { leg: IServiceLeg }) {
            commit(DeliveryPlanMutationEnum.ACCEPT_DELIVERY_LEG, { leg });
        },
        [DeliveryPlanActionEnum.REJECT_DELIVERY_LEG]({ commit, dispatch }, { leg }: { leg: IServiceLeg }) {
            commit(DeliveryPlanMutationEnum.REJECT_DELIVERY_LEG, { leg });
            dispatch(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
            dispatch(DeliveryPlanActionEnum.CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG, { cancelledOrRejectedLeg: leg });
            dispatch(DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION);
            commit(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);
        },
        [DeliveryPlanActionEnum.UNDO_CANCEL_REJECT_DELIVERY_LEG]({ commit, dispatch, getters }, { leg }: { leg: IServiceLeg }) {
            const allDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ALL_DELIVERY_LEGS];
            const isUndoEmptyReturnLeg: boolean = allDeliveryLegs
                .filter((sl) => sl.deliveryOrder === leg.deliveryOrder)
                .some((sl) => sl.legType === ServiceLegTypeEnum.EMPTY_RETURN_LEG);

            if (isUndoEmptyReturnLeg) {
                dispatch(DeliveryPlanActionEnum.REMOVE_EMPTY_RETURN_LEG);
            }

            commit(DeliveryPlanMutationEnum.UNDO_CANCEL_REJECT_DELIVERY_LEG, { leg });
            dispatch(DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG);
            commit(DeliveryPlanMutationEnum.RESEQUENCE_DELIVERY_LEGS);
        },
        [DeliveryPlanActionEnum.REMOVE_EMPTY_RETURN_LEG]({ commit, getters }) {
            const activeEmptyReturnLeg: IServiceLeg = getters[DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG];
            if (!activeEmptyReturnLeg) {
                return;
            }

            commit(DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG, { leg: activeEmptyReturnLeg });
        },
        [DeliveryPlanActionEnum.CHECK_AND_ADD_EMPTY_RETURN_LEG]({ commit, getters }) {
            if (getters[DeliveryPlanGetterEnum.GET_IS_STOP_OFF_LOCATION]) {
                return;
            }

            const activeDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS];
            const activeEmptyReturnLeg: IServiceLeg = getters[DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG];
            if (!activeDeliveryLegs.length || activeEmptyReturnLeg) {
                return;
            }

            const lastActiveDeliveryLeg: IServiceLeg = activeDeliveryLegs[activeDeliveryLegs.length - 1];
            commit(DeliveryPlanMutationEnum.ADD_DELIVERY_LEG, {
                leg: createEmptyDeliveryLeg({
                    legType: ServiceLegTypeEnum.EMPTY_RETURN_LEG,
                    lastActiveDeliveryLeg,
                }),
            });
        },
        [DeliveryPlanActionEnum.CHECK_AND_REMOVE_EMPTY_RETURN_LEG]({ commit, getters }) {
            const activeDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS];
            const activeEmptyReturnLeg: IServiceLeg = getters[DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG];
            if (activeDeliveryLegs.length || !activeEmptyReturnLeg) {
                return;
            }

            commit(DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG, { leg: activeEmptyReturnLeg });
        },
        [DeliveryPlanActionEnum.CHECK_AND_REMOVE_OR_CANCEL_OR_REJECT_EMPTY_RETURN_LEG](
            { commit, getters },
            { cancelledOrRejectedLeg }: { cancelledOrRejectedLeg: IServiceLeg },
        ) {
            const activeDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS];
            const activeEmptyReturnLeg: IServiceLeg = getters[DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG];
            if (activeDeliveryLegs.length || !activeEmptyReturnLeg) {
                return;
            }

            activeEmptyReturnLeg.status === ServiceLegStatusEnum.CREATED
                ? commit(DeliveryPlanMutationEnum.REMOVE_DELIVERY_LEG, { leg: activeEmptyReturnLeg })
                : commit(DeliveryPlanMutationEnum.CANCEL_OR_REJECT_EMPTY_RETURN_LEG, { leg: activeEmptyReturnLeg, cancelledOrRejectedLeg });
        },
        [DeliveryPlanActionEnum.CHECK_AND_UNSELECT_IS_STOP_OFF_LOCATION]({ commit, getters }) {
            const activeDeliveryLegs: Array<IServiceLeg> = getters[DeliveryPlanGetterEnum.GET_ACTIVE_DELIVERY_LEGS];
            const activeEmptyReturnLeg: IServiceLeg = getters[DeliveryPlanGetterEnum.GET_ACTIVE_EMPTY_RETURN_LEG];
            if (activeDeliveryLegs.length || activeEmptyReturnLeg) {
                return;
            }

            commit(DeliveryPlanMutationEnum.SET_IS_STOP_OFF_LOCATION, { isStopOffLocation: false });
        },
    },
};

export default deliveryPlan;
