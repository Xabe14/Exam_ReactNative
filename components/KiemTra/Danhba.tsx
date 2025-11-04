import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
type Contact = {
  id: string;
  name: string;
  phone: string;
};
const initialContacts: Contact[] = [
  { id: "1", name: "Nguyen Van A", phone: "0123456789" },
  { id: "2", name: "Tran Thi B", phone: "0987654321" },
  { id: "3", name: "Le Van C", phone: "0112233445" },
  { id: "4", name: "Pham Thi D", phone: "0223344556" },
];
const Danhba = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const handleAddOrUpdate = () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên!");
      nameRef.current?.focus();
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại!");
      phoneRef.current?.focus();
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      Alert.alert("Lỗi", "Tên chỉ được chứa chữ cái và khoảng trắng!");
      nameRef.current?.focus();
      return;
    }
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ (phải là 10–11 chữ số)!");
      phoneRef.current?.focus();
      return;
    }

    if (editingId) {
      const updatedList = contacts.map((item) =>
        item.id === editingId ? { ...item, name, phone } : item
      );
      setContacts(updatedList);
      setEditingId(null);
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        name,
        phone,
      };
      setContacts([...contacts, newContact]);
    }

    setName("");
    setPhone("");
  };

  const handleDelete = (id: string) => {
    const filtered = contacts.filter((item) => item.id !== id);
    setContacts(filtered);
  };

  const handleEdit = (contact: Contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setEditingId(contact.id);
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <View style={styles.result}>
      <Text>💬</Text>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: 60,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text>🖊</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DANH BẠ</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Tên"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Số điện thoại"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="number-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {editingId ? "LƯU" : "THÊM"}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Tìm kiếm..."
          style={[styles.input, { backgroundColor: "#fff0f5" }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={contacts.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.phone.includes(search)
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#c71585",
    fontWeight: "bold",
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderColor: "#c71585",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#ffe4e1",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#c71585",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  result: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff0f5",
    borderRadius: 20,
    marginBottom: 10,
  },
  name: {
    color: "#c71585",
    fontWeight: "bold",
  },
  phone: {
    color: "gray",
  },
});

export default Danhba;
