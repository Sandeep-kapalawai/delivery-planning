import { getCancelledLegsDefaultColDef, getCancelledLegsColumnDefs, getRejectedLegsDefaultColDef, getRejectedLegsColumnDefs } from '.';
import { SCMTableColDef } from '@/interfaces';
import { ListViewTypeEnum } from '@/static';

describe('table-config', () => {
    describe('getCancelledLegsDefaultColDef', () => {
        describe('FCL', () => {
            it('returns defaultColDef', () => {
                const defaultColDef = getCancelledLegsDefaultColDef({ viewType: ListViewTypeEnum.fcl });

                expect(defaultColDef).toEqual({
                    flex: 1,
                    hide: false,
                    minWidth: 100,
                    pinned: false,
                    resizable: true,
                    sortable: false,
                });
            });
        });

        describe('LCL', () => {
            it('returns defaultColDef', () => {
                const defaultColDef = getCancelledLegsDefaultColDef({ viewType: ListViewTypeEnum.lcl });

                expect(defaultColDef).toEqual({
                    flex: 1,
                    hide: false,
                    minWidth: 100,
                    pinned: false,
                    resizable: true,
                    sortable: false,
                });
            });
        });
    });

    describe('getCancelledLegsColumnDefs', () => {
        describe('FCL', () => {
            it('sets tooltipField for all the applicable columns', () => {
                const columnDefs = getCancelledLegsColumnDefs({ viewType: ListViewTypeEnum.fcl });
                const exceptionColumnsSet = new Set(['pickupData.pickUpAddress', 'arrowRight', 'deliveryData.deliveryAddress', 'rowActions']);

                columnDefs.forEach((column: SCMTableColDef) => {
                    if (exceptionColumnsSet.has(column.field as string)) {
                        return;
                    }

                    expect(column.field).toEqual(column.tooltipField);
                });
            });

            it('returns all the columns', () => {
                const columnDefs = getCancelledLegsColumnDefs({ viewType: ListViewTypeEnum.fcl });
                const expectedColumns: string[] = [
                    'FIELD.DELIVERY_ORDER',
                    'FIELD.PICK_UP',
                    'Arrow Right',
                    'FIELD.DELIVERY',
                    'FIELD.DELIVERY_REFERENCE',
                    'FIELD.TRANSPORT_PROVIDER',
                    'FIELD.TRANSPORT_MODE',
                    'FIELD.VERSION',
                    'Actions',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });

        describe('LCL', () => {
            it('sets tooltipField for all the applicable columns', () => {
                const columnDefs = getCancelledLegsColumnDefs({ viewType: ListViewTypeEnum.lcl });
                const exceptionColumnsSet = new Set(['pickupData.pickUpAddress', 'arrowRight', 'deliveryData.deliveryAddress', 'rowActions']);

                columnDefs.forEach((column: SCMTableColDef) => {
                    if (exceptionColumnsSet.has(column.field as string)) {
                        return;
                    }

                    expect(column.field).toEqual(column.tooltipField);
                });
            });

            it('returns all the columns', () => {
                const columnDefs = getCancelledLegsColumnDefs({ viewType: ListViewTypeEnum.lcl });
                const expectedColumns: string[] = [
                    'FIELD.DELIVERY_ORDER',
                    'FIELD.PICK_UP',
                    'Arrow Right',
                    'FIELD.DELIVERY',
                    'FIELD.DELIVERY_REFERENCE',
                    'FIELD.TRANSPORT_PROVIDER',
                    'FIELD.TRANSPORT_MODE',
                    'FIELD.VERSION',
                    'Actions',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });
    });

    describe('getRejectedLegsDefaultColDef', () => {
        describe('FCL', () => {
            it('returns defaultColDef', () => {
                const defaultColDef = getRejectedLegsDefaultColDef({ viewType: ListViewTypeEnum.fcl });

                expect(defaultColDef).toEqual({
                    flex: 1,
                    hide: false,
                    minWidth: 100,
                    pinned: false,
                    resizable: true,
                    sortable: false,
                });
            });
        });

        describe('LCL', () => {
            it('returns defaultColDef', () => {
                const defaultColDef = getRejectedLegsDefaultColDef({ viewType: ListViewTypeEnum.lcl });

                expect(defaultColDef).toEqual({
                    flex: 1,
                    hide: false,
                    minWidth: 100,
                    pinned: false,
                    resizable: true,
                    sortable: false,
                });
            });
        });
    });

    describe('getRejectedLegsColumnDefs', () => {
        describe('FCL', () => {
            it('sets tooltipField for all the applicable columns', () => {
                const columnDefs = getRejectedLegsColumnDefs({ viewType: ListViewTypeEnum.fcl });
                const exceptionColumnsSet = new Set(['pickupData.pickUpAddress', 'arrowRight', 'deliveryData.deliveryAddress', 'rowActions']);

                columnDefs.forEach((column: SCMTableColDef) => {
                    if (exceptionColumnsSet.has(column.field as string)) {
                        return;
                    }

                    expect(column.field).toEqual(column.tooltipField);
                });
            });

            it('returns all the columns', () => {
                const columnDefs = getRejectedLegsColumnDefs({ viewType: ListViewTypeEnum.fcl });
                const expectedColumns: string[] = [
                    'FIELD.DELIVERY_ORDER',
                    'FIELD.PICK_UP',
                    'Arrow Right',
                    'FIELD.DELIVERY',
                    'FIELD.DELIVERY_REFERENCE',
                    'FIELD.TRANSPORT_PROVIDER',
                    'FIELD.TRANSPORT_MODE',
                    'FIELD.VERSION',
                    'Actions',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });

        describe('LCL', () => {
            it('sets tooltipField for all the applicable columns', () => {
                const columnDefs = getRejectedLegsColumnDefs({ viewType: ListViewTypeEnum.lcl });
                const exceptionColumnsSet = new Set(['pickupData.pickUpAddress', 'arrowRight', 'deliveryData.deliveryAddress', 'rowActions']);

                columnDefs.forEach((column: SCMTableColDef) => {
                    if (exceptionColumnsSet.has(column.field as string)) {
                        return;
                    }

                    expect(column.field).toEqual(column.tooltipField);
                });
            });

            it('returns all the columns', () => {
                const columnDefs = getRejectedLegsColumnDefs({ viewType: ListViewTypeEnum.lcl });
                const expectedColumns: string[] = [
                    'FIELD.DELIVERY_ORDER',
                    'FIELD.PICK_UP',
                    'Arrow Right',
                    'FIELD.DELIVERY',
                    'FIELD.DELIVERY_REFERENCE',
                    'FIELD.TRANSPORT_PROVIDER',
                    'FIELD.TRANSPORT_MODE',
                    'FIELD.VERSION',
                    'Actions',
                ];

                columnDefs.forEach((column: SCMTableColDef, index: number) => {
                    expect(column.name).toEqual(expectedColumns[index]);
                });
            });
        });
    });
});
