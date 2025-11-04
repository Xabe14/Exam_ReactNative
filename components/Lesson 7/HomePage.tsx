import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageSourcePropType,
} from "react-native";

type ProductCardProps = {
  name: string;
  price: number;
  image: ImageSourcePropType;
};

const ProductCard = ({ name, price, image }: ProductCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>{price.toLocaleString()}đ</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Mua ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomePage = () => {
  const products = [
    {
      id: 1,
      name: "Áo thun nam",
      price: 150000,
      image: require("../../assets/images/blue-t-shirt.jpg"),
    },
    {
      id: 2,
      name: "Áo sơ mi nữ",
      price: 250000,
      image: require("../../assets/images/t-shirt.jpg"),
    },
    {
      id: 3,
      name: "Sweater",
      price: 350000,
      image: require("../../assets/images/sweater.jpg"),
    },
    {
      id: 4,
      name: "Áo thun nữ",
      price: 300000,
      image: require("../../assets/images/t-shirt2.jpg"),
    },
    {
      id: 5,
      name: "Áo khoác",
      price: 350000,
      image: require("../../assets/images/sweater.jpg"),
    },
    {
      id: 6,
      name: "Áo sơ mi nữ",
      price: 250000,
      image: require("../../assets/images/t-shirt.jpg"),
    },
    {
      id: 7,
      name: "Áo thun nam",
      price: 150000,
      image: require("../../assets/images/blue-t-shirt.jpg"),
    },
    {
      id: 8,
      name: "Áo thun nữ",
      price: 300000,
      image: require("../../assets/images/t-shirt2.jpg"),
    },
    {
      id: 9,
      name: "Sweater",
      price: 350000,
      image: require("../../assets/images/sweater.jpg"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          🛒 Chào mừng bạn đến với Shop React Native!
        </Text>
      </View>
      <Text style={styles.header}>Danh sách sản phẩm</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard name={item.name} price={item.price} image={item.image} />
        )}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 8 }}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>🎉 Hết danh sách 🎉</Text>
          </View>
        }
      />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  banner: {
    backgroundColor: "#4caf50",
    padding: 15,
    alignItems: "center",
  },
  bannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  card: {
    width: "32%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  price: {
    fontSize: 13,
    color: "#e91e63",
    marginVertical: 4,
  },
  button: {
    backgroundColor: "#ff6f00",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  footer: {
    backgroundColor: "#fdd835",
    padding: 12,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
