import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "@/context/auth";
import {
  updateUsername,
  updateUserPassword,
  updateUserAvatar,
  fetchOrdersByUserId,
  getUserPasswordById,
  Order,
} from "../../components/Lesson 13/database";
import { pickImage } from "../utils/imageMap";

export default function ProfileScreen() {
  const { user: authUser } = useAuth();
  const [username, setUsername] = useState(authUser?.username || "");
  const [avatar, setAvatar] = useState(authUser?.avatar || null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!authUser) return;
      const userOrders = await fetchOrdersByUserId(authUser.id);
      setOrders(userOrders);
    };
    loadOrders();
  }, [authUser]);

  const handlePickAvatar = async () => {
    const img = await pickImage();
    if (!img) return;

    const success = await updateUserAvatar(authUser!.id, img);
    if (success) {
      setAvatar(img);
      Alert.alert("✔️ Thành công", "Avatar đã được cập nhật!");
    } else {
      Alert.alert("❌ Lỗi", "Cập nhật avatar thất bại!");
    }
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert("Lỗi", "Tên không được để trống");
      return;
    }
    const success = await updateUsername(authUser!.id, username);
    if (success)
      Alert.alert("✔️ Thành công", "Tên người dùng đã được cập nhật!");
    else Alert.alert("❌ Lỗi", "Cập nhật thất bại!");
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ các trường");
      return;
    }

    const currentPass = await getUserPasswordById(authUser!.id);
    if (!currentPass) {
      Alert.alert("❌ Lỗi", "Không lấy được mật khẩu hiện tại");
      return;
    }

    if (currentPass !== oldPassword) {
      Alert.alert("Lỗi", "Mật khẩu cũ không đúng");
      return;
    }

    if (oldPassword === newPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không được trùng mật khẩu cũ");
      return;
    }

    const success = await updateUserPassword(authUser!.id, newPassword);
    if (success) {
      setOldPassword("");
      setNewPassword("");
      Alert.alert("✔️ Thành công", "Mật khẩu đã được cập nhật!");
    } else {
      Alert.alert("❌ Lỗi", "Cập nhật mật khẩu thất bại!");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>

      {/* Avatar */}
      <TouchableOpacity
        onPress={handlePickAvatar}
        style={styles.avatarContainer}
      >
        <Image
          source={
            avatar ? { uri: avatar } : require("../../assets/images/bag1.jpg")
          }
          style={styles.avatar}
        />
        <Text style={styles.editAvatar}>✏️ Đổi avatar</Text>
      </TouchableOpacity>

      {/* Username */}
      <Text style={styles.label}>Username</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <Text style={styles.editIcon}>✏️</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.btnPink,
          username.trim() === authUser?.username && { backgroundColor: "#ccc" },
        ]}
        onPress={handleUpdateUsername}
        disabled={username.trim() === authUser?.username}
      >
        <Text style={styles.btnText}>Cập nhật tên</Text>
      </TouchableOpacity>

      {/* Password */}
      <Text style={styles.label}>Đổi mật khẩu</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
          style={styles.input}
          placeholder="Mật khẩu cũ"
        />
        <Text style={styles.editIcon}>✏️</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
          placeholder="Mật khẩu mới"
        />
        <Text style={styles.editIcon}>✏️</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.btnPink,
          (!oldPassword || !newPassword) && { backgroundColor: "#ccc" },
        ]}
        onPress={handleUpdatePassword}
        disabled={!oldPassword || !newPassword}
      >
        <Text style={styles.btnText}>Cập nhật mật khẩu</Text>
      </TouchableOpacity>

      {/* Order History */}
      <Text style={styles.title2}>Lịch sử đơn hàng</Text>
      {orders.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          Chưa có đơn hàng nào
        </Text>
      ) : (
        orders.map((o) => (
          <View key={o.id} style={styles.orderCard}>
            <Text>
              <Text style={styles.bold}>Mã đơn:</Text> {o.id}
            </Text>
            <Text>
              <Text style={styles.bold}>Tổng:</Text> {o.total.toLocaleString()}{" "}
              đ
            </Text>
            <Text>
              <Text style={styles.bold}>Trạng thái:</Text> {o.status}
            </Text>
            <Text>
              <Text style={styles.bold}>Ngày:</Text>{" "}
              {new Date(o.date).toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  title2: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 10,
    alignItems: "center",
  },
  avatar: { width: 110, height: 110, borderRadius: 60, marginBottom: 6 },
  editAvatar: { textAlign: "center", color: "#E91E63", fontWeight: "bold" },
  label: { fontWeight: "bold", marginTop: 10 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  editIcon: { marginLeft: 6, color: "#E91E63", fontWeight: "bold" },
  btnPink: {
    backgroundColor: "#E91E63",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  orderCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    elevation: 1,
  },
  bold: { fontWeight: "bold" },
});
