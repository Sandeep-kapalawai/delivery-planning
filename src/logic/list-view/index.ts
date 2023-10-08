import { ListViewTypeEnum } from '@/static';

export function listViewTypeSpecificAction<T = any>(listViewType: ListViewTypeEnum, config: { [key in ListViewTypeEnum]: () => T }): T {
    return config[listViewType] ? config[listViewType]() : config[ListViewTypeEnum.fcl]();
}
