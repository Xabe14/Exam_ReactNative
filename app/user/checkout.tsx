import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  fetchCartItems,
  removeCartItem,
  updateCartItemQuantity,
  addOrder,
  Order,
} from "../../components/Lesson 13/database";
import { useAuth } from "../../context/auth";
import { getProductImageSource } from "../utils/imageMap";

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyer, setBuyer] = useState({ name: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const items = await fetchCartItems();
      setCartItems(items);
      setLoading(false);
    })();
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantity = async (id: number, qty: number) => {
    if (qty < 1) return;
    await updateCartItemQuantity(id, qty);
    const items = await fetchCartItems();
    setCartItems(items);
  };

  const handleRemove = async (id: number) => {
    await removeCartItem(id);
    const items = await fetchCartItems();
    setCartItems(items);
  };

  const validateForm = (): boolean => {
    if (!buyer.name.trim() || !buyer.phone.trim() || !buyer.address.trim()) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ thông tin người nhận."
      );
      return false;
    }
    if (!paymentMethod) {
      Alert.alert("Chưa chọn phương thức thanh toán");
      return false;
    }
    if (!user) {
      Alert.alert("Lỗi tài khoản", "Bạn cần đăng nhập để đặt hàng.");
      return false;
    }
    return true;
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) return;

    const orderData = {
      userId: user!.id,
      username: user!.username,
      customerName: buyer.name.trim(),
      phone: buyer.phone.trim(),
      address: buyer.address.trim(),
      date: new Date().toISOString(),
      total: totalPrice,
      status: "Đang xử lý" as Order["status"],
      paymentMethod,
      items: JSON.stringify(cartItems),
    };

    const result = await addOrder(orderData);
    if (result) {
      Alert.alert("🎉 Đặt hàng thành công!", `Cảm ơn bạn, ${buyer.name}!`);
      cartItems.forEach((item) => removeCartItem(item.productId));
      router.push("/");
    } else {
      Alert.alert("Lỗi", "Không thể lưu đơn hàng. Vui lòng thử lại.");
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#E91E63" style={{ flex: 1 }} />
    );

  if (cartItems.length === 0)
    return (
      <View style={styles.center}>
        <Text>Giỏ hàng trống</Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.homeButtonText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Thông tin người nhận</Text>
      {["name", "phone", "address"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={
            field === "name"
              ? "Họ và tên"
              : field === "phone"
              ? "Số điện thoại"
              : "Địa chỉ giao hàng"
          }
          value={(buyer as any)[field]}
          onChangeText={(text) => setBuyer({ ...buyer, [field]: text })}
          keyboardType={field === "phone" ? "numeric" : "default"}
        />
      ))}

      <Text style={[styles.title, { marginTop: 20 }]}>
        Phương thức thanh toán
      </Text>
      {["COD", "Ví điện tử", "Chuyển khoản"].map((method) => (
        <TouchableOpacity
          key={method}
          style={[
            styles.paymentOption,
            paymentMethod === method && styles.paymentSelected,
          ]}
          onPress={() => setPaymentMethod(method)}
        >
          <Text
            style={[
              styles.paymentText,
              paymentMethod === method && { color: "#fff" },
            ]}
          >
            {method}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.title, { marginTop: 20 }]}>Đơn hàng</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        style={{ maxHeight: "40%" }}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={getProductImageSource(item.img)}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text>{item.name}</Text>
              <Text>
                {item.price.toLocaleString("vi-VN")} đ x {item.quantity}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => handleQuantity(item.id, item.quantity - 1)}
              >
                <Text style={styles.qtyBtn}>-</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 8 }}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => handleQuantity(item.id, item.quantity + 1)}
              >
                <Text style={styles.qtyBtn}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Text style={styles.removeBtn}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.totalText}>
        Tổng: {totalPrice.toLocaleString("vi-VN")} đ
      </Text>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmOrder}
      >
        <Text style={styles.confirmText}>Xác nhận đơn hàng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
  },
  paymentOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    marginVertical: 6,
  },
  paymentSelected: { backgroundColor: "#E91E63", borderColor: "#E91E63" },
  paymentText: { color: "#000" },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 6,
    padding: 8,
    borderRadius: 8,
  },
  itemImage: { width: 60, height: 60, borderRadius: 6 },
  itemInfo: { marginLeft: 10, flex: 1 },
  qtyBtn: {
    fontSize: 18,
    paddingHorizontal: 6,
    color: "#E91E63",
    fontWeight: "bold",
  },
  removeBtn: { color: "#E91E63", marginLeft: 10 },
  totalText: { marginVertical: 10, fontSize: 18, fontWeight: "bold" },
  confirmButton: {
    backgroundColor: "#E91E63",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  confirmText: { color: "#fff", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  homeButton: {
    marginTop: 20,
    backgroundColor: "#E91E63",
    padding: 10,
    borderRadius: 8,
  },
  homeButtonText: { color: "#fff", fontWeight: "bold" },
});
