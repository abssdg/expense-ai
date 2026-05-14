import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  month: number;
  year: number;
  selectedDate: number | null;
  daySummaries: Record<number, number>;
  onSelectDate: (day: number) => void;
};

const DOW = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const fmt = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000)
    return (abs / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "tr";
  if (abs >= 1_000) return Math.round(abs / 1_000) + "k";
  return String(abs);
};

export function CalendarGrid({
  month,
  year,
  selectedDate,
  daySummaries,
  onSelectDate,
}: Props) {
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startOffset = (() => {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
  })();
  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <View style={styles.container}>
      <View style={styles.dowRow}>
        {DOW.map((d) => (
          <Text key={d} style={styles.dowText}>
            {d}
          </Text>
        ))}
      </View>
      {rows.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((day, di) => {
            if (!day) return <View key={di} style={styles.cell} />;
            const isToday = isCurrentMonth && today.getDate() === day;
            const isSelected = selectedDate === day;
            const amount = daySummaries[day];
            return (
              <Pressable
                key={di}
                style={styles.cell}
                onPress={() => onSelectDate(day)}
              >
                <View
                  style={[
                    styles.circle,
                    isSelected && styles.circleSelected,
                    isToday && !isSelected && styles.circleToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.dateTextSelected,
                      isToday && !isSelected && styles.dateTextToday,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
                {amount !== undefined && (
                  <Text
                    style={[
                      styles.amountText,
                      { color: amount >= 0 ? "#22c55e" : "#ef4444" },
                    ]}
                  >
                    {fmt(amount)}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 6 },
  dowRow: { flexDirection: "row", marginBottom: 2 },
  dowText: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    color: "#aaa",
    paddingVertical: 4,
  },
  weekRow: { flexDirection: "row" },
  cell: { flex: 1, alignItems: "center", paddingVertical: 3, minHeight: 50 },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  circleSelected: { backgroundColor: "#2878f0" },
  circleToday: { borderWidth: 1.5, borderColor: "#2878f0" },
  dateText: { fontSize: 12, color: "#111" },
  dateTextSelected: { color: "#fff", fontWeight: "600" },
  dateTextToday: { color: "#2878f0", fontWeight: "600" },
  amountText: { fontSize: 9, marginTop: 1, fontWeight: "500" },
});
