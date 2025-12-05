import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  User as DbUser,
  deleteUser,
  fetchUsers,
  updateUserRole,
} from "../../components/Lesson 13/database";

export default function ManageUsers() {
  const [users, setUsers] = useState<DbUser[]>([]);

  const loadUsers = async () => {
    const allUsers = await fetchUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRole = async (user: DbUser) => {
    const newRole = user.role === "user" ? "admin" : "user";
    await updateUserRole(user.id, newRole);
    loadUsers();
  };

  const removeUser = async (user: DbUser) => {
    if (user.username === "admin") {
      Alert.alert("Không thể xóa admin gốc!");
      return;
    }
    Alert.alert("Xác nhận", `Bạn có muốn xóa user ${user.username}?`, [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteUser(user.id);
          loadUsers();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Users</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.username}>
              {item.username} ({item.role})
            </Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.toggleButton]}
                onPress={() => toggleRole(item)}
              >
                <Text style={styles.buttonText}>
                  {item.role === "user" ? "Make Admin" : "Make User"}
                </Text>
              </TouchableOpacity>
              {item.username !== "admin" && (
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => removeUser(item)}
                >
                  <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
              )}
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
  itemRow: {
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#b2dfdb",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: { fontSize: 16, fontWeight: "600" },
  buttons: { flexDirection: "row" },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
    shadowColor: "#333",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  toggleButton: { backgroundColor: "#26a69a" },
  deleteButton: { backgroundColor: "#ef5350" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
