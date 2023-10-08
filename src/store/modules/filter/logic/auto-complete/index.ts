import { ILastUpdatedByUser } from '@/interfaces';

export function getGenericAutoCompleteResults({ result }: { result: Array<any> }): Array<{ value: string }> {
    const filteredArray: Array<{ value: string }> = [];
    result.forEach((searchResult) => {
        filteredArray.push({
            value: searchResult,
        });
    });
    return filteredArray;
}

export function getLastUpdatedByAutoCompleteResult(result: Array<ILastUpdatedByUser>): Array<{ value: string; secondary: string }> {
    const usersDetailsArray: Array<{ value: string; secondary: string }> = [],
    usersDetailsMap: { [key: string]: { value: string; secondary: string } } = {};

    result.forEach((user) => {
        if (usersDetailsMap[user.userName]) {
            return;
        }

        const userItem = {
            value: user.userName,
            secondary: user.fullName,
        };

        usersDetailsArray.push(userItem);
        usersDetailsMap[userItem.value] = userItem;
    });

    return usersDetailsArray;
}
