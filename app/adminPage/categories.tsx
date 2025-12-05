import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Category,
  fetchCategories,
  addCategory as addCategoryDB,
  updateCategory as updateCategoryDB,
  deleteCategory as removeCategoryDB,
} from "../../components/Lesson 13/database";
import { router } from "expo-router";

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // Load data từ DB
  const loadData = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Thêm category (ghi vào DB)
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    await addCategoryDB(newCategory);
    await loadData();
    setNewCategory("");
  };

  // Xóa category (DB + reload)
  const deleteCategory = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có muốn xóa loại sản phẩm này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await removeCategoryDB(id);
          await loadData();
        },
      },
    ]);
  };

  // Bắt đầu sửa
  const startEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  // Lưu sửa
  const saveEdit = async () => {
    if (!editingName.trim() || editingId === null) return;

    await updateCategoryDB(editingId, editingName);
    await loadData();

    setEditingId(null);
    setEditingName("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Loại Sản phẩm</Text>

      {/* --- Thêm Category --- */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Thêm loại mới..."
          style={styles.input}
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCategory}>
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* --- Danh sách Categories --- */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            {/* Nếu đang sửa */}
            {editingId === item.id ? (
              <TextInput
                style={styles.editInput}
                value={editingName}
                onChangeText={setEditingName}
              />
            ) : (
              <Text style={styles.categoryText}>{item.name}</Text>
            )}

            <View style={{ flexDirection: "row", gap: 14 }}>
              {/* Nút thêm SP */}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/adminPage/add-product/[categoryId]",
                    params: { categoryId: item.id.toString() },
                  })
                }
              >
                <Text>Thêm SP</Text>
              </TouchableOpacity>

              {/* Edit hoặc Save */}
              {editingId === item.id ? (
                <TouchableOpacity onPress={saveEdit}>
                  <Text style={{ color: "green", fontWeight: "bold" }}>
                    Lưu
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => startEdit(item.id, item.name)}>
                  <Text style={{ color: "blue", fontWeight: "bold" }}>Sửa</Text>
                </TouchableOpacity>
              )}

              {/* Xóa */}
              <TouchableOpacity onPress={() => deleteCategory(item.id)}>
                <Text style={styles.deleteText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#e0f7fa" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#00796b",
  },
  inputRow: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#b2dfdb",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  addButton: {
    backgroundColor: "#26a69a",
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#b2dfdb",
  },
  deleteText: { color: "red", fontWeight: "bold" },
  categoryText: { fontSize: 16, fontWeight: "600" },
  editInput: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
});
