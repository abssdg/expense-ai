import {
    getTransactionsByMonth,
    getTransactionsByYear,
    Transaction,
    TransactionType,
} from "@/services/transactionService";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export type StatsPeriod = "month" | "year";
export type StatsTab = "expenditure" | "revenue";

export type CategoryStat = {
  id: string;
  name: string;
  icon: string;
  amount: number;
  percentage: number;
  color: string;
  type: TransactionType;
  transactions: Transaction[];
};

export type MonthStat = {
  id: string;
  month: number;
  label: string;
  revenue: number;
  expenditure: number;
};

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Salary: { icon: "💼", color: "#16a34a" },
  Bonus: { icon: "🎁", color: "#22c55e" },
  Investment: { icon: "📈", color: "#0ea5e9" },

  Market: { icon: "🛒", color: "#f97316" },
  "Eat and drink": { icon: "🍜", color: "#ef4444" },
  Shopping: { icon: "🛍️", color: "#a855f7" },
  Gasoline: { icon: "⛽", color: "#eab308" },
  House: { icon: "🏠", color: "#2878f0" },
  Electricity: { icon: "💡", color: "#f59e0b" },
  "Load phone": { icon: "📱", color: "#06b6d4" },
  School: { icon: "🎓", color: "#6366f1" },
  "Credit card": { icon: "💳", color: "#ec4899" },
  Other: { icon: "🧾", color: "#64748b" },
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getCategoryMeta(category: string) {
  return CATEGORY_META[category] || CATEGORY_META.Other;
}

function getTotalByType(transactions: Transaction[], type: TransactionType) {
  return transactions
    .filter((item) => item.type === type)
    .reduce((sum, item) => sum + Number(item.amount), 0);
}

function buildCategoryStats(
  transactions: Transaction[],
  tab: StatsTab,
): CategoryStat[] {
  const filtered = transactions.filter((item) => item.type === tab);

  const total = filtered.reduce((sum, item) => {
    return sum + Number(item.amount);
  }, 0);

  const map = new Map<string, CategoryStat>();

  filtered.forEach((item) => {
    const amount = Number(item.amount);
    const meta = getCategoryMeta(item.category);

    const old = map.get(item.category);

    if (old) {
      old.amount += amount;
      old.transactions.push(item);
    } else {
      map.set(item.category, {
        id: item.category,
        name: item.category,
        icon: meta.icon,
        color: meta.color,
        amount,
        percentage: 0,
        type: item.type,
        transactions: [item],
      });
    }
  });

  return Array.from(map.values())
    .map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function buildMonthStats(transactions: Transaction[]): MonthStat[] {
  const months: MonthStat[] = Array.from({ length: 12 }, (_, index) => ({
    id: String(index),
    month: index,
    label: MONTH_LABELS[index],
    revenue: 0,
    expenditure: 0,
  }));

  transactions.forEach((item) => {
    const date = new Date(item.date);
    const month = date.getMonth();
    const amount = Number(item.amount);

    if (item.type === "revenue") {
      months[month].revenue += amount;
    } else {
      months[month].expenditure += amount;
    }
  });

  return months;
}

export function useStats() {
  const today = new Date();

  const [period, setPeriod] = useState<StatsPeriod>("month");
  const [tab, setTab] = useState<StatsTab>("expenditure");
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [detailCategory, setDetailCategory] = useState<CategoryStat | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        period === "month"
          ? await getTransactionsByMonth(year, month)
          : await getTransactionsByYear(year);

      setTransactions(data);
    } catch (error) {
      console.log("Fetch stats error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [period, month, year]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats]),
  );

  const totalRevenue = useMemo(() => {
    return getTotalByType(transactions, "revenue");
  }, [transactions]);

  const totalExpenditure = useMemo(() => {
    return getTotalByType(transactions, "expenditure");
  }, [transactions]);

  const remaining = useMemo(() => {
    return totalRevenue - totalExpenditure;
  }, [totalRevenue, totalExpenditure]);

  const categoryStats = useMemo(() => {
    return buildCategoryStats(transactions, tab);
  }, [transactions, tab]);

  const monthStats = useMemo(() => {
    return buildMonthStats(transactions);
  }, [transactions]);

  const prevPeriod = () => {
    setDetailCategory(null);

    if (period === "year") {
      setYear((prev) => prev - 1);
      return;
    }

    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
      return;
    }

    setMonth((prev) => prev - 1);
  };

  const nextPeriod = () => {
    setDetailCategory(null);

    if (period === "year") {
      setYear((prev) => prev + 1);
      return;
    }

    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
      return;
    }

    setMonth((prev) => prev + 1);
  };

  return {
    period,
    setPeriod,
    tab,
    setTab,

    month,
    year,
    loading,

    prevPeriod,
    nextPeriod,

    transactions,
    categoryStats,
    monthStats,

    totalRevenue,
    totalExpenditure,
    remaining,

    detailCategory,
    setDetailCategory,

    refresh: fetchStats,
  };
}
