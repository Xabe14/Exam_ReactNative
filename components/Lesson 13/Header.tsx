// components/Header.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { fetchCartItems } from "../Lesson 13/database";
import { useAuth } from "../../context/auth";
import { router } from "expo-router";

export default function Header() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    const items = await fetchCartItems();
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQty);
  };

  // Chạy mỗi lần màn hình focus
  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.logoText}>🛒 Handmade Shop</Text>

        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.cartIcon}
            onPress={() => {
              if (user) {
                router.push("/user/cart");
              } else {
                Alert.alert(
                  "⚠️ Bạn cần đăng nhập",
                  "Vui lòng đăng nhập để xem giỏ hàng"
                );
              }
            }}
          >
            <Ionicons name="cart" size={28} color="white" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {user ? (
            <View style={styles.authContainer}>
              <Text style={styles.welcomeText}>Xin chào, {user.username}!</Text>
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.guestText}>Khách</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#E91E63" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  logoText: { fontSize: 20, fontWeight: "bold", color: "white" },
  rightContainer: { flexDirection: "row", alignItems: "center" },
  cartIcon: { marginRight: 15, position: "relative" },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "yellow",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartBadgeText: { color: "#E91E63", fontWeight: "bold", fontSize: 12 },
  authContainer: { flexDirection: "row", alignItems: "center" },
  welcomeText: {
    color: "white",
    marginRight: 10,
    fontSize: 15,
    fontWeight: "500",
  },
  logoutButton: { padding: 5 },
  guestText: { color: "white", fontSize: 15 },
});
