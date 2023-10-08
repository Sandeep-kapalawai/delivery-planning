import api from '.';
import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { IFclList, ICargoStuffingDetails, CargoStuffingDocument } from '@/interfaces';
import { DocumentTypeEnum } from '@/components/delivery-plan/static/document-type';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FCL API', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('List View', () => {
        it('getFclList', async () => {
            const data: IFclList = { result: [], resultTotalCount: 0, pageNumber: 1, pageSize: 10 };
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getFclList();

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_FCL_LIST(), {});

            expect(output).toEqual(data);
        });

        it('getTransportDocuments', async () => {
            const data: CargoStuffingDocument = { documentNumber: '1', documentType: DocumentTypeEnum.SeaWayBill };
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getTransportDocuments(1000, {});

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_FCL_TRANSPORT_DOCUMENTS(1000), {});
            expect(output).toEqual(data);
        });

        it('importServicePlan', async () => {
            const data = {};
            mockedAxios.post.mockResolvedValue({ data });

            const payload = { headers: { 'Content-Type': 'application/json' } };

            await api.importServicePlan(payload, {});

            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });

        it('getCSAExportExcelForBulkEdit', async () => {
            const data = { isExporting: false };
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getCSAExportExcelForBulkEdit();

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_CSA_FCL_EXPORT_BULK_EDIT(), { responseType: 'blob' });

            expect(output).toEqual(data);
        });

        it('getConsigneeExportExcelForBulkEdit', async () => {
            const data = { isExporting: false };
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getConsigneeExportExcelForBulkEdit();

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_CONSIGNEE_FCL_EXPORT_BULK_EDIT(), { responseType: 'blob' });

            expect(output).toEqual(data);
        });

        it('getCSAExportExcelForSelectedColumns', async () => {
            const data = { isExporting: false };
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getCSAExportExcelForSelectedColumns();

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_CSA_FCL_EXPORT_SELECTED_COLUMNS(), { responseType: 'blob' });

            expect(output).toEqual(data);
        });

        it('getConsigneeExportExcelForAllColumns', async () => {
            const data = { isExporting: false };
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getConsigneeExportExcelForAllColumns();

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_CONSIGNEE_FCL_EXPORT_ALL(), { responseType: 'blob' });

            expect(output).toEqual(data);
        });

        it('getCSAExportExcelForAllColumns', async () => {
            const data = { isExporting: false };
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getCSAExportExcelForAllColumns();

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_CSA_FCL_EXPORT_ALL(), { responseType: 'blob' });

            expect(output).toEqual(data);
        });
    });

    describe('Details View', () => {
        it('getCargoStuffingDetails', async () => {
            const data: Partial<ICargoStuffingDetails> = {};
            mockedAxios.get.mockResolvedValue({ data });

            const output = await api.getCargoStuffingDetails(1000, {});

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_FCL_CARGO_STUFFING_DETAILS(1000), {});

            expect(output).toEqual(data);
        });
    });
});
