import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  leftTitle: string;
  rightTitle: string;
  active: "revenue" | "expenditure";
  onChange: (value: "revenue" | "expenditure") => void;
};

export default function SegmentSwitch({
  leftTitle,
  rightTitle,
  active,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, active === "revenue" && styles.activeButton]}
        onPress={() => onChange("revenue")}
      >
        <Text style={[styles.text, active === "revenue" && styles.activeText]}>
          {leftTitle}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, active === "expenditure" && styles.activeButton]}
        onPress={() => onChange("expenditure")}
      >
        <Text
          style={[styles.text, active === "expenditure" && styles.activeText]}
        >
          {rightTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: "#eef2f7",
    borderRadius: 18,
    flexDirection: "row",
    padding: 5,
  },

  button: {
    flex: 1,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  activeButton: {
    backgroundColor: "#1f6fff",
  },

  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "#777",
  },

  activeText: {
    color: "#fff",
  },
});
