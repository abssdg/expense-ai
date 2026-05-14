import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function IndividualScreen() {
  const isLogin = false; // đổi true nếu đã đăng nhập

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/1864/1864514.png",
          }}
          style={styles.avatar}
        />

        <View>
          <Text style={styles.name}>Kittens saving</Text>
          <Text style={styles.email}>
            {isLogin ? "lance1108082@gmail.com" : "---"}
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

          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Log in</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.menu}>
        <MenuItem
          icon={<FontAwesome5 name="money-bill-alt" size={14} color="#111" />}
          title="Money"
          value="D"
        />

        <MenuItem
          icon={
            <Ionicons name="notifications-outline" size={17} color="#111" />
          }
          title="Notification"
          value="Turn off"
        />

        <MenuItem
          icon={<MaterialIcons name="translate" size={17} color="#111" />}
          title="Language"
          value="Vietnamese"
        />

        {isLogin && (
          <MenuItem
            icon={<Ionicons name="log-out-outline" size={18} color="#ff3b30" />}
            title="Log out"
            danger
          />
        )}
      </View>
    </SafeAreaView>
  );
}

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  value?: string;
  danger?: boolean;
};

function MenuItem({ icon, title, value, danger }: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem}>
      <View style={styles.menuLeft}>
        {icon}
        <Text style={[styles.menuTitle, danger && styles.dangerText]}>
          {title}
        </Text>
      </View>

      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={17} color="#bbb" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 8,
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
    height: 34,
    borderRadius: 5,
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
  },

  menuItem: {
    height: 42,
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
});
