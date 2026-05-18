import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/services/authService";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

type Currency = "VND" | "USD" | "JPY" | "KRW";
type Language = "Vietnamese" | "English";

const SETTINGS_KEY = "@expense_ai_profile_settings";

type ProfileSettings = {
  currency: Currency;
  notification: boolean;
  language: Language;
};

const defaultSettings: ProfileSettings = {
  currency: "VND",
  notification: false,
  language: "Vietnamese",
};

export default function IndividualScreen() {
  const router = useRouter();
  const { user, isLogin, loadingAuth } = useAuth();
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const [loggingOut, setLoggingOut] = useState(false);
  const [settings, setSettings] = useState<ProfileSettings>(defaultSettings);

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);

      if (!saved) return;

      const parsed = JSON.parse(saved) as ProfileSettings;
      setSettings({
        ...defaultSettings,
        ...parsed,
      });
    } catch (error) {
      console.log("Load profile settings error:", error);
    }
  };

  const saveSettings = async (nextSettings: ProfileSettings) => {
    try {
      setSettings(nextSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
    } catch (error) {
      console.log("Save profile settings error:", error);
      Alert.alert("Lỗi", "Không thể lưu cài đặt.");
    }
  };

  const updateCurrency = (currency: Currency) => {
    saveSettings({
      ...settings,
      currency,
    });

    setCurrencyModalVisible(false);
  };

  const updateLanguage = (language: Language) => {
    saveSettings({
      ...settings,
      language,
    });

    setLanguageModalVisible(false);
  };

  const toggleNotification = () => {
    saveSettings({
      ...settings,
      notification: !settings.notification,
    });
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            setLoggingOut(true);

            await signOut();

            router.replace("/auth/login");
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Không thể đăng xuất.";

            Alert.alert("Lỗi", message);
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  if (loadingAuth) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator color="#1677ff" />
        <Text style={styles.loadingText}>Đang kiểm tra đăng nhập...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/1864/1864514.png",
          }}
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <Text style={styles.name}>{isLogin ? displayName : "Guest"}</Text>
          <Text style={styles.email} numberOfLines={1}>
            {isLogin ? user?.email : "---"}
          </Text>
        </View>
      </View>

      {!isLogin && (
        <View style={styles.loginBox}>
          <Text style={styles.loginTitle}>
            Sign in to not lose data offline!
          </Text>

          <Text style={styles.loginDesc}>
            You can log in to your other platforms to synchronize data
          </Text>

          <Pressable
            style={styles.loginButton}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.menu}>
        <MenuItem
          icon={<FontAwesome5 name="money-bill-alt" size={14} color="#111" />}
          title="Money"
          value={settings.currency}
          onPress={() => setCurrencyModalVisible(true)}
        />

        <MenuItem
          icon={
            <Ionicons name="notifications-outline" size={17} color="#111" />
          }
          title="Notification"
          value={settings.notification ? "Turn on" : "Turn off"}
          rightElement={
            <Switch
              value={settings.notification}
              onValueChange={toggleNotification}
              trackColor={{
                false: "#ddd",
                true: "#9ec5ff",
              }}
              thumbColor={settings.notification ? "#1677ff" : "#f4f3f4"}
            />
          }
        />

        <MenuItem
          icon={<MaterialIcons name="translate" size={17} color="#111" />}
          title="Language"
          value={settings.language}
          onPress={() => setLanguageModalVisible(true)}
        />

        {isLogin && (
          <MenuItem
            icon={<Ionicons name="log-out-outline" size={18} color="#ff3b30" />}
            title={loggingOut ? "Logging out..." : "Log out"}
            danger
            onPress={handleLogout}
          />
        )}
      </View>

      <OptionModal
        visible={currencyModalVisible}
        title="Select currency"
        options={["VND", "USD", "JPY", "KRW"]}
        selectedValue={settings.currency}
        onSelect={(value) => updateCurrency(value as Currency)}
        onClose={() => setCurrencyModalVisible(false)}
      />

      <OptionModal
        visible={languageModalVisible}
        title="Select language"
        options={["Vietnamese", "English"]}
        selectedValue={settings.language}
        onSelect={(value) => updateLanguage(value as Language)}
        onClose={() => setLanguageModalVisible(false)}
      />
    </SafeAreaView>
  );
}

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  value?: string;
  danger?: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
};

function MenuItem({
  icon,
  title,
  value,
  danger,
  onPress,
  rightElement,
}: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.menuLeft}>
        {icon}
        <Text style={[styles.menuTitle, danger && styles.dangerText]}>
          {title}
        </Text>
      </View>

      <View style={styles.menuRight}>
        {rightElement ? (
          rightElement
        ) : (
          <>
            {value && <Text style={styles.menuValue}>{value}</Text>}
            <Ionicons name="chevron-forward" size={17} color="#bbb" />
          </>
        )}
      </View>
    </Pressable>
  );
}

type OptionModalProps = {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

function OptionModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: OptionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>

            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={20} color="#999" />
            </Pressable>
          </View>

          {options.map((item) => {
            const active = item === selectedValue;

            return (
              <Pressable
                key={item}
                style={styles.optionItem}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[styles.optionText, active && styles.optionTextActive]}
                >
                  {item}
                </Text>

                {active && (
                  <Ionicons name="checkmark-circle" size={20} color="#1677ff" />
                )}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#999",
    fontSize: 13,
  },

  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    marginTop: 50,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },

  userInfo: {
    flex: 1,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  email: {
    fontSize: 11,
    color: "#aaa",
    marginTop: 4,
  },

  loginBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 34,
    alignItems: "center",
  },

  loginTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },

  loginDesc: {
    fontSize: 10,
    color: "#b0b0b0",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 14,
  },

  loginButton: {
    width: "100%",
    height: 36,
    borderRadius: 8,
    backgroundColor: "#1677ff",
    justifyContent: "center",
    alignItems: "center",
  },

  loginButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },

  menuItem: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },

  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  menuValue: {
    fontSize: 12,
    color: "#aaa",
  },

  dangerText: {
    color: "#ff3b30",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 8,
    overflow: "hidden",
  },

  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  optionItem: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  optionTextActive: {
    color: "#1677ff",
    fontWeight: "700",
  },
});
