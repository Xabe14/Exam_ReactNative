import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  addToCart,
  CartItem,
  findProductById,
  Product,
} from "../../components/Lesson 13/database";
import { useAuth } from "@/context/auth";
// import { useCart } from "../../context/CartContext"; // CartContext phải được wrap ở root

// --- Map ảnh ---
const images: Record<string, any> = {
  bag1: require("../../assets/images/bag1.jpg"),
  hoalen1: require("../../assets/images/hoalen1.jpg"),
  mockhoa1: require("../../assets/images/mockhoa1.jpg"),
  trangsuc: require("../../assets/images/trangsuc.jpg"),
  // default: require("../../assets/images/bag1.jpg"),
};

const getImage = (name: string) => images[name] || images.default;

const ProductDetailScreen = () => {
  const { user } = useAuth(); // lấy user hiện tại

  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // const { addToCart } = useCart(); // phải active useCart

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (id) {
          const p = await findProductById(Number(id));
          setProduct(p);
        }
      } catch (error) {
        console.error("❌ Lỗi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#E91E63"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );

  if (!product)
    return (
      <View style={styles.center}>
        <Text>Sản phẩm không tồn tại</Text>
      </View>
    );

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert(
        "⚠️ Bạn cần đăng nhập",
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng"
      );
      return;
    }

    if (!product) return;

    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1,
    };

    try {
      await addToCart(cartItem);
      Alert.alert("✅ Thành công", "Sản phẩm đã được thêm vào giỏ hàng", [
        { text: "Tiếp tục mua sắm", style: "cancel" },
        { text: "Xem giỏ hàng", onPress: () => router.push("/user/cart") },
      ]);
    } catch (error) {
      console.error("❌ Lỗi thêm vào giỏ hàng:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={getImage(product.img)} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>
        {product.price.toLocaleString("vi-VN")} đ
      </Text>

      <TouchableOpacity style={styles.buyButton} onPress={handleAddToCart}>
        <Text style={styles.buyButtonText}>🛒 Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 16 },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  price: {
    fontSize: 18,
    color: "#E91E63",
    fontWeight: "bold",
    marginBottom: 16,
  },
  buyButton: {
    backgroundColor: "#E91E63",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buyButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default ProductDetailScreen;
