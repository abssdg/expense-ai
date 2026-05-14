export type Transaction = {
  id: string;
  category: string;
  categoryIcon: string;
  note: string;
  date: string;
  amount: number;
  type: "revenue" | "expenditure";
};
