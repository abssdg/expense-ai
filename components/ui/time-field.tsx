import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  value: string;
  onPress?: () => void;
};

export default function TimeField({ label, value, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.box} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.right}>
        <Ionicons name="chevron-back" size={22} color="#1f6fff" />

        <Text style={styles.value}>{value}</Text>

        <Ionicons name="chevron-forward" size={22} color="#1f6fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    minWidth: 70,
    textAlign: "center",
  },
});
