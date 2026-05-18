import BlueButton from "@/components/ui/button";
import CategoryCard from "@/components/ui/category-card";
import InputField from "@/components/ui/input-field";
import SegmentSwitch from "@/components/ui/segment-switch";
import TimeField from "@/components/ui/time-field";
import { Colors } from "@/constants/colors";
import { Category, getCategories } from "@/services/categoryService";
import { addTransaction } from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
type Theme = typeof Colors.light;
type TransactionType = "expenditure" | "revenue";

function getTodayDate() {
  const d = new Date();

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseAmount(value: string) {
  return Number(value.replace(/[,.]/g, "").trim());
}

export default function HomeScreen() {
  const router = useRouter();

  const [type, setType] = useState<TransactionType>("expenditure");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(getTodayDate());

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const theme = darkMode ? Colors.dark : Colors.light;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const selectedCategory = useMemo(() => {
    return categories.find((item) => item.id === selectedCategoryId) ?? null;
  }, [categories, selectedCategoryId]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);

      const data = await getCategories(type);

      setCategories(data);

      if (data.length > 0) {
        setSelectedCategoryId((currentId) => {
          const stillExists = data.some((item) => item.id === currentId);
          return stillExists ? currentId : data[0].id;
        });
      } else {
        setSelectedCategoryId(null);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể tải danh mục.";

      Alert.alert("Lỗi category", message);
      setCategories([]);
      setSelectedCategoryId(null);
    } finally {
      setLoadingCategories(false);
    }
  }, [type]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories]),
  );

  const handleChangeType = (value: TransactionType) => {
    setType(value);
    setSelectedCategoryId(null);
  };

  const handleSave = async () => {
    const parsedAmount = parseAmount(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert("Thiếu số tiền", "Nhập số tiền hợp lệ trước đã bro.");
      return;
    }

    if (!selectedCategoryId || !selectedCategory) {
      Alert.alert("Thiếu danh mục", "Chọn category trước khi lưu.");
      return;
    }

    try {
      setLoading(true);

      await addTransaction({
        type,
        category_id: selectedCategoryId,
        amount: parsedAmount,
        note: note.trim(),
        date,
      });

      Alert.alert("Thành công", "Đã lưu giao dịch.");

      setAmount("");
      setNote("");
      setDate(getTodayDate());

      if (categories.length > 0) {
        setSelectedCategoryId(categories[0].id);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu giao dịch.";

      Alert.alert("Lỗi Supabase", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>
                {type === "expenditure" ? "Add Expense" : "Add Revenue"}
              </Text>

              <Text style={styles.subtitle}>
                Track your daily spending easily
              </Text>
            </View>

            {/* <Pressable
              style={styles.themeButton}
              onPress={() => setDarkMode((prev) => !prev)}
            >
              <Ionicons
                name={darkMode ? "moon" : "sunny"}
                size={22}
                color={theme.text}
              />
            </Pressable> */}
          </View>

          <SegmentSwitch
            leftTitle="Revenue"
            rightTitle="Expenditure"
            active={type}
            onChange={handleChangeType}
          />

          <View style={styles.card}>
            <TimeField label="Time" value={date} />

            <InputField
              label="Amount"
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <InputField
              label="Note"
              placeholder="Enter notes"
              value={note}
              onChangeText={setNote}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category</Text>
          </View>

          {loadingCategories ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={theme.primary} />
              <Text style={styles.loadingText}>Đang tải danh mục...</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {categories.map((item) => {
                const active = selectedCategoryId === item.id;

                return (
                  <CategoryCard
                    key={item.id}
                    title={item.name}
                    icon={<Text style={styles.categoryEmoji}>{item.icon}</Text>}
                    color={item.color}
                    active={active}
                    onPress={() => setSelectedCategoryId(item.id)}
                  />
                );
              })}

              <CategoryCard
                title="Edit"
                icon={
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={darkMode ? "#fff" : "#111"}
                  />
                }
                active={false}
                onPress={() => router.push("/modal/editcategory")}
              />
            </View>
          )}

          {!loadingCategories && categories.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Chưa có category</Text>
              <Text style={styles.emptyDesc}>
                Vào Edit để thêm category trước khi lưu giao dịch.
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <BlueButton
              title={type === "expenditure" ? "Save Expense" : "Save Revenue"}
              onPress={handleSave}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 120,
    },

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },

    title: {
      fontSize: 30,
      fontWeight: "700",
      color: theme.text,
      marginTop: 10,
    },

    subtitle: {
      marginTop: 6,
      fontSize: 15,
      color: theme.subText,
    },

    themeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: 22,
      padding: 16,
      marginTop: 22,
      marginBottom: 24,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 3,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 24,
    },

    categoryEmoji: {
      fontSize: 20,
    },

    loadingBox: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.border,
    },

    loadingText: {
      marginTop: 8,
      color: theme.subText,
      fontSize: 13,
    },

    emptyBox: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.border,
    },

    emptyTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },

    emptyDesc: {
      fontSize: 13,
      color: theme.subText,
      lineHeight: 18,
    },

    buttonContainer: {
      marginTop: 8,
    },
  });
