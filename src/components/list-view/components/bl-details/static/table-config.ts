import { SCMTableColDef } from '@/interfaces/scm-table';
import { ListViewTypeEnum } from '@/static';
import { listViewTypeSpecificAction } from '@/logic';
import { formatValueIfEmpty } from 'destination/utilities';
import i18n from '@/i18n';
import { getDocumentTypeDisplayName } from '../../../../delivery-plan/static/document-type';

export function getDefaultColDef({ listViewType }: { listViewType: ListViewTypeEnum }): SCMTableColDef {
    return listViewTypeSpecificAction<SCMTableColDef>(listViewType, {
        [ListViewTypeEnum.fcl]: () => {
            return {
                flex: 1,
                minWidth: 100,
                hide: false,
                resizable: true,
                pinned: false,
                comparator: () => 0,
            };
        },
        [ListViewTypeEnum.lcl]: () => {
            return {
                flex: 1,
                minWidth: 100,
                hide: false,
                resizable: true,
                pinned: false,
                comparator: () => 0,
            };
        },
    });
}

export function getColumnDefs({ listViewType }: { listViewType: ListViewTypeEnum }): Array<SCMTableColDef> {
    return listViewTypeSpecificAction<Array<SCMTableColDef>>(listViewType, {
        [ListViewTypeEnum.fcl]: () => {
            return [TableColumns.BL_NO, TableColumns.BL_TYPE];
        },
        [ListViewTypeEnum.lcl]: () => {
            return [];
        },
    });
}

class TableColumns {
    static get BL_NO(): SCMTableColDef {
        return {
            headerName: i18n.t('FIELD.BL_NO').toString(),
            field: 'documentNumber',
            tooltipField: 'documentNumber',
            colWidth: 150,
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(data.documentNumber);
            },
        };
    }

    static get BL_TYPE(): SCMTableColDef {
        return {
            colWidth: 150,
            name: i18n.t('FIELD.BL_TYPE').toString(),
            headerName: i18n.t('FIELD.BL_TYPE').toString(),
            headerTooltip: i18n.t('FIELD.BL_TYPE').toString(),
            field: 'documentType',
            tooltipField: 'documentType',
            dataFormatterFieldPrimary(data) {
                return formatValueIfEmpty(getDocumentTypeDisplayName(data. documentType));
                },
        };
    }
}
