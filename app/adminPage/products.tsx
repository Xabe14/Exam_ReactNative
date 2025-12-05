import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import {
  Category,
  Product,
  fetchCategories,
  fetchProducts,
  addOrUpdateProduct,
  deleteProduct,
} from "../../components/Lesson 13/database";
import { getProductImageSource, pickImage } from "../utils/imageMap";
import emitter from "../utils/eventEmitter";

export default function AdminProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Load categories + products từ DB
  useEffect(() => {
    const loadData = async () => {
      const cat = await fetchCategories();
      const prod = await fetchProducts();
      setCategories(cat);
      setProducts(prod);
      if (cat.length > 0) setCategoryId(cat[0].id);
    };
    loadData();
  }, []);

  // const getImageSource = (img: string) => {
  //   if (img.startsWith("data:image")) return { uri: img }; // Base64
  //   return getImage(img); // local
  // };

  // Thêm / sửa sản phẩm
  const handleAddOrUpdate = async () => {
    if (!name || !price || categoryId === null) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      Alert.alert("Giá sản phẩm phải là số!");
      return;
    }

    // Nếu đang sửa mà không chọn hình mới, giữ hình cũ
    const existingProduct = editingId
      ? products.find((p) => p.id === editingId)
      : null;

    const product: Product = {
      id: editingId ?? Date.now(),
      name,
      price: parsedPrice,
      categoryId,
      img: imageBase64 ?? existingProduct?.img ?? "bag1.jpg",
    };

    const success = await addOrUpdateProduct(product);
    emitter.emit("productUpdated");

    if (success) {
      const prod = await fetchProducts();
      setProducts(prod);
      Alert.alert(editingId ? "Cập nhật thành công" : "Thêm thành công");

      // reset form
      setName("");
      setPrice("");
      setCategoryId(categories.length > 0 ? categories[0].id : null);
      setEditingId(null);
      setImageBase64(null);
    }
  };

  // Chọn sửa sản phẩm
  const handleEdit = (p: Product) => {
    setName(p.name);
    setPrice(p.price.toString());
    setCategoryId(p.categoryId);
    setEditingId(p.id);
    setImageBase64(p.img.startsWith("data:image") ? p.img : null);
  };

  // Xóa sản phẩm
  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa sản phẩm này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const success = await deleteProduct(id);
          emitter.emit("productUpdated");
          if (success) {
            const prod = await fetchProducts();
            setProducts(prod);
          }
        },
      },
    ]);
  };

  // Chọn ảnh
  const handlePickImage = async () => {
    const img = await pickImage();
    if (img) setImageBase64(img);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemRow}>
      <Image
        source={getProductImageSource(item.img)}
        style={{ width: 120, height: 120 }}
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
      <Text style={styles.productCategory}>
        {categories.find((c) => c.id === item.categoryId)?.name ?? "Không có"}
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm</Text>

      {/* Form nhập sản phẩm */}
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <RNPickerSelect
        style={{ inputIOS: styles.input, inputAndroid: styles.input }}
        onValueChange={(v) => setCategoryId(v)}
        items={categories.map((c) => ({ label: c.name, value: c.id }))}
        value={categoryId}
        placeholder={{ label: "Chọn danh mục...", value: null }}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: "#26a69a" }]}
        onPress={handlePickImage}
      >
        <Text style={styles.buttonText}>Chọn hình</Text>
      </TouchableOpacity>

      {/* Preview ảnh */}
      <View style={{ alignItems: "center", marginBottom: 10 }}>
        {imageBase64 ? (
          <Image
            source={{ uri: imageBase64 }}
            style={{ width: 120, height: 120, borderRadius: 8 }}
          />
        ) : (
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 8,
              backgroundColor: "#b2ebf2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#00796b" }}>Chưa có hình</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>
          {editingId ? "Cập nhật" : "Thêm sản phẩm"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 10,
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
        }
      />
    </ScrollView>
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
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#80deea",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#26a69a",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  itemRow: {
    flex: 1,
    margin: 5,
    backgroundColor: "#b2dfdb",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
    resizeMode: "cover",
  },
  productName: { fontSize: 16, fontWeight: "600" },
  productPrice: { color: "#00796b", marginVertical: 2 },
  productCategory: { fontSize: 14, color: "#004d40", marginBottom: 6 },
  buttons: { flexDirection: "row" },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  editButton: { backgroundColor: "#26a69a" },
  deleteButton: { backgroundColor: "#ef5350" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#00796b",
    fontWeight: "bold",
  },
});
