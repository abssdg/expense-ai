import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
};

export default function BlueButton({ title, onPress, loading = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.disabled]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#1f6fff",
    justifyContent: "center",
    alignItems: "center",
  },

  disabled: {
    opacity: 0.65,
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
