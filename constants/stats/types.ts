export type CategoryStat = {
  id: string;
  name: string;
  icon: string;
  amount: number;
  percentage: number;
  color: string;
};

export type MonthStat = {
  month: number; // 1-12
  revenue: number;
  expenditure: number;
};
