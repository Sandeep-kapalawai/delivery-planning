import { listViewTypeSpecificAction } from '../list-view';
import {
    IFclListItem,
    ILclListItem,
    ICargoStuffingDetails,
    IDeliveryPlanIdQueryParam,
    IMultipleDeliveryPlanIdQueryParam,
    IMultipleObjectIdQueryParam,
} from '@/interfaces';
import { ListViewTypeEnum } from '@/static';

export function getDeliveryPlanId(viewType: ListViewTypeEnum, object: IFclListItem | ILclListItem | ICargoStuffingDetails): number | string {
    return listViewTypeSpecificAction<string | number>(viewType, {
        [ListViewTypeEnum.fcl]: () => {
            const fclObject = object as IFclListItem | ICargoStuffingDetails;
            return fclObject.deliveryPlanId;
        },
        [ListViewTypeEnum.lcl]: () => {
            const lclObject = object as ILclListItem;
            return lclObject.transportDocumentId;
        },
    });
}

export function getMultipleDeliveryPlanId(
    viewType: ListViewTypeEnum,
    objects: Array<IFclListItem | ILclListItem | ICargoStuffingDetails>,
): Array<number | string> {
    return objects.map((object) => getDeliveryPlanId(viewType, object));
}

export function getDeliveryPlanIdQueryParam(viewType: ListViewTypeEnum, deliveryPlanId: number | string): IDeliveryPlanIdQueryParam {
    return listViewTypeSpecificAction<IDeliveryPlanIdQueryParam>(viewType, {
        [ListViewTypeEnum.fcl]: () => {
            return { deliveryPlanId };
        },
        [ListViewTypeEnum.lcl]: () => {
            return { transportDocumentId: deliveryPlanId };
        },
    });
}

export function getMultipleDeliveryPlanIdQueryParam(viewType: ListViewTypeEnum, deliveryPlanIds: Array<number | string>): IMultipleDeliveryPlanIdQueryParam {
    return listViewTypeSpecificAction<IMultipleDeliveryPlanIdQueryParam>(viewType, {
        [ListViewTypeEnum.fcl]: () => {
            return { deliveryPlanIds };
        },
        [ListViewTypeEnum.lcl]: () => {
            return { transportDocumentIds: deliveryPlanIds };
        },
    });
}

export function getMultipleObjectIdQueryParam(viewType: ListViewTypeEnum, deliveryPlanIds: Array<number | string>): IMultipleObjectIdQueryParam {
    return listViewTypeSpecificAction<IMultipleObjectIdQueryParam>(viewType, {
        [ListViewTypeEnum.fcl]: () => {
            return { deliveryPlanIds };
        },
        [ListViewTypeEnum.lcl]: () => {
            return { objectIds: deliveryPlanIds };
        },
    });
}
