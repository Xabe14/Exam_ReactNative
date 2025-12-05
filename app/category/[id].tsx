import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// SỬA: Import tất cả từ file HomeScreen.tsx
import {
  Product,
  Category,
  fetchProductsByCategory,
  fetchCategories,
} from "../../components/Lesson 13/database";
import { ProductCard } from "../../components/Lesson 13/HomeScreen";

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const categoryId = id ? parseInt(id as string) : null;

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("Đang tải...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const loadCategoryData = async () => {
      setIsLoading(true);
      try {
        // 1. Tải tên danh mục
        const categoryDetail: Category = await fetchCategories().then((cats) =>
          cats.find((c) => c.id === categoryId)!
        );
        setCategoryName(categoryDetail.name);

        // 2. Tải sản phẩm theo danh mục
        const fetchedProducts: Product[] = await fetchProductsByCategory(
          categoryId
        );
        setProducts(fetchedProducts);
      } catch (error) {
        console.error(`Lỗi tải dữ liệu cho danh mục ID ${categoryId}:`, error);
        setCategoryName("Không tìm thấy danh mục");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryId]);

  // Xử lý click sản phẩm để chuyển sang trang chi tiết
  const handleProductPress = (item: Product) => {
    router.push({
      pathname: "/product/[id]",
      params: { id: item.id.toString() },
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    // Component ProductCard đã được import
    <ProductCard item={item} onPress={() => handleProductPress(item)} />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        Sản phẩm của Danh mục: **{categoryName}**
      </Text>
      <Text style={styles.countText}>
        Tìm thấy **{products.length}** sản phẩm
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            Không có sản phẩm nào trong danh mục này.
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingTop: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  countText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#999",
  },
});
