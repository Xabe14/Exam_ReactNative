// screens/user/CartScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  fetchCartItems,
  removeCartItem,
  updateCartItemQuantity,
  CartItem,
} from "../../components/Lesson 13/database";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getProductImageSource } from "../utils/imageMap";

// --- Map ảnh ---
const images: Record<string, any> = {
  bag1: require("../../assets/images/bag1.jpg"),
  hoalen1: require("../../assets/images/hoalen1.jpg"),
  mockhoa1: require("../../assets/images/mockhoa1.jpg"),
  trangsuc: require("../../assets/images/trangsuc.jpg"),
  default: require("../../assets/images/bag1.jpg"),
};


export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Load giỏ hàng từ DB ---
  const loadCart = async () => {
    setLoading(true);
    const items = await fetchCartItems();
    console.log("Giỏ hàng:", items);
    setCartItems(items);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  // --- Tăng số lượng ---
  const handleIncrease = async (item: CartItem) => {
    await updateCartItemQuantity(item.productId, item.quantity + 1);
    loadCart();
  };

  // --- Giảm số lượng ---
  const handleDecrease = async (item: CartItem) => {
    if (item.quantity <= 1) return;
    await updateCartItemQuantity(item.productId, item.quantity - 1);
    loadCart();
  };

  // --- Xóa sản phẩm ---
  const handleRemove = (item: CartItem) => {
    Alert.alert("Xóa sản phẩm?", "Bạn có chắc muốn xóa sản phẩm này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        onPress: async () => {
          await removeCartItem(item.productId);
          loadCart();
        },
      },
    ]);
  };

  // --- Tổng tiền ---
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading)
    return (
      <ActivityIndicator size="large" color="#E91E63" style={{ flex: 1 }} />
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={getProductImageSource(item.img)} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {(item.price * item.quantity).toLocaleString("vi-VN")} đ
              </Text>
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => handleDecrease(item)}
                >
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => handleIncrease(item)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item)}>
              <Text style={styles.removeText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Text style={styles.totalText}>
              Tổng: {totalPrice.toLocaleString("vi-VN")} đ
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push("/user/checkout")}
            >
              <Text style={styles.checkoutText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  itemImage: { width: 80, height: 80, borderRadius: 8 },
  itemInfo: { flex: 1, marginLeft: 10 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { color: "#E91E63", marginVertical: 4 },
  qtyContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  qtyButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qtyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  qtyValue: { marginHorizontal: 6, fontSize: 16 },
  removeText: { fontSize: 18, marginLeft: 8 },
  footer: { padding: 16, borderTopWidth: 1, borderColor: "#ddd" },
  totalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  checkoutButton: {
    backgroundColor: "#E91E63",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
