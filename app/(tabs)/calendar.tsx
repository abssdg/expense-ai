import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { useCalendar } from "@/constants/calendar/useCalendar";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const fmtVND = (n: number) => Math.abs(n).toLocaleString("vi-VN") + " VND";

export default function CalendarScreen() {
  const theme = Colors.light;
  const {
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
  } = useCalendar();

  const remaining = totalRevenue + totalExpenditure;
  const dayLabel = selectedDay
    ? `${MONTHS[month].slice(0, 3)} ${selectedDay}, ${year} - ${DAY_NAMES[new Date(year, month, selectedDay).getDay()]}`
    : "";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={prevMonth} hitSlop={12} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={18} color="#2878f0" />
          </Pressable>
          <Text style={styles.monthTitle}>
            {MONTHS[month]} {year}
          </Text>
          <Pressable onPress={nextMonth} hitSlop={12} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={18} color="#2878f0" />
          </Pressable>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryDot} />
            <Text style={styles.summaryLabel}>Total revenue</Text>
            <Text style={[styles.summaryValue, { color: "#16a34a" }]}>
              +{fmtVND(totalRevenue)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View style={[styles.summaryDot, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.summaryLabel}>Total expenditure</Text>
            <Text style={[styles.summaryValue, { color: "#ef4444" }]}>
              -{fmtVND(totalExpenditure)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View style={[styles.summaryDot, { backgroundColor: "#2878f0" }]} />
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, { color: "#2878f0" }]}>
              {remaining >= 0 ? "+" : "-"}
              {fmtVND(remaining)}
            </Text>
          </View>
        </View>

        {/* Calendar card */}
        <View style={styles.calendarCard}>
          {loading ? (
            <View style={styles.loadingBox}>
              <Text style={styles.loadingText}>Đang tải lịch...</Text>
            </View>
          ) : (
            <CalendarGrid
              month={month}
              year={year}
              selectedDate={selectedDay}
              daySummaries={daySummaries}
              onSelectDate={openDay}
            />
          )}
        </View>
      </ScrollView>

      {/* Day sheet */}
      <Modal
        visible={sheetVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View style={styles.sheetAddBtn} />
            <Text style={styles.sheetTitle}>{dayLabel}</Text>
            <Pressable
              onPress={closeSheet}
              hitSlop={8}
              style={styles.sheetCloseBtn}
            >
              <Ionicons name="close" size={18} color="#999" />
            </Pressable>
          </View>

          <FlatList
            data={selectedTxs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Ionicons name="receipt-outline" size={40} color="#e0e0e0" />
                <Text style={styles.empty}>Không có giao dịch</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.txRow}>
                <View
                  style={[
                    styles.txIcon,
                    {
                      backgroundColor: `${item.categoryColor}22`,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{item.categoryIcon}</Text>
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txCategory}>{item.categoryName}</Text>
                  <Text style={styles.txNote}>{item.note}</Text>
                </View>
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: item.amount >= 0 ? "#16a34a" : "#ef4444" },
                    ]}
                  >
                    {item.amount >= 0 ? "+" : ""}
                    {item.amount.toLocaleString("vi-VN")}
                  </Text>
                  <Text style={styles.txCurrency}>VND</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#ddd" />
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fb" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginTop: 40,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e8f0fe",
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    minWidth: 160,
    textAlign: "center",
  },

  // Summary card
  summaryCard: {
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
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16a34a",
  },
  summaryLabel: { flex: 1, fontSize: 13, color: "#666" },
  summaryValue: { fontSize: 13, fontWeight: "700" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#f0f0f0" },

  // Calendar card
  calendarCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Sheet
  sheet: { flex: 1, backgroundColor: "#fff" },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  sheetAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e8f0fe",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: { fontSize: 14, fontWeight: "600", color: "#111" },
  emptyBox: { alignItems: "center", marginTop: 60, gap: 10 },
  empty: { color: "#bbb", fontSize: 14 },

  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f5f5f5",
    gap: 10,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: { flex: 1 },
  txCategory: { fontSize: 14, fontWeight: "500", color: "#111" },
  txNote: { fontSize: 12, color: "#aaa", marginTop: 1 },
  txRight: { alignItems: "flex-end" },
  txAmount: { fontSize: 13, fontWeight: "700" },
  txCurrency: { fontSize: 10, color: "#aaa" },

  loadingBox: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 13,
    color: "#999",
    fontWeight: "600",
  },
});
