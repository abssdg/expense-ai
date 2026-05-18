import { supabase } from "@/lib/supabase";

export type CategoryType = "expenditure" | "revenue";

export type Category = {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  created_at: string;
};

export type CategoryInput = {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
};

const DEFAULT_CATEGORIES: Omit<CategoryInput, "user_id">[] = [
  // Revenue
  {
    name: "Salary",
    type: "revenue",
    icon: "💼",
    color: "#16a34a",
  },
  {
    name: "Bonus",
    type: "revenue",
    icon: "🎁",
    color: "#22c55e",
  },
  {
    name: "Investment",
    type: "revenue",
    icon: "📈",
    color: "#0ea5e9",
  },
  {
    name: "Freelance",
    type: "revenue",
    icon: "💻",
    color: "#06b6d4",
  },
  {
    name: "Side Project",
    type: "revenue",
    icon: "🚀",
    color: "#f97316",
  },
  {
    name: "Passive Income",
    type: "revenue",
    icon: "💵",
    color: "#10b981",
  },

  // Expenditure
  {
    name: "Market",
    type: "expenditure",
    icon: "🛒",
    color: "#f97316",
  },
  {
    name: "Eat and drink",
    type: "expenditure",
    icon: "🍜",
    color: "#ef4444",
  },
  {
    name: "Shopping",
    type: "expenditure",
    icon: "🛍️",
    color: "#a855f7",
  },
  {
    name: "Gasoline",
    type: "expenditure",
    icon: "⛽",
    color: "#eab308",
  },
  {
    name: "House",
    type: "expenditure",
    icon: "🏠",
    color: "#2878f0",
  },
  {
    name: "Electricity",
    type: "expenditure",
    icon: "💡",
    color: "#f59e0b",
  },
  {
    name: "Load phone",
    type: "expenditure",
    icon: "📱",
    color: "#06b6d4",
  },
  {
    name: "School",
    type: "expenditure",
    icon: "🎓",
    color: "#6366f1",
  },
  {
    name: "Credit card",
    type: "expenditure",
    icon: "💳",
    color: "#ec4899",
  },
  {
    name: "Other",
    type: "expenditure",
    icon: "🧾",
    color: "#64748b",
  },
];

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("Bạn cần đăng nhập để sử dụng danh mục.");
  }

  return user.id;
}

export async function getCategories(type?: CategoryType) {
  const userId = await getCurrentUserId();

  let query = supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Category[];
}

export async function addCategory(input: CategoryInput) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: input.name.trim(),
      type: input.type,
      icon: input.icon,
      color: input.color,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export async function updateCategory(
  categoryId: string,
  input: Partial<CategoryInput>,
) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("categories")
    .update({
      ...input,
      name: input.name?.trim(),
    })
    .eq("id", categoryId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export async function deleteCategory(categoryId: string) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function seedDefaultCategoriesIfNeeded() {
  const userId = await getCurrentUserId();

  const { count, error: countError } = await supabase
    .from("categories")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count ?? 0) > 0) {
    return;
  }

  const rows = DEFAULT_CATEGORIES.map((item) => ({
    user_id: userId,
    name: item.name,
    type: item.type,
    icon: item.icon,
    color: item.color,
  }));

  const { error } = await supabase.from("categories").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}
