import { MonthStat } from "@/constants/stats/useStats";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  data: MonthStat[];
  tab: "expenditure" | "revenue";
  selectedMonth: number;
  onSelect: (month: number) => void;
};

const LABELS = [
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

export function BarChart({ data, tab, selectedMonth, onSelect }: Props) {
  const values = data.map((d) =>
    tab === "expenditure" ? Math.abs(d.expenditure) : d.revenue,
  );
  const max = Math.max(...values, 1);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {data.map((d, i) => {
          const val =
            tab === "expenditure" ? Math.abs(d.expenditure) : d.revenue;
          const height = Math.max((val / max) * 100, val > 0 ? 4 : 0);
          const isSelected = d.month === selectedMonth;
          return (
            <Pressable
              key={i}
              style={styles.barCol}
              onPress={() => onSelect(d.month)}
            >
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${height}%`,
                      backgroundColor: isSelected
                        ? tab === "expenditure"
                          ? "#ef4444"
                          : "#2878f0"
                        : "#e0e0e0",
                    },
                  ]}
                />
              </View>

              <Text
                style={[styles.barLabel, isSelected && styles.barLabelActive]}
              >
                {LABELS[i]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 8, paddingTop: 8 },
  bars: { flexDirection: "row", alignItems: "flex-end", height: 100, gap: 3 },
  barCol: { flex: 1, alignItems: "center", gap: 4 },
  barTrack: { flex: 1, width: "100%", justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 3 },
  barLabel: { fontSize: 9, color: "#bbb" },
  barLabelActive: { color: "#111", fontWeight: "600" },
});
