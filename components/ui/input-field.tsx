import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  placeholder: string;
};

export default function InputField({ label, placeholder }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <Text style={styles.label}>{label}</Text>

        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#bbb"
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,

    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginRight: 10,
    width: 70,
  },

  input: {
    flex: 1,
    fontSize: 12,
  },
});
