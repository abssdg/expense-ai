import { supabase } from "@/lib/supabase";

export type TransactionType = "expenditure" | "revenue";

export type TransactionInput = {
  type: TransactionType;
  category: string;
  amount: number;
  note?: string;
  date: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  category: string;
  amount: number;
  note: string | null;
  date: string;
  created_at: string;
};

export async function addTransaction(data: TransactionInput) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("Bạn cần đăng nhập để lưu giao dịch.");
  }

  const { data: result, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      note: data.note || "",
      date: data.date,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return result as Transaction;
}

export async function getTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Transaction[];
}

export async function getTransactionsByMonth(year: number, month: number) {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const endDate = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
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
  const startDate = `${year}-01-01`;
  const endDate = `${year + 1}-01-01`;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", startDate)
    .lt("date", endDate)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Transaction[];
}
