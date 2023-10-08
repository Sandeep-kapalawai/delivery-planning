export interface ICommentList {
    result: Array<ICommentListItem>;
    resultTotalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface ICommentListItem {
    commentId: number;
    eventType: string;
    createdBy: string;
    createdAtTimestampUtc: string;
    content: string;
}

export interface ICommentPayload {
    deliveryPlanId: number | string;
    content: string;
}
