import BlueButton from "@/components/ui/button";
import CategoryCard from "@/components/ui/category-card";
import InputField from "@/components/ui/input-field";
import SegmentSwitch from "@/components/ui/segment-switch";
import TimeField from "@/components/ui/time-field";
import { categories } from "@/constants/categories";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

export default function HomeScreen() {
  const [type, setType] = useState<"expenditure" | "revenue">("expenditure");
  const [selectedCategory, setSelectedCategory] = useState("Shopping");
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const theme = darkMode ? Colors.dark : Colors.light;

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Add Expense</Text>

              <Text style={styles.subtitle}>
                Track your daily spending easily
              </Text>
            </View>

            <Pressable
              style={styles.themeButton}
              onPress={() => setDarkMode(!darkMode)}
            >
              <Ionicons
                name={darkMode ? "moon" : "sunny"}
                size={22}
                color={theme.text}
              />
            </Pressable>
          </View>

          {/* Type Switch */}
          <SegmentSwitch
            leftTitle="Revenue"
            rightTitle="Expenditure"
            active={type}
            onChange={setType}
          />

          {/* Form */}
          <View style={styles.card}>
            <TimeField label="Time" value="August 12, 2024" />

            <InputField label="Amount" placeholder="Enter amount" />

            <InputField label="Note" placeholder="Enter notes" />
          </View>

          {/* Categories */}
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

            {/* 👉 EDIT CARD */}
            <CategoryCard
              title="Edit"
              icon={<Ionicons name="create-outline" size={24} color="#111" />}
              active={isEditingCategory}
              onPress={() => {
                setIsEditingCategory(true);
                router.push("/modal/editcategory");
              }}
            />
          </View>

          {/* Button */}
          <View style={styles.buttonContainer}>
            <BlueButton
              title={type === "expenditure" ? "Save Expense" : "Save Revenue"}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
