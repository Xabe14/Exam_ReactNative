import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import Header from "@/components/Lesson 13/Header";
// import Header from "@/components/Lesson 13/Header";

export default function AdminHome() {
  const router = useRouter();
  const { user, logout } = useAuth(); // Lấy thông tin user và hàm logout

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trang chủ admin</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/adminPage/users")}
      >
        <Text style={styles.buttonText}>Quản lý Users</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/adminPage/categories")}
      >
        <Text style={styles.buttonText}>Quản lý Loại Sản phẩm</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/adminPage/products")}
      >
        <Text style={styles.buttonText}>Quản lý Sản phẩm</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/adminPage/orders")}
      >
        <Text style={styles.buttonText}>Quản lý Đơn hàng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#d0f0fd",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#014f86",
  },
  button: {
    width: "80%",
    padding: 16,
    backgroundColor: "#66c2a5",
    marginVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#333",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
