import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
};

export default function CategoryCard({ title, icon, active, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, active && styles.activeCard]}
      onPress={onPress}
    >
      <View>{icon}</View>

      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "transparent",
  },

  activeCard: {
    borderColor: "#1f6fff",
    backgroundColor: "#eef4ff",
  },

  text: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "500",
  },
});
