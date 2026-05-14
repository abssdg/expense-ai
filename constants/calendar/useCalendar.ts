import { useState } from "react";
import { Transaction } from "./types";

const MOCK: Transaction[] = [
  {
    id: "1",
    category: "External income",
    categoryIcon: "💼",
    note: "Yeahbird proj",
    date: "2024-08-12",
    amount: 6_430_000,
    type: "revenue",
  },
  {
    id: "2",
    category: "External income",
    categoryIcon: "💼",
    note: "Buffalo project",
    date: "2024-08-12",
    amount: 6_000_000,
    type: "revenue",
  },
  {
    id: "3",
    category: "Supermarket/Market",
    categoryIcon: "🛒",
    note: "Buy vegetables",
    date: "2024-08-12",
    amount: -40_000,
    type: "expenditure",
  },
  {
    id: "4",
    category: "Eat and drink",
    categoryIcon: "🍴",
    note: "Beef noodle",
    date: "2024-08-12",
    amount: -42_000,
    type: "expenditure",
  },
  {
    id: "5",
    category: "House",
    categoryIcon: "🏠",
    note: "Rent",
    date: "2024-08-05",
    amount: -5_000_000,
    type: "expenditure",
  },
  {
    id: "6",
    category: "External income",
    categoryIcon: "💼",
    note: "Salary",
    date: "2024-08-01",
    amount: 20_000_000,
    type: "revenue",
  },
  {
    id: "7",
    category: "Electricity",
    categoryIcon: "⚡",
    note: "EVN bill",
    date: "2024-08-15",
    amount: -320_000,
    type: "expenditure",
  },
  {
    id: "8",
    category: "Shopping",
    categoryIcon: "🛍",
    note: "Shopee",
    date: "2024-08-22",
    amount: -1_050_000,
    type: "expenditure",
  },
];

export function useCalendar() {
  const [month, setMonth] = useState(7);
  const [year, setYear] = useState(2024);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const txsForMonth = MOCK.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const daySummaries: Record<number, number> = {};
  txsForMonth.forEach((t) => {
    const day = new Date(t.date).getDate();
    daySummaries[day] = (daySummaries[day] ?? 0) + t.amount;
  });

  const totalRevenue = txsForMonth
    .filter((t) => t.type === "revenue")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenditure = txsForMonth
    .filter((t) => t.type === "expenditure")
    .reduce((s, t) => s + t.amount, 0);

  const selectedTxs = selectedDay
    ? MOCK.filter(
        (t) =>
          new Date(t.date).getDate() === selectedDay &&
          new Date(t.date).getMonth() === month,
      )
    : [];

  const openDay = (day: number) => {
    setSelectedDay(day);
    setSheetVisible(true);
  };

  return {
    month,
    year,
    prevMonth,
    nextMonth,
    daySummaries,
    totalRevenue,
    totalExpenditure,
    selectedDay,
    selectedTxs,
    sheetVisible,
    openDay,
    closeSheet: () => setSheetVisible(false),
  };
}
