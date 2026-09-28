export interface YearlyData {
  year: number;
  Thermique: number;          // Cumulé
  Electrique: number;         // Cumulé
  annualIceCost: number;      // Coût récurrent annuel Thermique
  annualEvCost: number;       // Coût récurrent annuel Électrique
  netSavingsCumulated: number; // Gains nets cumulés (Positive / Négative)
}

export interface CreditResults {
  monthlyPayment: number;
  totalCreditCost: number;
  totalAmountPaid: number;
  netCreditCostWithSavings: number;
}

export interface SimulationResults {
  iceAnnualFuelCost: number;
  iceCostPer100: number;
  iceTotalAnnual: number;
  
  evAnnualEnergyCostNet: number;
  evCostPer100: number;
  evTotalAnnual: number;
  
  annualSavings: number;
  netInvestment: number;
  roiYears: number;
  credit: CreditResults;
  yearlyProjection: YearlyData[];
}