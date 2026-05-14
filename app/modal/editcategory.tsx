//ch tach compoment
import { categories } from "@/constants/categories";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Theme = typeof Colors.light;

type Item = {
  title: string;
  icon: React.ReactNode;
  color?: string;
};

type PanelMode = "add" | "edit";

const ICONS = [
  "🛒",
  "🍴",
  "🛍",
  "⛽",
  "🏠",
  "⚡",
  "📱",
  "🎓",
  "💳",
  "🏦",
  "🚗",
  "✈️",
  "🏥",
  "🎵",
  "📚",
  "🎮",
  "☕",
  "💊",
  "🌍",
  "🛡",
];

const COLORS = [
  "#222222",
  "#888888",
  "#8B6A4E",
  "#a855f7",
  "#7c3aed",
  "#1e3a5f",
  "#2563eb",
  "#06b6d4",
  "#22c55e",
  "#10b981",
  "#84cc16",
  "#eab308",
  "#f97316",
  "#ec4899",
  "#f472b6",
  "#fca5a5",
  "#ef4444",
  "#dc2626",
];

export default function EditCategoryScreen() {
  const [activeTab, setActiveTab] = useState<"expenditure" | "revenue">(
    "expenditure",
  );
  const [data, setData] = useState<Item[]>(categories["expenditure"]);

  const [panelVisible, setPanelVisible] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>("add");
  const [editTarget, setEditTarget] = useState<Item | null>(null);

  const [draftTitle, setDraftTitle] = useState("");
  const [draftIcon, setDraftIcon] = useState(ICONS[0]);
  const [draftColor, setDraftColor] = useState(COLORS[0]);

  const theme = Colors.light;
  const styles = createStyles(theme);

  const handleTabChange = (tab: "expenditure" | "revenue") => {
    setActiveTab(tab);
    setData(categories[tab]);
  };

  const openAdd = () => {
    setDraftTitle("");
    setDraftIcon(ICONS[0]);
    setDraftColor(COLORS[0]);
    setPanelMode("add");
    setPanelVisible(true);
  };

  const openEdit = (item: Item) => {
    setEditTarget(item);
    setDraftTitle(item.title);
    setDraftIcon(typeof item.icon === "string" ? item.icon : ICONS[0]);
    setDraftColor(item.color ?? COLORS[0]);
    setPanelMode("edit");
    setPanelVisible(true);
  };

  const handleSave = () => {
    if (!draftTitle.trim()) return;
    if (panelMode === "add") {
      setData((prev) => [
        ...prev,
        { title: draftTitle, icon: draftIcon, color: draftColor },
      ]);
    } else if (editTarget) {
      setData((prev) =>
        prev.map((item) =>
          item.title === editTarget.title
            ? { ...item, title: draftTitle, icon: draftIcon, color: draftColor }
            : item,
        ),
      );
    }
    setPanelVisible(false);
  };

  const handleDelete = () => {
    if (editTarget) {
      setData((prev) => prev.filter((item) => item.title !== editTarget.title));
    }
    setPanelVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#2878f0" />
        </Pressable>
        <Text style={styles.title}>Costal editing</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Segment control */}
      <View style={styles.segmentRow}>
        {(["expenditure", "revenue"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.segBtn, activeTab === tab && styles.segActive]}
            onPress={() => handleTabChange(tab)}
          >
            <Text
              style={[
                styles.segText,
                activeTab === tab && styles.segTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Add row */}
      <Pressable style={styles.addRow} onPress={openAdd}>
        <Ionicons name="add" size={18} color="#2878f0" />
        <Text style={styles.addText}>Add category</Text>
      </Pressable>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Pressable style={styles.catRow} onPress={() => openEdit(item)}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    (item.color ?? "#88888822") + (item.color ? "22" : ""),
                },
              ]}
            >
              {typeof item.icon === "string" ? (
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              ) : (
                item.icon
              )}
            </View>
            <Text style={styles.catLabel}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>
        )}
      />

      {/* Add / Edit Panel */}
      <Modal
        visible={panelVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.container}>
          {/* Panel nav */}
          <View style={styles.panelNav}>
            <Pressable
              onPress={() => setPanelVisible(false)}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={22} color="#2878f0" />
              <Text style={styles.backLink}>Back</Text>
            </Pressable>
            <Text style={styles.panelTitle}>
              {panelMode === "add" ? "Add category" : "Fix the category"}
            </Text>
            {panelMode === "edit" ? (
              <Pressable onPress={handleDelete}>
                <Text style={styles.deleteLink}>Delete</Text>
              </Pressable>
            ) : (
              <View style={{ width: 48 }} />
            )}
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
            {/* Name */}
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Enter the name of the category"
              value={draftTitle}
              onChangeText={setDraftTitle}
            />

            {/* Icon */}
            <Text style={styles.fieldLabel}>Icon</Text>
            <View style={styles.iconGrid}>
              {ICONS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  style={[
                    styles.iconCell,
                    draftIcon === ic && styles.iconCellSelected,
                  ]}
                  onPress={() => setDraftIcon(ic)}
                >
                  <Text style={{ fontSize: 20 }}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Color */}
            <Text style={styles.fieldLabel}>Color</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((col) => (
                <Pressable
                  key={col}
                  style={[
                    styles.colorDot,
                    { backgroundColor: col },
                    draftColor === col && styles.colorDotSelected,
                  ]}
                  onPress={() => setDraftColor(col)}
                />
              ))}
            </View>

            {/* Save */}
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save the catalog</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // Title header
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingVertical: 12,
      marginTop: 40,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      // bỏ textAlign: "center" vì đã dùng space-between
    },

    // Segment
    segmentRow: {
      flexDirection: "row",
      margin: 12,
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      padding: 3,
    },
    segBtn: {
      flex: 1,
      paddingVertical: 7,
      borderRadius: 8,
      alignItems: "center",
    },
    segActive: { backgroundColor: "#2878f0" },
    segText: { fontSize: 14, fontWeight: "500", color: "#666" },
    segTextActive: { color: "#fff" },

    // Add row
    addRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "#e0e0e0",
    },
    addText: { fontSize: 14, color: "#2878f0", fontWeight: "500" },

    // Category list
    catRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "#e0e0e0",
      gap: 10,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    catLabel: { flex: 1, fontSize: 15, color: theme.text },

    backBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    backLink: {
      fontSize: 16,
      color: "#2878f0",
    },

    // Panel
    panelNav: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    panelTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
    deleteLink: { fontSize: 15, color: "#e24b4a", fontWeight: "500" },

    // Fields
    fieldLabel: {
      fontSize: 13,
      fontWeight: "500",
      color: "#888",
      marginHorizontal: 16,
      marginBottom: 6,
      marginTop: 4,
    },
    fieldInput: {
      marginHorizontal: 16,
      marginBottom: 14,
      backgroundColor: "#f5f5f5",
      borderRadius: 10,
      padding: 12,
      fontSize: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "#ddd",
    },

    // Icon grid
    iconGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: 16,
      gap: 6,
      marginBottom: 14,
    },
    iconCell: {
      width: 48,
      height: 48,
      borderRadius: 10,
      backgroundColor: "#f5f5f5",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "transparent",
    },
    iconCellSelected: {
      borderColor: "#2878f0",
      backgroundColor: "#e8f0fe",
    },

    // Color grid
    colorGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: 16,
      gap: 8,
      marginBottom: 20,
    },
    colorDot: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    colorDotSelected: {
      borderWidth: 2.5,
      borderColor: "#333",
    },

    // Save button
    saveBtn: {
      marginHorizontal: 16,
      backgroundColor: "#2878f0",
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  });
