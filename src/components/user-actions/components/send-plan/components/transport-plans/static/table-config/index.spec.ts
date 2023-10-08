import { getColumnDefs, getColumnDefsforMultiSelect } from '.';
import { SCMTableColDef } from '@/interfaces';
import { ListViewTypeEnum } from '@/static';

describe('table-config', () => {
    describe('getColumnDefs', () => {
        describe('FCL', () => {
            it('returns all the columns', () => {
                const columnDefs = getColumnDefs({ listViewType: ListViewTypeEnum.fcl });
                const expectedColumns: string[] = [
                    'FIELD.DELIVERY_ORDER',
                    'FILTERS.PICK_UP_LOCATION',
                    'FILTERS.DELIVERY_LOCATION',
                    'FIELD.TRANSPORT_MODE',
                    'FIELD.PLANNED_DATE_TIME',
                    'FIELD.VERSION',
                    'FIELD.REASON_CODE',
                    'FIELD.COMMENTS',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });

        describe('LCL', () => {
            it('returns all the columns', () => {
                const columnDefs = getColumnDefs({ listViewType: ListViewTypeEnum.lcl });
                const expectedColumns: string[] = [
                    'FIELD.DELIVERY_ORDER',
                    'FILTERS.PICK_UP_LOCATION',
                    'FILTERS.DELIVERY_LOCATION',
                    'FIELD.TRANSPORT_MODE',
                    'FIELD.PLANNED_DATE_TIME',
                    'FIELD.VERSION',
                    'FIELD.REASON_CODE',
                    'FIELD.COMMENTS',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });
    });
    describe('getColumnDefsforMultiSelect', () => {
        describe('FCL', () => {
            it('returns all the columns', () => {
                const columnDefs = getColumnDefsforMultiSelect({ listViewType: ListViewTypeEnum.fcl });
                const expectedColumns: string[] = [
                    'FIELD.CONTAINER_NUMBER',
                    'FIELD.DELIVERY_ORDER',
                    'FILTERS.PICK_UP_LOCATION',
                    'FILTERS.DELIVERY_LOCATION',
                    'FIELD.TRANSPORT_MODE',
                    'FIELD.PLANNED_DATE_TIME',
                    'FIELD.VERSION',
                    'FIELD.REASON_CODE',
                    'FIELD.COMMENTS',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });

        describe('LCL', () => {
            it('returns all the columns', () => {
                const columnDefs = getColumnDefsforMultiSelect({ listViewType: ListViewTypeEnum.lcl });
                const expectedColumns: string[] = [
                    'FIELD.BL_NO',
                    'FIELD.DELIVERY_ORDER',
                    'FILTERS.PICK_UP_LOCATION',
                    'FILTERS.DELIVERY_LOCATION',
                    'FIELD.TRANSPORT_MODE',
                    'FIELD.PLANNED_DATE_TIME',
                    'FIELD.VERSION',
                    'FIELD.REASON_CODE',
                    'FIELD.COMMENTS',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });
    });
});
