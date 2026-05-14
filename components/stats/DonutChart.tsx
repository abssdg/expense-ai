import { CategoryStat } from "@/constants/stats/types";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

type Props = {
  data: CategoryStat[];
  tab: "expenditure" | "revenue";
  total: number;
};

export function DonutChart({ data, tab, total }: Props) {
  const SIZE = 200;
  const STROKE = 36;
  const R = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const CENTER = SIZE / 2;

  let offset = 0;
  const segments = data.map((item) => {
    const dash = (item.percentage / 100) * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dash;
    const rotation = (offset / 100) * 360 - 90;
    offset += item.percentage;
    return { ...item, dash, gap, rotation };
  });

  const fmtTotal = (n: number) =>
    (n < 0 ? "-" : "") + Math.abs(n).toLocaleString("vi-VN") + " VND";

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <G rotation={0} origin={`${CENTER}, ${CENTER}`}>
          {/* background ring */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={R}
            stroke="#f0f0f0"
            strokeWidth={STROKE}
            fill="none"
          />
          {segments.map((seg, i) => (
            <Circle
              key={i}
              cx={CENTER}
              cy={CENTER}
              r={R}
              stroke={seg.color}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={CIRCUMFERENCE * 0.25}
              rotation={seg.rotation}
              origin={`${CENTER}, ${CENTER}`}
              strokeLinecap="butt"
            />
          ))}
        </G>
      </Svg>
      {/* Center label */}
      <View style={styles.centerLabel}>
        <Text style={styles.centerTitle}>
          {tab === "expenditure" ? "Total expenditure" : "Total revenue"}
        </Text>
        <Text
          style={[
            styles.centerAmount,
            { color: tab === "expenditure" ? "#ef4444" : "#16a34a" },
          ]}
        >
          {fmtTotal(total)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  centerTitle: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 4,
  },
  centerAmount: { fontSize: 14, fontWeight: "700", textAlign: "center" },
});
