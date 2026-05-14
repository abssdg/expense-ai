import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  leftTitle: string;
  rightTitle: string;
  active: "expenditure" | "revenue";
  onChange: (value: "expenditure" | "revenue") => void;
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
        style={[styles.button, active === "expenditure" && styles.activeButton]}
        onPress={() => onChange("expenditure")}
      >
        <Text
          style={[styles.text, active === "expenditure" && styles.activeText]}
        >
          {rightTitle}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, active === "revenue" && styles.activeButton]}
        onPress={() => onChange("revenue")}
      >
        <Text style={[styles.text, active === "revenue" && styles.activeText]}>
          {leftTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#dce7ff",
    borderRadius: 16,
    overflow: "hidden",
  },

  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },

  activeButton: {
    backgroundColor: "#1f6fff",
  },

  text: {
    color: "#1f6fff",
    fontWeight: "600",
    fontSize: 16,
  },

  activeText: {
    color: "#fff",
  },
});
