import { CategoryStat } from "@/constants/stats/useStats";
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

function fmtVND(n: number) {
  return Math.abs(n).toLocaleString("vi-VN") + " VND";
}

function formatDate(date: string) {
  const day = date.slice(8, 10);
  const month = date.slice(5, 7);

  return `${day}/${month}`;
}

export function CategoryDetailSheet({
  visible,
  category,
  month,
  year,
  onClose,
}: Props) {
  if (!category) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.headerIcon,
                { backgroundColor: `${category.color}22` },
              ]}
            >
              <Text style={{ fontSize: 22 }}>{category.icon}</Text>
            </View>

            <View>
              <Text style={styles.title}>{category.name}</Text>
              <Text style={styles.subtitle}>
                {MONTHS[month]} {year}
              </Text>
            </View>
          </View>

          <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color="#999" />
          </Pressable>
        </View>

        <View style={styles.monthTotal}>
          <Text style={styles.monthTotalLabel}>
            Total {category.type === "revenue" ? "revenue" : "expenditure"}
          </Text>

          <Text
            style={[
              styles.monthTotalValue,
              { color: category.type === "revenue" ? "#16a34a" : "#ef4444" },
            ]}
          >
            {category.type === "revenue" ? "+" : "-"}
            {fmtVND(category.amount)}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {category.transactions.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="receipt-outline" size={38} color="#ddd" />
              <Text style={styles.emptyText}>Không có giao dịch</Text>
            </View>
          ) : (
            category.transactions.map((tx) => {
              const amount = Number(tx.amount);

              return (
                <View key={tx.id} style={styles.row}>
                  <View
                    style={[
                      styles.rowIcon,
                      { backgroundColor: `${category.color}22` },
                    ]}
                  >
                    <Text style={{ fontSize: 16 }}>{category.icon}</Text>
                  </View>

                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{category.name}</Text>
                    <Text style={styles.rowMeta}>
                      {formatDate(tx.date)}
                      {tx.note ? ` · ${tx.note}` : ""}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.rowAmount,
                      {
                        color: tx.type === "revenue" ? "#16a34a" : "#ef4444",
                      },
                    ]}
                  >
                    {tx.type === "revenue" ? "+" : "-"}
                    {fmtVND(amount)}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

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

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#999",
  },

  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },

  monthTotal: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#f4f6fb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  monthTotalLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },

  monthTotalValue: {
    fontSize: 14,
    fontWeight: "800",
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: "#999",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },

  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  rowInfo: {
    flex: 1,
  },

  rowName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },

  rowMeta: {
    marginTop: 3,
    fontSize: 11,
    color: "#999",
  },

  rowAmount: {
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 8,
  },
});
