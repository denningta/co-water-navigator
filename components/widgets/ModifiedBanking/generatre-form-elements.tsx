import CellRendererComponent from "./CellRendererComponent";
import CustomFormComponent from "./CustomFormComponent";
import { FormElement, ValueGetterParams, ValueSetterParams } from "./FormWithCells";



export interface FormMetaData {
  lineNumber: number;
  formControl: ModifiedBankingFormControls;
  title: string;
  shortTitle: string;
  description: string;
  descriptionAlt?: string;
  formControlDisabled?: boolean;
  status?: 'committed' | 'reference' | 'warning' | 'undefined' | 'unsaved';
  shouldBe?: number;
  permitNumber?: string;
  year?: string;
}

export type ModifiedBankingFormControls = 'originalAppropriation' | 'allowedAppropriation' | 'line3' | 'bankingReserveLastYear' | 'maxBankingReserve' | 'pumpingLimitThisYear' | 'totalPumpedThisYear' | 'changeInBankingReserveThisYear' | 'bankingReserveThisYear' | 'line10' | 'pumpingLimitNextYear'

export const generateformMetaData = (thisYear: string | number, permitNumber: string): FormMetaData[] => {
  const lastYear = (+thisYear - 1).toString()
  const nextYear = (+thisYear + 1).toString()

  return [
    { 
      lineNumber: 1,
      formControl: 'originalAppropriation',
      title: 'Original maximum allowed annual appropriation',
      shortTitle: 'Original annual appropriation',
      description: 'Original permitted appropriation prior to approval of the expanded acres or change of use.',
    },
    {
      lineNumber: 2,
      formControl: 'allowedAppropriation',
      title: 'Allowed annual appropriation under the expanded acres or change of use approval',
      shortTitle: 'Allowed annual appropriation',
      description: 'This is allowed average annual historical withdraw as determined by the expanded acres or change of use approval for the expanded acres use or change of use.',
    },
    {
      lineNumber: 3,
      formControl: 'line3',
      title: 'Line 3',
      shortTitle: 'Subtract line 2 from line 1',
      description: 'Subtract line 2 from line 1 and enter here.',
    },
    {
      lineNumber: 4,
      formControl: 'maxBankingReserve',
      title: 'Maximum amount of water that may be in the banking reserve',
      shortTitle: 'Maximum banking reserve',
      description: '(Allowed annual appropriation - Original annual appropriation) x 3 years',
    },
    {
      lineNumber: 5,
      formControl: 'bankingReserveLastYear',
      title: `Amount in banking reserve at the end of ${lastYear}`,
      shortTitle: `Remaining banking reserve ${lastYear}`,
      description: `Enter line 9 of the ${lastYear} report.`,
    },
    {
      lineNumber: 6,
      formControl: 'pumpingLimitThisYear',
      title: `Pumping limit for ${thisYear}`,
      shortTitle: `Pumping limit ${thisYear}`,
      description: `A) If ${thisYear} is the first year or a re-initiating year under the three year modified banking provision enter the amount from line 2`,
      descriptionAlt: `B) Enter the lesser of (line 1) or (line 2 plus line 5). (This will be the same as line 11 of the ${lastYear} report)`,
      year: thisYear.toString(),
      permitNumber: permitNumber
    },
    {
      lineNumber: 7,
      formControl: 'totalPumpedThisYear',
      title: `Total amount pumped in ${thisYear}`,
      shortTitle: `Total pumped in ${thisYear}`,
      description: `Enter the total amount of water pumped ${thisYear}.`,
    },
    {
      lineNumber: 8,
      formControl: 'changeInBankingReserveThisYear',
      title: `Change of amount in banking reserve ${thisYear}`,
      shortTitle: `Change of banking reserve ${thisYear}`,
      description: 'Subtract line 7 from line 2 and enter here. This number could be positive (+) or negative (-).',
    },
    {
      lineNumber: 9,
      formControl: 'bankingReserveThisYear',
      title: `Amount in banking reserve at the end of ${thisYear}`,
      shortTitle: `Remaining reserve ${thisYear}`,
      description: 'Enter the lesser of (line 4) or (line 5 plus line 8).',
    },
    {
      lineNumber: 10,
      formControl: 'line10',
      title: 'Line 10',
      shortTitle: 'Add lines 2 and 9',
      description: 'Add lines 2 and 9 and enter here.',
    },
    {
      lineNumber: 11,
      formControl: 'pumpingLimitNextYear',
      title: `Pumping limit for ${nextYear}`,
      shortTitle: `Pumping limit ${nextYear}`,
      description: 'Enter the lesser of line 1 or line 10.',
    },
  ];

}

export function generateFormElements(permitNumber: string, calendarYear: number | string): FormElement[] {


  return generateformMetaData(calendarYear, permitNumber).map(el => ({
    formMetadata: el,
    formControl: el.formControl,
    formComponent: CustomFormComponent,
    cellLabel: el.shortTitle,
    valueGetter: ({ data, formControl }: ValueGetterParams) => {
      if (!data || !data[formControl]) return ''
      return (data[formControl].value)
    },
    valueSetter: ({ data, formControl, newValue, oldValue }: ValueSetterParams) => {
      if (newValue === '') {
        delete data[formControl]
        return true
      }
      if (isNaN(+newValue)) {
        return false
      }

      if (!data) data = {}

      data[formControl] = {
        ...data[formControl],
        value: +newValue,
        source: 'user'
      }
      return true
    },
    cellClass({ data, formControl}) {
      if (data && data[formControl]?.calculationState === 'warning') return 'bg-orange-500 bg-opacity-25'
      return ''
    },
    cellRendererComponent: CellRendererComponent
  }))

}

