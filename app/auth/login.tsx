import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/services/authService";
import { seedDefaultCategoriesIfNeeded } from "@/services/categoryService";
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
        await signInWithEmail(email.trim().toLowerCase(), password);
        await seedDefaultCategoriesIfNeeded();
        router.replace("/(tabs)");
      } else {
        await signUpWithEmail(email.trim().toLowerCase(), password);
        setPassword("");

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

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await signInWithGoogle();

      await seedDefaultCategoriesIfNeeded();

      router.replace("/(tabs)");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể đăng nhập Google.";

      Alert.alert("Đăng nhập Google thất bại", message);
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
              ? "Đăng nhập để đồng bộ dữ liệu"
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

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={[styles.googleButton, loading && styles.disabledButton]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={18} color="#0F172A" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
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

          {/* <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>Quay lại</Text>
          </Pressable> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = {
  primary: "#0EA5E9",
  primaryDark: "#0284C7",
  primaryLight: "#E0F2FE",
  background: "#F0F9FF",
  card: "#FFFFFF",
  text: "#0F172A",
  subText: "#64748B",
  border: "#BAE6FD",
  inputBg: "#F8FCFF",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 22,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: 24,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 26,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.subText,
    fontWeight: "500",
  },

  inputBox: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.inputBg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 10,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },

  mainButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 5,
  },

  disabledButton: {
    opacity: 0.65,
  },

  mainButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  switchButton: {
    alignItems: "center",
    marginTop: 18,
    paddingVertical: 4,
  },

  switchText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  backButton: {
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 4,
  },

  backText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.subText,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#BAE6FD",
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  googleButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  googleButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
});
