import api from '.';
import axios from '@/data/axios';
import { API_URLS, PrimaryExecutiveStatus, PlanningStatusEnum } from '@/static';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Quick filters API list', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('getPlanningStatus', async () => {
        const data = [
            {
                planningStatus: PlanningStatusEnum.INITIAL,
                count: 19,
            },
            {
                planningStatus: PlanningStatusEnum.READY_TO_PLAN,
                count: 2,
            },
            {
                planningStatus: PlanningStatusEnum.PLANNING_IN_PROGRESS,
                count: 26,
            },
            {
                planningStatus: PlanningStatusEnum.FULL_TRANSPORT_PLAN_SENT,
                count: 55,
            },
            {
                planningStatus: PlanningStatusEnum.PLANNING_COMPLETED,
                count: 6,
            },
            {
                planningStatus: PlanningStatusEnum.RE_PLANNING_REQUIRED,
                count: 12,
            },
        ];
        mockedAxios.get.mockResolvedValue({ data });
        const output = await api.getPlanningStatus();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_PLANNINGSTATUS_TILES(), {});
        expect(output).toEqual(data);
    });

    it('getExecutionStatus', async () => {
        const data = [
            {
                executionStatus: PrimaryExecutiveStatus.IN_TRANSIT,
                count: 73,
            },
            {
                executionStatus: PrimaryExecutiveStatus.VESSEL_ARRIVED,
                count: 1938,
            },
            {
                executionStatus: PrimaryExecutiveStatus.UNLOADED_FROM_VESSEL,
                count: 9,
            },
            {
                executionStatus: PrimaryExecutiveStatus.DELIVERY_IN_PROGRESS,
                count: 7,
            },
            {
                executionStatus: PrimaryExecutiveStatus.IN_STORAGE,
                count: 2,
            },
            {
                executionStatus: PrimaryExecutiveStatus.RETURN_TO_CARRIER,
                count: 11,
            },
        ];

        mockedAxios.get.mockResolvedValue({ data });
        const output = await api.getExecutionStatus();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_EXECUTIONSTATUS_TILES(), {});
        expect(output).toEqual(data);
    });

    it('getLastFreeDaysGroups', async () => {
        const data = [
            {
                lastFreeDaysRange: 'WithinFreeTimeDemurrage',
                count: 1,
            },
            {
                lastFreeDaysRange: 'AtRiskDemurrage',
                count: 6,
            },
            {
                lastFreeDaysRange: 'IncurringDemurrage',
                count: 385,
            },
            {
                lastFreeDaysRange: 'IncurringDetention',
                count: 4,
            },
            {
                lastFreeDaysRange: 'StoppedDetention',
                count: 2,
            },
        ];
        mockedAxios.get.mockResolvedValue({ data });
        const output = await api.getLastFreeDaysGroups();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_LASTFREEDAYS(), {});
        expect(output).toEqual(data);
    });

    it('getPriorityLevelGroups', async () => {
        const data = [
            {
                priorityLevel: 0,
                count: 7067,
            },
            {
                priorityLevel: 3,
                count: 18,
            },
            {
                priorityLevel: 1,
                count: 14,
            },
            {
                priorityLevel: 4,
                count: 31,
            },
            {
                priorityLevel: 2,
                count: 46,
            },
        ];
        mockedAxios.get.mockResolvedValue({ data });
        const output = await api.getPriorityLevelGroups();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(API_URLS.GET_PRIORITY_LEVELS(), {});
        expect(output).toEqual(data);
    });
});
