import BlueButton from "@/components/ui/button";
import CategoryCard from "@/components/ui/category-card";
import InputField from "@/components/ui/input-field";
import SegmentSwitch from "@/components/ui/segment-switch";
import TimeField from "@/components/ui/time-field";
import { categories } from "@/constants/categories";
import { Colors } from "@/constants/colors";
import { addTransaction } from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Theme = typeof Colors.light;
type TransactionType = "expenditure" | "revenue";

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function HomeScreen() {
  const router = useRouter();

  const [type, setType] = useState<TransactionType>("expenditure");
  const [selectedCategory, setSelectedCategory] = useState("Shopping");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = darkMode ? Colors.dark : Colors.light;

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleChangeType = (value: TransactionType) => {
    setType(value);

    const firstCategory = categories[value]?.[0]?.title;
    if (firstCategory) {
      setSelectedCategory(firstCategory);
    }
  };

  const handleSave = async () => {
    const parsedAmount = Number(amount.replace(/[,.]/g, ""));

    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert("Thiếu số tiền", "Nhập số tiền hợp lệ trước đã bro.");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Thiếu danh mục", "Chọn category trước khi lưu.");
      return;
    }

    try {
      setLoading(true);

      await addTransaction({
        type,
        category: selectedCategory,
        amount: parsedAmount,
        note: note.trim(),
        date,
      });

      Alert.alert("Thành công");

      setAmount("");
      setNote("");
      setDate(getTodayDate());

      const firstCategory = categories[type]?.[0]?.title;
      if (firstCategory) {
        setSelectedCategory(firstCategory);
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

            <Pressable
              style={styles.themeButton}
              onPress={() => setDarkMode((prev) => !prev)}
            >
              <Ionicons
                name={darkMode ? "moon" : "sunny"}
                size={22}
                color={theme.text}
              />
            </Pressable>
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

          <View style={styles.grid}>
            {categories[type].map((item) => {
              const active = selectedCategory === item.title;

              return (
                <CategoryCard
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  active={active}
                  onPress={() => setSelectedCategory(item.title)}
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
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 10,
      marginTop: 24,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 4,
    },

    sectionHeader: {
      marginTop: 28,
      marginBottom: 16,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      rowGap: 10,
      columnGap: "2%",
    },

    buttonContainer: {
      marginTop: 32,
      marginBottom: 20,
    },
  });
