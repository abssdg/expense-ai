import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
};

export default function BlueButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1f6fff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
