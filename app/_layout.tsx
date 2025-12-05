import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/auth";
import {  initCartTable, initDatabase, initOrderTable } from "@/components/Lesson 13/database";
// import { CartProvider } from "@/context/CartContext";
// import { initDatabase, resetDatabase } from "../components/Lesson 13/database";

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const setupDb = async () => {
      // await resetDatabase();
      await initDatabase();
      await initCartTable();
    await initOrderTable();
      setIsDbReady(true);
      // try {
      //   await addUserIdColumnToOrders(); // gọi hàm ALTER TABLE
      //   await addAvatarColumnIfNotExists
      // } catch (e) {
      //   console.log("avatar column may already exist");
      // }
    };
    setupDb();
  }, []);

  if (!isDbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack>
        {/* Các màn hình public / tab */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Đăng nhập" }} />
        <Stack.Screen name="signup" options={{ title: "Đăng ký" }} />
        {/* Admin Stack */}
        <Stack.Screen
          name="admin/(adminTabs)"
          options={{ headerShown: false }}
        />
      </Stack>
      {/* <CartProvider>
        <Router />
      </CartProvider> */}
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
});
