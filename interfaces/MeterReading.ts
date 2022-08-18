import { UserData } from "./User";


export default interface MeterReading {
  date: string;
  permitNumber?: string;
  flowMeter?: CalculatedValue;
  powerMeter?: CalculatedValue;
  powerConsumptionCoef?: CalculatedValue;
  pumpedThisPeriod?: CalculatedValue;
  pumpedYearToDate?: CalculatedValue;
  availableThisYear?: CalculatedValue; 
  readBy?: string;
  comments?: string;
  createdAt?: string;
  createdBy?: UserData;
  updatedAt?: string;
  updatedBy?: UserData;
}



export interface CalculatedValue {
  value: number;
  shouldBe: number | undefined;
  calculationState: 'success' | 'warning' | 'error' | undefined;
  calculationMessage: string;
  source: 'user' | 'calculation';
}