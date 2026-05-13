import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  leftTitle: string;
  rightTitle: string;
  active: "left" | "right";
  onChange: (value: "left" | "right") => void;
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
        style={[styles.button, active === "left" && styles.activeButton]}
        onPress={() => onChange("left")}
      >
        <Text style={[styles.text, active === "left" && styles.activeText]}>
          {leftTitle}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, active === "right" && styles.activeButton]}
        onPress={() => onChange("right")}
      >
        <Text style={[styles.text, active === "right" && styles.activeText]}>
          {rightTitle}
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
