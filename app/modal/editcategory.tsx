import {
  addCategory,
  Category,
  CategoryType,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categoryService";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

type PanelMode = "add" | "edit";

const ICONS = [
  "🛒",
  "🍴",
  "🛍️",
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
  "🛡️",
  "💼",
  "🎁",
  "📈",
  "💻",
  "🚀",
  "💵",
  "🧾",
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
  const [activeTab, setActiveTab] = useState<CategoryType>("expenditure");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);

  const [panelVisible, setPanelVisible] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>("add");
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const [draftTitle, setDraftTitle] = useState("");
  const [draftIcon, setDraftIcon] = useState(ICONS[0]);
  const [draftColor, setDraftColor] = useState(COLORS[0]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);

      const data = await getCategories(activeTab);
      setCategories(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể tải category.";

      Alert.alert("Lỗi", message);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories]),
  );

  const handleTabChange = (tab: CategoryType) => {
    setActiveTab(tab);
    setPanelVisible(false);
    setEditTarget(null);
  };

  const openAdd = () => {
    setDraftTitle("");
    setDraftIcon(ICONS[0]);
    setDraftColor(COLORS[0]);
    setEditTarget(null);
    setPanelMode("add");
    setPanelVisible(true);
  };

  const openEdit = (item: Category) => {
    setEditTarget(item);
    setDraftTitle(item.name);
    setDraftIcon(item.icon);
    setDraftColor(item.color);
    setPanelMode("edit");
    setPanelVisible(true);
  };

  const closePanel = () => {
    setPanelVisible(false);
    setEditTarget(null);
  };

  const handleSave = async () => {
    const name = draftTitle.trim();

    if (!name) {
      Alert.alert("Thiếu tên", "Nhập tên category trước đã.");
      return;
    }

    try {
      setSaving(true);

      if (panelMode === "add") {
        await addCategory({
          name,
          type: activeTab,
          icon: draftIcon,
          color: draftColor,
        });
      } else {
        if (!editTarget) return;

        await updateCategory(editTarget.id, {
          name,
          type: activeTab,
          icon: draftIcon,
          color: draftColor,
        });
      }

      await fetchCategories();
      closePanel();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu category.";

      Alert.alert("Lỗi", message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!editTarget) return;

    Alert.alert(
      "Xoá category",
      `Bạn có chắc muốn xoá "${editTarget.name}" không? Các giao dịch cũ sẽ bị mất liên kết category.`,
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Xoá",
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);

              await deleteCategory(editTarget.id);
              await fetchCategories();
              closePanel();
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Không thể xoá category.";

              Alert.alert("Lỗi", message);
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#2878f0" />
        </Pressable>

        <Text style={styles.title}>Edit category</Text>

        <View style={{ width: 34 }} />
      </View>

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
              {tab === "expenditure" ? "Expenditure" : "Revenue"}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.addRow} onPress={openAdd}>
        <Ionicons name="add" size={18} color="#2878f0" />
        <Text style={styles.addText}>Add category</Text>
      </Pressable>

      {loadingCategories ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#2878f0" />
          <Text style={styles.loadingText}>Đang tải category...</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="file-tray-outline" size={36} color="#ddd" />
              <Text style={styles.emptyText}>Chưa có category</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.catRow} onPress={() => openEdit(item)}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: `${item.color}22`,
                  },
                ]}
              >
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>

              <View style={styles.catInfo}>
                <Text style={styles.catLabel}>{item.name}</Text>
                <Text style={styles.catType}>{item.type}</Text>
              </View>

              <View
                style={[styles.colorPreview, { backgroundColor: item.color }]}
              />

              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </Pressable>
          )}
        />
      )}

      <Modal
        visible={panelVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.panelNav}>
            <Pressable onPress={closePanel} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#2878f0" />
              <Text style={styles.backLink}>Back</Text>
            </Pressable>

            <Text style={styles.panelTitle}>
              {panelMode === "add" ? "Add category" : "Edit category"}
            </Text>

            {panelMode === "edit" ? (
              <Pressable onPress={handleDelete} disabled={saving}>
                <Text style={styles.deleteLink}>Delete</Text>
              </Pressable>
            ) : (
              <View style={{ width: 52 }} />
            )}
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
            <View style={styles.previewBox}>
              <View
                style={[
                  styles.previewIcon,
                  { backgroundColor: `${draftColor}22` },
                ]}
              >
                <Text style={{ fontSize: 30 }}>{draftIcon}</Text>
              </View>

              <Text style={styles.previewName}>
                {draftTitle.trim() || "Category name"}
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Enter category name"
              placeholderTextColor="#aaa"
              value={draftTitle}
              onChangeText={setDraftTitle}
            />

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

            <Pressable
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {panelMode === "add" ? "Add category" : "Save category"}
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginTop: 40,
  },

  backBtn: {
    minWidth: 34,
    minHeight: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  segmentRow: {
    flexDirection: "row",
    margin: 12,
    backgroundColor: "#e8f0fe",
    borderRadius: 12,
    padding: 4,
  },

  segBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: "center",
  },

  segActive: {
    backgroundColor: "#2878f0",
  },

  segText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2878f0",
  },

  segTextActive: {
    color: "#fff",
  },

  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
  },

  addText: {
    fontSize: 14,
    color: "#2878f0",
    fontWeight: "700",
  },

  loadingBox: {
    margin: 12,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 8,
    color: "#666",
    fontSize: 13,
  },

  emptyBox: {
    margin: 12,
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 8,
    color: "#999",
    fontSize: 13,
    fontWeight: "600",
  },

  catRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    gap: 10,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  catInfo: {
    flex: 1,
  },

  catLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  catType: {
    marginTop: 3,
    fontSize: 11,
    color: "#9ca3af",
  },

  colorPreview: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  panelNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 12,
  },

  backLink: {
    color: "#2878f0",
    fontSize: 14,
    fontWeight: "600",
  },

  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  deleteLink: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "700",
  },

  previewBox: {
    alignItems: "center",
    paddingVertical: 18,
  },

  previewIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  previewName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  fieldLabel: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  fieldInput: {
    marginHorizontal: 16,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
  },

  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginHorizontal: 16,
  },

  iconCell: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },

  iconCellSelected: {
    borderColor: "#2878f0",
    backgroundColor: "#e8f0fe",
  },

  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginHorizontal: 16,
  },

  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },

  colorDotSelected: {
    borderColor: "#111827",
  },

  saveBtn: {
    marginHorizontal: 16,
    marginTop: 28,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#2878f0",
    alignItems: "center",
    justifyContent: "center",
  },

  saveBtnDisabled: {
    opacity: 0.65,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
