import { UserData } from "./User";


export default interface MeterReading {
  month: number;
  year: number;
  permitNumber: string;
  flowMeter?: CalculatedValue;
  powerMeter?: CalculatedValue;
  powerConsumptionCoef?: CalculatedValue;
  pumpedThisPeriod?: CalculatedValue;
  pumpedYearToDate?: CalculatedValue;
  availableThisYear?: CalculatedValue; 
  readBy?: string;
  comments?: string;
  createdAt: Date;
  createdBy?: UserData;
  updatedAt: Date;
  updatedBy?: UserData;
}

interface CalculatedValue {
  value: number;
  shouldBe: number | undefined;
  calculationState: 'success' | 'warning' | 'error' | undefined;
  source: 'user' | 'calculation';
}