import {
  getTransactionsByMonth,
  Transaction,
} from "@/services/transactionService";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export type CalendarTransaction = {
  id: string;
  type: "expenditure" | "revenue";
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  note: string;
  date: string;
};

function normalizeTransaction(tx: Transaction): CalendarTransaction {
  const rawAmount = Number(tx.amount);

  return {
    id: tx.id,
    type: tx.type,

    categoryId: tx.category_id,
    categoryName: tx.category?.name ?? "Unknown",
    categoryIcon: tx.category?.icon ?? "🧾",
    categoryColor: tx.category?.color ?? "#64748b",

    amount: tx.type === "revenue" ? rawAmount : -rawAmount,
    note: tx.note || "",
    date: tx.date,
  };
}

function getDayFromDate(date: string) {
  return Number(date.slice(8, 10));
}

export function useCalendar() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [transactions, setTransactions] = useState<CalendarTransaction[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getTransactionsByMonth(year, month);
      const normalized = result.map(normalizeTransaction);

      setTransactions(normalized);
    } catch (error) {
      console.log("Fetch calendar transactions error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [fetchTransactions]),
  );

  const prevMonth = () => {
    setSelectedDay(null);

    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
      return;
    }

    setMonth((prev) => prev - 1);
  };

  const nextMonth = () => {
    setSelectedDay(null);

    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
      return;
    }

    setMonth((prev) => prev + 1);
  };

  const daySummaries = useMemo(() => {
    const summaries: Record<number, number> = {};

    transactions.forEach((tx) => {
      const day = getDayFromDate(tx.date);

      if (!summaries[day]) {
        summaries[day] = 0;
      }

      summaries[day] += tx.amount;
    });

    return summaries;
  }, [transactions]);

  const totalRevenue = useMemo(() => {
    return transactions
      .filter((tx) => tx.amount >= 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const totalExpenditure = useMemo(() => {
    return transactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const selectedTxs = useMemo(() => {
    if (!selectedDay) return [];

    return transactions.filter((tx) => {
      return getDayFromDate(tx.date) === selectedDay;
    });
  }, [selectedDay, transactions]);

  const openDay = (day: number) => {
    setSelectedDay(day);
    setSheetVisible(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
  };

  return {
    month,
    year,
    loading,

    prevMonth,
    nextMonth,

    daySummaries,
    totalRevenue,
    totalExpenditure,

    selectedDay,
    selectedTxs,
    sheetVisible,

    openDay,
    closeSheet,

    refresh: fetchTransactions,
  };
}
