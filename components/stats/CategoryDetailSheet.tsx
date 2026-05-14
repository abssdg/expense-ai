import { CategoryStat } from "@/constants/stats/types";
import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  category: CategoryStat | null;
  month: number;
  year: number;
  onClose: () => void;
};

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
const MINI_LABELS = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

// mock detail rows
const MOCK_ROWS = [
  { label: "8/8", note: "Buy Atomic Habit books", amount: -180_000 },
  { label: "Aug 12", note: "Buy computer mouse", amount: -500_000 },
  { label: "Aug 20", note: "Buy the keyboard", amount: -780_000 },
  { label: "Aug 30", note: "Buy T-shirt", amount: -180_000 },
];

const MINI_DATA = [1.1, 0.9, 0.6, 0.8, 2.8, 1.6, 2.3, 3.2, 0, 0, 0, 0];

export function CategoryDetailSheet({
  visible,
  category,
  month,
  year,
  onClose,
}: Props) {
  if (!category) return null;
  const max = Math.max(...MINI_DATA, 1);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {category.name} in {year}
          </Text>
          <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color="#999" />
          </Pressable>
        </View>

        {/* Mini bar chart */}
        <View style={styles.miniChart}>
          <View style={styles.miniBars}>
            {MINI_DATA.map((v, i) => {
              const h = Math.max((v / max) * 80, v > 0 ? 4 : 0);
              const isSelected = i === month;
              return (
                <View key={i} style={styles.miniCol}>
                  <View style={styles.miniTrack}>
                    <View
                      style={[
                        styles.miniBar,
                        {
                          height: h,
                          backgroundColor: isSelected ? "#ef4444" : "#e0e0e0",
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.miniLabel,
                      isSelected && { color: "#111", fontWeight: "600" },
                    ]}
                  >
                    {MINI_LABELS[i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Total for month */}
        <View style={styles.monthTotal}>
          <Text style={styles.monthTotalLabel}>
            Total expenditure in {MONTHS[month].slice(0, 3)}...
          </Text>
          <Text style={styles.monthTotalValue}>
            {category.amount.toLocaleString("vi-VN")} VND
          </Text>
        </View>

        {/* Detail rows */}
        <ScrollView>
          {MOCK_ROWS.map((row, i) => (
            <View key={i} style={styles.row}>
              <View style={styles.rowIcon}>
                <Text style={{ fontSize: 16 }}>{category.icon}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{category.name}</Text>
                <Text style={styles.rowMeta}>
                  {row.label} · {row.note}
                </Text>
              </View>
              <Text style={styles.rowAmount}>
                {row.amount.toLocaleString("vi-VN")} VND
              </Text>
              <Ionicons name="chevron-forward" size={13} color="#ddd" />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 15, fontWeight: "600", color: "#111" },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },

  miniChart: { paddingHorizontal: 12, paddingBottom: 8 },
  miniBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    gap: 4,
  },
  miniCol: { flex: 1, alignItems: "center", gap: 4 },
  miniTrack: { width: "100%", height: 80, justifyContent: "flex-end" },
  miniBar: { width: "100%", borderRadius: 3 },
  miniLabel: { fontSize: 8, color: "#bbb" },

  monthTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#f0f0f0",
  },
  monthTotalLabel: { fontSize: 13, color: "#888" },
  monthTotalValue: { fontSize: 13, fontWeight: "700", color: "#ef4444" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f5f5f5",
    gap: 10,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 13, fontWeight: "500", color: "#111" },
  rowMeta: { fontSize: 11, color: "#aaa", marginTop: 1 },
  rowAmount: { fontSize: 13, fontWeight: "600", color: "#ef4444" },
});
