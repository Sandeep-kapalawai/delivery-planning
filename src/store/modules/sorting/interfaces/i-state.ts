import { SortingTypeEnum } from '../static';
export interface IState {
    field: string;
    // direction as enum type
    direction: SortingTypeEnum | null;
}
