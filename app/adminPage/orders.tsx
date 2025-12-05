// /app/admin/OrdersScreen.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { fetchOrders, updateOrderStatus, Order } from "../../components/Lesson 13/database";

const statuses = ["Đang xử lý", "Đang giao", "Đã giao", "Hoàn thành"];

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"Tất cả" | string>("Tất cả");

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

const normalizeText = (text?: string) =>
    (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Lọc và tìm kiếm
  const filteredOrders = useMemo(() => {
    const search = normalizeText(searchTerm);
    return orders.filter((o) => {
      const statusMatch =
        filterStatus === "Tất cả" || o.status === filterStatus;
      const customerName = normalizeText(o.username);

      const searchMatch =
        customerName.includes(search) || o.id.toString().includes(search);

      return statusMatch && searchMatch;
    });
  }, [orders, searchTerm, filterStatus]);

  const handleStatusChange = (order: Order) => {
    let nextStatus: string | null = null;

    if (order.paymentMethod === "COD") {
      const currentIndex = statuses.indexOf(order.status);
      if (currentIndex < statuses.length - 1) nextStatus = statuses[currentIndex + 1];
    } else {
      if (order.status === "Đang xử lý") nextStatus = "Đang giao";
      else {
        const currentIndex = statuses.indexOf(order.status);
        if (currentIndex < statuses.length - 1) nextStatus = statuses[currentIndex + 1];
      }
    }

    if (!nextStatus) {
      Alert.alert("Thông báo", "Đơn hàng đã ở trạng thái cuối, không thể cập nhật thêm.");
      return;
    }

    Alert.alert(
      "Cập nhật trạng thái",
      `Đổi trạng thái đơn #${order.id} sang "${nextStatus}"?`,
      [
        { text: "Hủy" },
        {
          text: "Xác nhận",
          onPress: async () => {
            const success = await updateOrderStatus(order.id, nextStatus!);
            if (success) loadOrders();
            else Alert.alert("Lỗi", "Cập nhật thất bại!");
          },
        },
      ]
    );
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <Text>
        <Text style={styles.bold}>#ID:</Text> {item.id}
      </Text>
      <Text>
        <Text style={styles.bold}>Khách hàng:</Text> {item.username}
      </Text>
      <Text>
        <Text style={styles.bold}>Tổng:</Text> {item.total.toLocaleString()} đ
      </Text>
      <Text>
        <Text style={styles.bold}>Trạng thái:</Text> {item.status}
      </Text>
      <Text>
        <Text style={styles.bold}>Thanh toán:</Text> {item.paymentMethod}
      </Text>
      <Text>
        <Text style={styles.bold}>Ngày:</Text> {new Date(item.date).toLocaleString()}
      </Text>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => handleStatusChange(item)}
      >
        <Text style={styles.updateText}>Cập nhật trạng thái</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading)
    return <ActivityIndicator size="large" color="#E91E63" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f5f5f5" }}>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm theo tên hoặc ID..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <View style={styles.statusFilter}>
        {["Tất cả", ...statuses].map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.statusBtn,
              filterStatus === s && { backgroundColor: "#26a69a" },
            ]}
            onPress={() => setFilterStatus(s as any)}
          >
            <Text style={{ color: filterStatus === s ? "#fff" : "#000" }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrder}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            Không tìm thấy đơn hàng nào
          </Text>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  bold: { fontWeight: "bold" },
  updateButton: {
    marginTop: 8,
    backgroundColor: "#26a69a",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  updateText: { color: "#fff", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  statusFilter: { flexDirection: "row", marginBottom: 12, flexWrap: "wrap" },
  statusBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
});
