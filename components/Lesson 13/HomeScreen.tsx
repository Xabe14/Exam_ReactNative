import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "./Header";
import PriceFilter from "./PriceFilter";
import { getProductImageSource } from "@/app/utils/imageMap";

// --- Import từ database.ts ---
import {
  fetchProducts,
  fetchCategories,
  Product,
  Category,
  findProductById,
} from "./database";
import { useAuth } from "@/context/auth";
import emitter from "@/app/utils/eventEmitter";

// --- file: imageMap.ts ---

// --- COMPONENT TÁI SỬ DỤNG: ProductCard ---
// const getImageSource = (img: string) => {
//   if (img.startsWith("data:image")) return { uri: img }; // Base64
//   return getImage(img); // local
// };
export const ProductCard = ({
  item,
  onPress,
}: {
  item: Product;
  onPress: () => void;
}) => (
  <View style={styles.productCard}>
    <TouchableOpacity onPress={onPress}>
      <Image
        source={getProductImageSource(item.img)}
        style={{ width: 120, height: 120 }}
      />
    </TouchableOpacity>

    <Text style={styles.productName}>{item.name}</Text>
    <Text style={styles.productPrice}>
      {item.price.toLocaleString("vi-VN")} đ
    </Text>

    <TouchableOpacity style={styles.buyButton}>
      <Text style={styles.buyButtonText}>Mua Ngay</Text>
    </TouchableOpacity>
  </View>
);

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Tự động focus khi mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const listener = async () => {
      try {
        const updatedProducts = await fetchProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error("❌ Lỗi fetch products:", error);
      }
    };

    emitter.on("productUpdated", listener); // ✅ use emitter

    // Load initial data
    const loadData = async () => {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu từ DB:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      emitter.removeListener("productUpdated", listener);
    };
  }, []);

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredProducts = useMemo(() => {
    if (isLoading) return [];

    const keywords = searchTerm
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(normalizeText)
      .filter(Boolean);

    return products.filter((product) => {
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;

      const categoryName =
        categories.find((c) => c.id === product.categoryId)?.name ?? "";

      const nameNormalized = normalizeText(product.name);
      const categoryNormalized = normalizeText(categoryName);

      const searchMatch = keywords.every(
        (kw) => nameNormalized.includes(kw) || categoryNormalized.includes(kw)
      );

      return priceMatch && searchMatch;
    });
  }, [products, categories, searchTerm, minPrice, maxPrice, isLoading]);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleCategorySelect = (id: number) => {
    setDropdownVisible(false);
    router.push({
      pathname: "/category/[id]",
      params: { id: id.toString() },
    });
  };

  const handleProductPress = (item: Product) => {
    router.push({
      pathname: "/product/[id]",
      params: { id: item.id.toString() },
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard item={item} onPress={() => handleProductPress(item)} />
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <Image
              source={require("../../assets/images/banner.png")}
              style={styles.banner}
            />
            <View style={styles.menuContainerWrapper}>
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => router.push("/")}
                >
                  <Text style={[styles.menuText]}>🏠 Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={toggleDropdown}
                >
                  <Text style={styles.menuText}>Danh mục sản phẩm ▼</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    if (!user) {
                      Alert.alert(
                        "⚠️ Bạn cần đăng nhập",
                        "Vui lòng đăng nhập để xem thông tin cá nhân",
                        [{ text: "OK", onPress: () => router.push("/login") }]
                      );
                      return;
                    }
                    router.push("/user/profile");
                  }}
                >
                  <Text style={styles.menuText}>Trang cá nhân</Text>
                </TouchableOpacity>
              </View>
              {isDropdownVisible && (
                <View style={styles.dropdown}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.dropdownItem}
                      onPress={() => handleCategorySelect(cat.id)}
                    >
                      <Text style={styles.dropdownItemText}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.filterArea}>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#666"
                  style={styles.searchIcon}
                />
                <TextInput
                  ref={inputRef}
                  style={styles.searchInput}
                  placeholder="Tìm kiếm theo tên hoặc danh mục..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholderTextColor="#999"
                />
              </View>
              <PriceFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
              />
            </View>
            <Text style={styles.welcomeText}>
              {isLoading
                ? "Đang tải sản phẩm..."
                : `${filteredProducts.length} sản phẩm phù hợp đang hiển thị`}
            </Text>
          </View>
        )}
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={() => {
          if (isLoading)
            return <ActivityIndicator size="large" color="#E91E63" />;
          return (
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào.</Text>
          );
        }}
      />
    </View>
  );
};

// ----------------------------------------------------------------
// --- STYLES ---
// ----------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  banner: { width: "100%", height: 150, resizeMode: "cover" },
  menuContainerWrapper: { zIndex: 10, position: "relative" },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#eee",
    zIndex: 1,
  },
  menuItem: { paddingVertical: 6 },
  menuText: { fontSize: 16, fontWeight: "bold" },
  dropdown: {
    position: "absolute",
    top: 45,
    right: 120,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 150,
    zIndex: 20,
    shadowOpacity: 0.2,
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: { fontSize: 14, color: "#333" },
  filterArea: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, fontSize: 16 },
  welcomeText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 15,
    fontWeight: "500",
  },
  listContainer: { paddingHorizontal: 10, paddingBottom: 20 },
  productCard: {
    flex: 1,
    margin: 6,
    backgroundColor: "#fff",
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowOpacity: 0.15,
    elevation: 4,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#E91E63",
    marginVertical: 6,
    fontWeight: "bold",
  },
  buyButton: {
    backgroundColor: "#E91E63",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginTop: 4,
  },
  buyButtonText: { color: "white", fontWeight: "bold", fontSize: 14 },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#999",
  },
});

export default HomeScreen;
