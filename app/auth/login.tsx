import { signInWithEmail, signUpWithEmail } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const isLoginMode = mode === "login";

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Thiếu email", "Nhập email trước đã bro.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Mật khẩu quá ngắn", "Mật khẩu nên có ít nhất 6 ký tự.");
      return;
    }

    try {
      setLoading(true);

      if (isLoginMode) {
        await signInWithEmail(email, password);
        router.replace("/(tabs)/profile");
      } else {
        await signUpWithEmail(email, password);

        Alert.alert(
          "Đăng ký thành công",
          "Nếu Supabase bật xác nhận email, bạn cần vào email để xác nhận trước khi đăng nhập.",
        );

        setMode("login");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra.";

      Alert.alert(
        isLoginMode ? "Đăng nhập thất bại" : "Đăng ký thất bại",
        message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {isLoginMode ? "Log in" : "Create account"}
          </Text>

          <Text style={styles.subtitle}>
            {isLoginMode
              ? "Đăng nhập để đồng bộ dữ liệu chi tiêu"
              : "Tạo tài khoản để lưu dữ liệu lên cloud"}
          </Text>

          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={18} color="#999" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#999" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry={secure}
              style={styles.input}
            />

            <Pressable onPress={() => setSecure((prev) => !prev)}>
              <Ionicons
                name={secure ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#999"
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.mainButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.mainButtonText}>
                {isLoginMode ? "Log in" : "Register"}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.switchButton}
            onPress={() => setMode(isLoginMode ? "register" : "login")}
          >
            <Text style={styles.switchText}>
              {isLoginMode
                ? "Chưa có tài khoản? Đăng ký"
                : "Đã có tài khoản? Đăng nhập"}
            </Text>
          </Pressable>

          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>Quay lại</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    fontSize: 13,
    color: "#888",
  },

  inputBox: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#f4f6fb",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },

  mainButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1677ff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  disabledButton: {
    opacity: 0.65,
  },

  mainButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  switchButton: {
    alignItems: "center",
    marginTop: 16,
  },

  switchText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1677ff",
  },

  backButton: {
    alignItems: "center",
    marginTop: 14,
  },

  backText: {
    fontSize: 13,
    color: "#999",
  },
});
