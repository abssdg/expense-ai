import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
  color?: string;
};

export default function CategoryCard({
  title,
  icon,
  active,
  onPress,
  color,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, active && styles.activeCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[styles.iconBox, color && { backgroundColor: `${color}22` }]}
      >
        {icon}
      </View>

      <Text style={styles.text} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "23%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },

  activeCard: {
    borderColor: "#1f6fff",
    backgroundColor: "#eef4ff",
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },

  text: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "500",
    color: "#111",
    maxWidth: "90%",
  },
});
