import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addOrUpdateProduct,
  fetchCategories,
} from "../../../components/Lesson 13/database";
import { pickImage } from "../../utils/imageMap";

export default function AddProductByCategory() {
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const catIdNum = Number(categoryId);
      const cats = await fetchCategories();
      const found = cats.find((c) => c.id === catIdNum);
      setCategoryName(found?.name ?? "Không rõ");
    };
    load();
  }, []);

  const handlePickImage = async () => {
    const img = await pickImage();
    if (img) setImageBase64(img);
  };

  const handleAdd = async () => {
    if (!name || !price) {
      Alert.alert("Vui lòng nhập đầy đủ!");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      categoryId: Number(categoryId),
      img: imageBase64 ?? "bag1.jpg",
    };

    const ok = await addOrUpdateProduct(newProduct);
    if (ok) {
      Alert.alert("Thêm sản phẩm thành công!");
      router.back();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thêm sản phẩm cho: {categoryName}</Text>

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

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#00796b" }]}
        onPress={handlePickImage}
      >
        <Text style={styles.buttonText}>Chọn hình</Text>
      </TouchableOpacity>

      {imageBase64 ? (
        <Image source={{ uri: imageBase64 }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: "#00796b" }}>Chưa có hình</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#e0f7fa" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    backgroundColor: "#b2ebf2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#26a69a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  image: { width: 150, height: 150, borderRadius: 10, marginTop: 10 },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: "#b2dfdb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});
