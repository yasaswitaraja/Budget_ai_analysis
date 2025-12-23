
export interface BudgetInputs {
  income: number;
  rent: number;
  food: number;
  travel: number;
  loans: number;
  shopping: number;
  entertainment: number;
  luxury: number;
}

export interface PredictionData {
  rent: number;
  food: number;
  travel: number;
  loans: number;
  wants: number;
  estimated_total: number;
  estimated_savings: number;
}

export interface BudgetAdvice {
  summary: {
    income: number;
    total_expenses: number;
    savings: number;
  };
  categories: {
    needs: number;
    wants: number;
    savings: number;
  };
  alerts: string[];
  suggestions: string[];
  next_month_prediction: PredictionData;
}
