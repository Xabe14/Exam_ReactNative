// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   StyleSheet,
//   Alert,
// } from "react-native"; 
// import RNPickerSelect from "react-native-picker-select";
// import * as ImagePicker from "react-native-image-picker";
// import {
//   initDatabase,
//   fetchCategories,
//   fetchProducts,
//   addProduct,
//   updateProduct,
//   deleteProduct,
//   searchProductsByNameOrCategory,
//   Product,
//   Category,
// } from "./database";

// // ----- Local image mapping -----
// const localImages: Record<string, any> = {
//   "sweater.jpg": require("../../assets/images/sweater.jpg"),
//   "hinh1.jpg": require("../../assets/images/blue-t-shirt.jpg"),
//   "hinh2.jpg": require("../../assets/images/t-shirt.jpg"),
// };

// const Sanpham3Sqlite = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [categoryId, setCategoryId] = useState<number>(1);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [imageUri, setImageUri] = useState<string | null>(null);

//   // Initialize DB on mount
//   useEffect(() => {
//     initDatabase(loadData);
//   }, []);

//   const loadData = () => {
//     setCategories(fetchCategories());
//     setProducts(fetchProducts().reverse());
//     // Đặt categoryId mặc định sau khi load categories
//     if (fetchCategories().length > 0) {
//       setCategoryId(fetchCategories()[0].id);
//     }
//   };

//   const getImageSource = (product: Product) => {
//     if (product.img.startsWith("file://")) {
//       return { uri: product.img };
//     }
//     const localImage = localImages[product.img];
//     if (localImage) {
//       return localImage;
//     }
//     // Log để gỡ lỗi ảnh tĩnh
//     if (product.img && product.img !== "sweater.jpg") {
//         console.log(`[Lỗi Hình Ảnh] Không tìm thấy ảnh local cho key: ${product.img}.`);
//     }
//     return require("../../assets/images/sweater.jpg");
//   };

//   // Pick image from device (Giữ nguyên logic đúng)
//   const handlePickImage = async () => {
//     // Có vẻ như lỗi ImagePicker vẫn xảy ra trong quá trình Hot Reload/Fast Refresh. 
//     // Thường việc này do môi trường cài đặt (như Expo Go vs. Bare Workflow) hoặc cache.
//     // Logic code của hàm này là đúng.
//     try {
//         const result = await ImagePicker.launchImageLibrary({
//           mediaType: "photo",
//           selectionLimit: 1,
//           quality: 1,
//         });
//         if (result.didCancel) return;
//         if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
//           setImageUri(result.assets[0].uri);
//         }
//     } catch (e) {
//         console.error("Image Picker Error:", e);
//         Alert.alert("Lỗi Ảnh", "Không thể mở thư viện ảnh. Vui lòng kiểm tra quyền truy cập.");
//     }
//   };

//   // Thêm/Cập nhật, Xóa, Sửa, Tìm kiếm (Giữ nguyên logic)
//   const handleAddOrUpdate = () => {
//     if (!name || !price) {
//       Alert.alert("Lỗi", "Vui lòng nhập tên và giá sản phẩm."); 
//       return;
//     }
//     const parsedPrice = parseFloat(price);
//     if (isNaN(parsedPrice)) {
//         Alert.alert("Lỗi", "Giá sản phẩm phải là một số.");
//         return;
//     }

//     const productData: Omit<Product, "id"> = {
//       name,
//       price: parsedPrice,
//       img: imageUri ?? "hinh1.jpg",
//       categoryId,
//     };

//     if (editingId !== null) {
//       updateProduct({ id: editingId, ...productData });
//       setEditingId(null);
//     } else {
//       addProduct(productData);
//     }

//     setName("");
//     setPrice("");
//     setCategoryId(categories.length > 0 ? categories[0].id : 1);
//     setImageUri(null);
//     loadData();
//   };
  
//   const handleEdit = (p: Product) => {
//     setName(p.name);
//     setPrice(p.price.toString());
//     setCategoryId(p.categoryId);
//     setImageUri(p.img.startsWith("file://") ? p.img : null);
//     setEditingId(p.id);
//   };

//   const handleDelete = (id: number) => {
//     Alert.alert(
//       "Xác nhận xóa",
//       "Bạn có chắc chắn muốn xóa sản phẩm này không?",
//       [
//         { text: "Hủy", style: "cancel" },
//         {
//           text: "Xóa",
//           style: "destructive",
//           onPress: () => {
//             deleteProduct(id);
//             loadData();
//           },
//         },
//       ]
//     );
//   };

//   const handleSearch = (keyword: string) => {
//     if (!keyword.trim()) return loadData();
//     setProducts(searchProductsByNameOrCategory(keyword).reverse());
//   };
  
//   const renderItem = ({ item }: { item: Product }) => (
//     <View style={styles.card}>
//       <Image source={getImageSource(item)} style={styles.image} />
//       <View style={styles.cardInfo}>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
//         <View style={styles.iconRow}>
//           <TouchableOpacity onPress={() => handleEdit(item)}>
//             <Text style={styles.icon}>✏️</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => handleDelete(item.id)}>
//             <Text style={styles.icon}>❌</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   // Component chứa các Input và Button (Thay thế cho ScrollView)
//   const ListHeader = () => (
//     <View style={styles.headerContainer}>
//         <Text style={styles.title}>Quản lý sản phẩm</Text>

//         <TextInput
//             style={styles.input}
//             placeholder="Tên sản phẩm"
//             value={name}
//             onChangeText={setName}
//         />
//         <TextInput
//             style={styles.input}
//             placeholder="Giá sản phẩm"
//             keyboardType="numeric"
//             value={price}
//             onChangeText={setPrice}
//         />

//         <RNPickerSelect
//             style={{ ...styles.input, inputIOS: { height: 40, paddingHorizontal: 10, borderWidth: 1, borderColor: "#aaa", borderRadius: 6, marginBottom: 10 } }}
//             onValueChange={(v) => { if (v !== null) setCategoryId(v as number) }}
//             items={categories.map((c) => ({ label: c.name, value: c.id }))}
//             value={categoryId}
//             placeholder={{ label: "Chọn danh mục...", value: null }}
//         />

//         <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
//             <Text style={styles.buttonText}>
//                 {imageUri ? "Chọn lại hình ảnh" : "Chọn hình ảnh"}
//             </Text>
//         </TouchableOpacity>

//         {imageUri && (
//             <Image source={{ uri: imageUri }} style={styles.selectedImage} />
//         )}

//         <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
//             <Text style={styles.buttonText}>
//                 {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
//             </Text>
//         </TouchableOpacity>

//         <View style={styles.separator} />

//         <TextInput
//             style={styles.input}
//             placeholder="Tìm kiếm theo tên hoặc loại..."
//             onChangeText={handleSearch}
//         />
//         <Text style={styles.listHeaderTitle}>Danh sách Sản phẩm</Text>
//     </View>
//   );

//   return (
//     <FlatList
//       data={products}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={renderItem}
//       // Đặt các thành phần nhập liệu làm Header của FlatList
//       ListHeaderComponent={ListHeader} 
//       contentContainerStyle={styles.container}
//       ListEmptyComponent={
//         <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
//       }
//       // Dùng ListFooterComponent để tạo khoảng trống nếu cần
//       ListFooterComponent={<View style={{ height: 50 }} />} 
//       scrollEnabled={false}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 16 },
//   headerContainer: {
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   listHeaderTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   emptyText: { textAlign: "center", marginTop: 20 },
//   input: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: "#aaa",
//     borderRadius: 6,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   button: {
//     backgroundColor: "#28a",
//     padding: 10,
//     borderRadius: 6,
//     alignItems: "center",
//     marginBottom: 10, // Giảm khoảng cách
//   },
//   buttonText: { color: "#fff", fontWeight: "bold" },
//   card: {
//     flexDirection: "row",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     marginBottom: 12,
//     overflow: "hidden",
//   },
//   image: { width: 80, height: 80 },
//   selectedImage: { width: 100, height: 100, marginVertical: 10, alignSelf: 'center' },
//   cardInfo: { flex: 1, padding: 10, justifyContent: "center" },
//   productName: { fontWeight: "bold", fontSize: 16 },
//   productPrice: { color: "#000" },
//   iconRow: { flexDirection: "row", marginTop: 10 },
//   icon: { fontSize: 20, marginRight: 10 },
//   imagePicker: {
//     backgroundColor: "#918",
//     padding: 10,
//     borderRadius: 6,
//     alignItems: "center",
//     marginBottom: 10, 
//   },
//   separator: {
//     height: 1, 
//     backgroundColor: '#ccc', 
//     marginVertical: 10 
//   }
// });

// export default Sanpham3Sqlite;