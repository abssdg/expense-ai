import { supabase } from "@/lib/supabase";
import { Category } from "@/services/categoryService";

export type TransactionType = "expenditure" | "revenue";

export type TransactionInput = {
  type: TransactionType;
  category_id: string;
  amount: number;
  note?: string;
  date: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  note: string | null;
  date: string;
  created_at: string;

  category?: Category | null;
};

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("Bạn cần đăng nhập để lưu giao dịch.");
  }

  return user.id;
}

export async function addTransaction(input: TransactionInput) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      type: input.type,
      category_id: input.category_id,
      amount: input.amount,
      note: input.note?.trim() || "",
      date: input.date,
    })
    .select(
      `
      *,
      category:categories (
        id,
        user_id,
        name,
        type,
        icon,
        color,
        created_at
      )
    `,
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Transaction;
}

export async function getTransactions() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      category:categories (
        id,
        user_id,
        name,
        type,
        icon,
        color,
        created_at
      )
    `,
    )
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Transaction[];
}

export async function getTransactionsByMonth(year: number, month: number) {
  const userId = await getCurrentUserId();

  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const endDate = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      category:categories (
        id,
        user_id,
        name,
        type,
        icon,
        color,
        created_at
      )
    `,
    )
    .eq("user_id", userId)
    .gte("date", startDate)
    .lt("date", endDate)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Transaction[];
}

export async function getTransactionsByYear(year: number) {
  const userId = await getCurrentUserId();

  const startDate = `${year}-01-01`;
  const endDate = `${year + 1}-01-01`;

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      category:categories (
        id,
        user_id,
        name,
        type,
        icon,
        color,
        created_at
      )
    `,
    )
    .eq("user_id", userId)
    .gte("date", startDate)
    .lt("date", endDate)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Transaction[];
}
