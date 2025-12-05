import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { fetchOrders, Order } from "../../components/Lesson 13/database";

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const allOrders = await fetchOrders();
      // Lọc theo user hiện tại nếu muốn
      setOrders(allOrders);
    };
    loadOrders();
  }, []);

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Text style={styles.text}>
        <Text style={styles.bold}>ID:</Text> {item.id}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Khách hàng:</Text> {item.customerName}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Tổng:</Text> {item.total.toLocaleString()} đ
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Trạng thái:</Text> {item.status}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Ngày:</Text>{" "}
        {new Date(item.date).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={styles.empty}>Chưa có đơn hàng nào</Text>
      }
      contentContainerStyle={{ padding: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  text: { marginBottom: 4 },
  bold: { fontWeight: "bold" },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontWeight: "bold",
    color: "#555",
  },
});
