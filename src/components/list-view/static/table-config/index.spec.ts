import { getColumnDefs } from '.';
import { SCMTableColDef } from '@/interfaces';
import { ListViewTypeEnum } from '@/static';

describe('table-config', () => {
    describe('getColumnDefs', () => {
        describe('FCL', () => {
            it('shows tooltip for truncated text', () => {
                const columnDefs = getColumnDefs({ listViewType: ListViewTypeEnum.fcl });
                const exceptionColumnsSet = new Set(['selector', 'purchaseOrdersCount', 'transportProviderDetails']);

                columnDefs.forEach((column: SCMTableColDef) => {
                    if (exceptionColumnsSet.has(column.field as string)) {
                        return;
                    }

                    expect(column.field).toEqual(column.tooltipField);
                });
            });

            it('contains default sort property as ascending for eta column', () => {
                const columnDefs = getColumnDefs({ listViewType: ListViewTypeEnum.fcl });
                const etaColumnDefs = columnDefs.find((column: SCMTableColDef) => column.field === 'estimatedTimeOfArrivalDateTimeLocal') as SCMTableColDef;

                expect(etaColumnDefs.sort).toEqual('asc');
            });

            it('returns all the columns', () => {
                const columnDefs = getColumnDefs({ listViewType: ListViewTypeEnum.fcl });
                const expectedColumns: string[] = [
                    'SELECT',
                    'FIELD.EQUIPMENT_NUMBER',
                    'FIELD.SHIPMENT_STATUS',
                    'FIELD.PLANNING_STATUS',
                    'FIELD.BL_NO',
                    'FIELD.PO',
                    'FIELD.PORT_OF_DISCHARGE',
                    'FILTERS.VESSEL',
                    'FIELD.ESTIMATED_DISCHARGE_DATE',
                    'FIELD.ETA',
                    'FIELD.ATA',
                    'FIELD.FDL',
                    'FIELD.CONSIGNEE',
                    'FIELD.PRIORITY',
                    'FIELD.PICK_UP_REF',
                    'FIELD.EMPTY_RETURN_REF',
                    'FIELD.LAST_FREE_DATE_DEMURRAGE',
                    'FIELD.LAST_FREE_DATE_DETENTION',
                    'FIELD.GAS_CHECK_REQUIRED',
                    'FIELD.SOURCE',
                    'FIELD.LAST_UPDATED_BY',
                    'FIELD.TRANSPORT_PROVIDER',
                    'FIELD.DELIVERY_DATE_TIME',
                    'FIELD.CUSTOMS_CLEARANCE_DATE',
                    'FIELD.IN_LAND_DEPOT_DATE',
                    'FIELD.CARRIER',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });

        describe('LCL', () => {
            it('shows tooltip for truncated text', () => {
                const columnDefs = getColumnDefs({ listViewType: ListViewTypeEnum.lcl });
                const exceptionColumnsSet = new Set(['selector', 'purchaseOrdersCount']);

                columnDefs.forEach((column: SCMTableColDef) => {
                    if (exceptionColumnsSet.has(column.field as string)) {
                        return;
                    }

                    expect(column.field).toEqual(column.tooltipField);
                });
            });

            it('contains default sort property as ascending for eta column', () => {
                const columnDefs = getColumnDefs({ listViewType: ListViewTypeEnum.lcl });
                const etaColumnDefs = columnDefs.find((column: SCMTableColDef) => column.field === 'estimatedTimeOfArrivalDateTimeLocal') as SCMTableColDef;

                expect(etaColumnDefs.sort).toEqual('asc');
            });

            it('returns all the columns', () => {
                const columnDefs = getColumnDefs({ listViewType: ListViewTypeEnum.lcl });
                const expectedColumns: string[] = [
                    'SELECT',
                    'FIELD.EQUIPMENT_NUMBER',
                    'FIELD.SHIPMENT_STATUS',
                    'FIELD.PLANNING_STATUS',
                    'FIELD.BL_NO',
                    'FIELD.PO',
                    'FIELD.PORT_OF_DISCHARGE',
                    'FILTERS.VESSEL',
                    'FIELD.ESTIMATED_DISCHARGE_DATE',
                    'FIELD.ETA',
                    'FIELD.ATA',
                    'FIELD.FDL',
                    'FIELD.CONSIGNEE',
                    'FIELD.PRIORITY',
                    'FIELD.EMPTY_RETURN_REF',
                    'FIELD.PICK_UP_REF',
                    'FIELD.GAS_CHECK_REQUIRED',
                    'FIELD.SOURCE',
                    'FIELD.LAST_UPDATED_BY',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });
    });
});
