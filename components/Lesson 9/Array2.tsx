import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,Alert
} from "react-native";
import React, { useState } from "react";

interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
}

const Students: Student[] = [
  { id: 1, name: "Nguyễn Văn A", age: 20, grade: 7.5 },
  { id: 2, name: "Trần Thị B", age: 20, grade: 8.7 },
  { id: 3, name: "Lê Văn C", age: 22, grade: 9.1 },
  { id: 4, name: "Phạm Thị D", age: 18, grade: 6.9 },
  { id: 5, name: "Hoàng Văn E", age: 21, grade: 8.0 },
];

const ArrayPractice = () => {
  const [students, setStudents] = useState<Student[]>(Students);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");

  const [editingID, setEditingId] = useState<number | null>(null);
 const [searchText, setSearchText] = useState("");
const handleAddOrUpdate = () => {
    if (!name || !age || !grade) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (editingID) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingID
            ? { ...s, name, age: Number(age), grade: Number(grade) }
            : s
        )
      );
      setEditingId(null);
    } else {
      const newStudent: Student = {
        id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
        name,
        age: Number(age),
        grade: Number(grade),
      };
      setStudents((prev) => [...prev, newStudent]);
    }

    setName("");
    setAge("");
    setGrade("");
  };
const handleEdit = (id: number) => {
  setEditingId(id);
  setStudents((prev) => {
    const studentToEdit = prev.find((s) => s.id === id);
    if (studentToEdit) {
      setName(studentToEdit.name);
      setAge(studentToEdit.age.toString());
      setGrade(studentToEdit.grade.toString());
    }
    return prev;
  });
};
 const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa học sinh này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: () => {
          setStudents((prev) => prev.filter((s) => s.id !== id));
        },
      },
    ]);
  };
const handleSort=()=>{
    const sortedStudents = [...students].sort((a, b) => b.grade - a.grade);
    setStudents(sortedStudents);
}
const handleFilterHighGrades = () => {
    const filteredStudents = Students.filter((s) => s.grade >= 8.0);
    setStudents(filteredStudents);
  };
const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredStudents = Students.filter((s) =>
      s.name.toLowerCase().includes(text.toLowerCase())
    );
    setStudents(filteredStudents);
  };
  const renderItem = ({ item, index }: { item: Student; index: number }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 0.5, textAlign: "center" }]}>
        {index + 1}
      </Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.age}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.grade.toFixed(1)}</Text>

      <View
        style={[
          styles.cell,
          { flex: 1.5, flexDirection: "row", justifyContent: "space-around" },
        ]}
      >
        <TouchableOpacity onPress={() => handleEdit(item.id)}>
          <Text>📝</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Quản lý danh sách Học Sinh </Text>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm học sinh"
        value={searchText}
        onChangeText={handleSearch}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên học sinh"
        value={name}
        onChangeText={setName}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Nhập tuổi học sinh"
        value={age}
        onChangeText={setAge}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Nhập điểm học sinh"
        value={grade}
        onChangeText={setGrade}
      ></TextInput>
      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.textbutton}>{editingID ? "Cập nhật học sinh" : "Thêm học sinh"}</Text>
      </TouchableOpacity>
     <View style={styles.filterRow}>
        <TouchableOpacity style={styles.smallButton} onPress={handleSort}>
          <Text style={styles.textbutton}>Sắp xếp điểm ↓</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={handleFilterHighGrades}
        >
          <Text style={styles.textbutton}>Lọc điểm hơn 8</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, styles.headerRow]}>
        <Text
          style={[
            styles.cell,
            { flex: 0.5, fontWeight: "bold", textAlign: "center" },
          ]}
        >
          STT
        </Text>
        <Text style={[styles.cell, { flex: 2, fontWeight: "bold" }]}>Tên</Text>
        <Text style={[styles.cell, { flex: 1, fontWeight: "bold" }]}>Tuổi</Text>
        <Text style={[styles.cell, { flex: 1, fontWeight: "bold" }]}>Điểm</Text>
        <Text style={[styles.cell, { flex: 1.5, fontWeight: "bold" }]}>
          Chức năng
        </Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        nestedScrollEnabled={false}
      />

    </ScrollView>
  );
};

export default ArrayPractice;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    fontFamily: "Roboto",
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#1831c0ff",
    marginBottom: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: "#5553c4ff",
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5e44b5ff",
    padding: 15,
    textAlign: "center",
    borderRadius: 5,
  },
  textbutton: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  smallButton: {
    backgroundColor: "#8a74e0",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
  headerRow: {
    backgroundColor: "#eee",
    paddingVertical: 10,
  },
  cell: {
    // flex: 1,
    textAlign: "center",
  },
  actionCell: {},
  actionButton: {},
  editButton: {},
  actionText: {},
  deleteButton: {},
});
