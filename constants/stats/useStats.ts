import { useState } from "react";
import { CategoryStat, MonthStat } from "./types";

const CATEGORY_STATS: CategoryStat[] = [
  {
    id: "1",
    name: "Shopping",
    icon: "🛍",
    amount: -3_200_000,
    percentage: 30,
    color: "#2878f0",
  },
  {
    id: "2",
    name: "Supermarket/Market",
    icon: "🛒",
    amount: -2_040_000,
    percentage: 25,
    color: "#f97316",
  },
  {
    id: "3",
    name: "Eat and drink",
    icon: "🍴",
    amount: -1_442_000,
    percentage: 20,
    color: "#ec4899",
  },
  {
    id: "4",
    name: "House",
    icon: "🏠",
    amount: -1_100_000,
    percentage: 12.5,
    color: "#a855f7",
  },
  {
    id: "5",
    name: "School",
    icon: "🎓",
    amount: -630_000,
    percentage: 8.3,
    color: "#22c55e",
  },
  {
    id: "6",
    name: "Gasoline",
    icon: "⛽",
    amount: -430_000,
    percentage: 4.5,
    color: "#06b6d4",
  },
];

const MONTH_STATS: MonthStat[] = [
  { month: 1, revenue: 20_000_000, expenditure: -1_100_000 },
  { month: 2, revenue: 20_000_000, expenditure: -900_000 },
  { month: 3, revenue: 20_000_000, expenditure: -600_000 },
  { month: 4, revenue: 20_000_000, expenditure: -800_000 },
  { month: 5, revenue: 20_000_000, expenditure: -2_800_000 },
  { month: 6, revenue: 20_000_000, expenditure: -1_600_000 },
  { month: 7, revenue: 20_000_000, expenditure: -2_300_000 },
  { month: 8, revenue: 41_234_000, expenditure: -21_234_000 },
  { month: 9, revenue: 0, expenditure: 0 },
  { month: 10, revenue: 0, expenditure: 0 },
  { month: 11, revenue: 0, expenditure: 0 },
  { month: 12, revenue: 0, expenditure: 0 },
];

export function useStats() {
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [tab, setTab] = useState<"expenditure" | "revenue">("expenditure");
  const [month, setMonth] = useState(7);
  const [year, setYear] = useState(2024);
  const [detailCategory, setDetailCategory] = useState<CategoryStat | null>(
    null,
  );

  const prevPeriod = () => {
    if (period === "month") {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else setMonth((m) => m - 1);
    } else setYear((y) => y - 1);
  };

  const nextPeriod = () => {
    if (period === "month") {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else setMonth((m) => m + 1);
    } else setYear((y) => y + 1);
  };

  const totalRevenue = 41_234_000;
  const totalExpenditure = -21_234_000;
  const remaining = totalRevenue + totalExpenditure;

  return {
    period,
    setPeriod,
    tab,
    setTab,
    month,
    year,
    prevPeriod,
    nextPeriod,
    categoryStats: CATEGORY_STATS,
    monthStats: MONTH_STATS,
    totalRevenue,
    totalExpenditure,
    remaining,
    detailCategory,
    setDetailCategory,
  };
}
