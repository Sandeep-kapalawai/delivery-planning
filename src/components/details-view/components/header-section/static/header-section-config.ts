/* istanbul ignore file */
import i18n from '@/i18n';
import { ListViewTypeEnum } from '@/static';
import { listViewTypeSpecificAction } from '@/logic';
import { formatValueIfEmpty, getFormattedDate } from 'destination/utilities';
import { ICargoStuffingDetails } from '@/interfaces';

export interface HeaderSectionField {
    label: string;
    value: string;
    secondaryValue: string;
}

export function getDetailsPageHeaderSectionFields({
    listViewType,
    details,
}: {
    listViewType: ListViewTypeEnum;
    details: ICargoStuffingDetails;
}): Array<HeaderSectionField> {
    return listViewTypeSpecificAction<Array<any>>(listViewType, {
        [ListViewTypeEnum.fcl]: () => {
            return [
                { label: 'VESSEL_VOYAGE', value: details.vesselVoyage },
                { label: 'PORT_OF_DISCHARGE', value: details.portOfDischargeLocation, secondaryValue: details.portOfDischargeCountry },
                { label: 'BL_NO', value: details.transportDocumentNumber },
                {
                    label: 'BL_TYPE',
                    value: details.transportDocumentTypeCode
                        ? i18n.t(`DOCUMENT_TYPE.${details.transportDocumentTypeCode}`).toString()
                        : details.transportDocumentTypeCode,
                },
                { label: 'SPECIAL_PROGRAM', value: (details.specialProgram as any)?.specialProgramName },
                {
                    label: 'PREDICTIVE_ETA',
                    value: getFormattedDate({ date: details.predictiveEstimatedTimeOfArrivalDateTimeUTC }),
                },
                {
                    label: 'ETA',
                    value: getFormattedDate({ date: details.estimatedTimeOfArrivalDateTimeLocal, timeZone: details.estimatedTimeOfArrivalTimeZone }),
                },
                {
                    label: 'ATA',
                    value: getFormattedDate({ date: details.actualTimeOfArrivalDateTimeLocal }),
                },
                {
                    label: 'ETD',
                    value: getFormattedDate({ date: details.estimatedTimeOfDischargeDateTimeLocal }),
                },
                {
                    label: 'CARRIER_RELEASED',
                    value: getFormattedDate({ date: details.carrierReleasedDateTimeLocal, timeZone: details.carrierReleasedTimeZone }),
                },
                {
                    label: 'CUSTOMS_CLEARED',
                    value: getFormattedDate({ date: details.customsClearedDateTimeUTC }),
                },
                {
                    label: 'IN_DC_DATE',
                    value: getFormattedDate({ date: details.inDCDateTimeLocal, timeZone: details.inDCTimeZone }),
                },
                { label: 'SERVICE_SCOPE', value: details.serviceScope },
            ].map((pair) => ({
                label: i18n.t('FIELD.' + pair.label).toString(),
                value: formatValueIfEmpty(pair.value),
                secondaryValue: pair.secondaryValue,
            }));
        },
        [ListViewTypeEnum.lcl]: () => {
            return [];
        },
    });
}
