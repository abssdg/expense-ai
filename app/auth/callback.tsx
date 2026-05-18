import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
} from "react-native";

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 700);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator color="#0EA5E9" size="large" />
      <Text style={styles.text}>Đang hoàn tất đăng nhập...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#0284C7",
  },
});
