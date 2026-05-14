import { BarChart } from "@/components/stats/BarChart";
import { CategoryDetailSheet } from "@/components/stats/CategoryDetailSheet";
import { DonutChart } from "@/components/stats/DonutChart";
import { useStats } from "@/constants/stats/useStats";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const fmtVND = (n: number) => Math.abs(n).toLocaleString("vi-VN") + " VND";

export default function StatsScreen() {
  const {
    period,
    setPeriod,
    tab,
    setTab,
    month,
    year,
    prevPeriod,
    nextPeriod,
    categoryStats,
    monthStats,
    totalRevenue,
    totalExpenditure,
    remaining,
    detailCategory,
    setDetailCategory,
  } = useStats();

  const periodLabel =
    period === "month" ? `${MONTHS[month]} ${year}` : `${year}`;
  const total = tab === "expenditure" ? totalExpenditure : totalRevenue;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Period toggle */}
        <View style={styles.periodRow}>
          <TouchableOpacity
            style={[
              styles.periodBtn,
              period === "month" && styles.periodBtnActive,
            ]}
            onPress={() => setPeriod("month")}
          >
            <Text
              style={[
                styles.periodText,
                period === "month" && styles.periodTextActive,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodBtn,
              period === "year" && styles.periodBtnActive,
            ]}
            onPress={() => setPeriod("year")}
          >
            <Text
              style={[
                styles.periodText,
                period === "year" && styles.periodTextActive,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nav */}
        <View style={styles.navRow}>
          <Pressable onPress={prevPeriod} hitSlop={12} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={18} color="#2878f0" />
          </Pressable>
          <Text style={styles.navTitle}>{periodLabel}</Text>
          <Pressable onPress={nextPeriod} hitSlop={12} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={18} color="#2878f0" />
          </Pressable>
        </View>

        {/* Summary */}
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total revenue</Text>
            <Text style={[styles.summaryValue, { color: "#16a34a" }]}>
              +{fmtVND(totalRevenue)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total expenditure</Text>
            <Text style={[styles.summaryValue, { color: "#ef4444" }]}>
              -{fmtVND(totalExpenditure)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, { color: "#2878f0" }]}>
              +{fmtVND(remaining)}
            </Text>
          </View>
        </View>

        {/* Tab buttons */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              tab === "expenditure" && styles.tabBtnActive,
            ]}
            onPress={() => setTab("expenditure")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "expenditure" && styles.tabTextActive,
              ]}
            >
              Total expenditure
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              tab === "revenue" && styles.tabBtnActiveGreen,
            ]}
            onPress={() => setTab("revenue")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "revenue" && styles.tabTextActive,
              ]}
            >
              Total revenue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Donut chart */}
        <View style={styles.card}>
          <DonutChart data={categoryStats} tab={tab} total={total} />
        </View>

        {/* Bar chart (year view) */}
        {period === "year" && (
          <View style={styles.card}>
            <BarChart
              data={monthStats}
              tab={tab}
              selectedMonth={month}
              onSelect={() => {}}
            />
          </View>
        )}

        {/* Category list */}
        <View style={styles.card}>
          {categoryStats.map((cat, i) => (
            <View key={cat.id}>
              <Pressable
                style={styles.catRow}
                onPress={() => setDetailCategory(cat)}
              >
                {/* % + color bar */}
                <Text style={styles.catPct}>{cat.percentage}%</Text>
                <View style={styles.catBar}>
                  <View
                    style={[
                      styles.catBarFill,
                      {
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      },
                    ]}
                  />
                </View>
                {/* icon + name */}
                <View
                  style={[
                    styles.catIcon,
                    { backgroundColor: cat.color + "22" },
                  ]}
                >
                  <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
                </View>
                <Text style={styles.catName} numberOfLines={1}>
                  {cat.name}
                </Text>
                {/* amount */}
                <Text style={styles.catAmount}>
                  {cat.amount.toLocaleString("vi-VN")} VND
                </Text>
                <Ionicons name="chevron-forward" size={13} color="#ddd" />
              </Pressable>
              {i < categoryStats.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      <CategoryDetailSheet
        visible={!!detailCategory}
        category={detailCategory}
        month={month}
        year={year}
        onClose={() => setDetailCategory(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fb" },

  periodRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 50,
    marginBottom: 4,
    backgroundColor: "#e8f0fe",
    borderRadius: 10,
    padding: 3,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
  },
  periodBtnActive: { backgroundColor: "#2878f0" },
  periodText: { fontSize: 14, fontWeight: "500", color: "#2878f0" },
  periodTextActive: { color: "#fff" },

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 12,
  },
  navBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e8f0fe",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    minWidth: 150,
    textAlign: "center",
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  summaryLabel: { fontSize: 13, color: "#666" },
  summaryValue: { fontSize: 13, fontWeight: "700" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#f0f0f0" },

  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  tabBtnActive: { backgroundColor: "#2878f0" },
  tabBtnActiveGreen: { backgroundColor: "#16a34a" },
  tabText: { fontSize: 13, fontWeight: "500", color: "#888" },
  tabTextActive: { color: "#fff" },

  catRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  catPct: { fontSize: 11, color: "#aaa", width: 32, textAlign: "right" },
  catBar: {
    width: 40,
    height: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    overflow: "hidden",
  },
  catBarFill: { height: 4, borderRadius: 2 },
  catIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  catName: { flex: 1, fontSize: 13, color: "#111", fontWeight: "500" },
  catAmount: { fontSize: 12, fontWeight: "600", color: "#ef4444" },
});
