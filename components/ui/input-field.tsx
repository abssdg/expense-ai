import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
};

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <Text style={styles.label}>{label}</Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#bbb"
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

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
    color: "#111",
    width: 90,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },
});
