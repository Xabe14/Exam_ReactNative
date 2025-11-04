// StudentManager.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

// ----------------- Khai báo kiểu -----------------
interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
}

// ----------------- Dữ liệu khởi tạo -----------------
const initialStudents: Student[] = [
  { id: 1, name: "Nguyễn Văn A", age: 18, grade: 9 },
  { id: 2, name: "Trần Thị B", age: 17, grade: 7.5 },
  { id: 3, name: "Lê Văn C", age: 19, grade: 8.5 },
  { id: 4, name: "Phạm Thị D", age: 18, grade: 6 },
  { id: 5, name: "Đỗ Thị E", age: 18, grade: 6.5 },
];

const StudentManager: React.FC = () => {
  // ----------------- state chính -----------------
  const [students, setStudents] = useState<Student[]>(initialStudents);

  // các biến dùng cho form thêm/sửa (string vì TextInput trả về string)
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>(""); // sẽ convert sang number khi lưu
  const [grade, setGrade] = useState<string>("");

  // id của học sinh đang sửa (null nếu không sửa)
  const [editingId, setEditingId] = useState<number | null>(null);

  // biến search (tìm theo tên/tuổi/điểm)
  const [searchText, setSearchText] = useState<string>("");

  // ----------------- CRUD -----------------
  const handleAddOrUpdate = () => {
    // validation cơ bản
    if (!name.trim() || !age.trim() || !grade.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const ageNum = Number(age);
    const gradeNum = Number(grade);

    if (isNaN(ageNum) || isNaN(gradeNum)) {
      Alert.alert("Lỗi", "Tuổi và điểm phải là số hợp lệ");
      return;
    }

    if (editingId === null) {
      // thêm mới
      const newStudent: Student = {
        id: Date.now(), // id tạm
        name: name.trim(),
        age: ageNum,
        grade: gradeNum,
      };
      setStudents((prev) => [...prev, newStudent]);
    } else {
      // cập nhật
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, name: name.trim(), age: ageNum, grade: gradeNum }
            : s
        )
      );
      setEditingId(null);
    }

    // reset form
    setName("");
    setAge("");
    setGrade("");
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setName(student.name);
    setAge(String(student.age));
    setGrade(String(student.grade));
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa học sinh này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => setStudents((prev) => prev.filter((s) => s.id !== id)),
      },
    ]);
  };

  // ----------------- Sort / Filter / Reset -----------------
  const sortByGradeDesc = () => {
    setStudents((prev) => [...prev].sort((a, b) => b.grade - a.grade));
  };

  const filterGradeGTE8 = () => {
    setStudents((prev) => prev.filter((s) => s.grade >= 8));
  };

  const resetList = () => {
    setStudents(initialStudents);
    setSearchText("");
  };

  // ----------------- Search-----------------
  let displayedStudents = students;

if (searchText.trim() !== "") {
  const q = searchText.toLowerCase();
  displayedStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.age.toString().includes(q) ||
      s.grade.toString().includes(q)
  );
}
  // ----------------- Thông tin bổ sung -----------------
  const countHighGrade = students.filter((s) => s.grade > 8).length;

  // ----------------- Render item -----------------
  const renderItem = ({ item, index }: { item: Student; index: number }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>
          {index + 1}. {item.name}
        </Text>
        <Text>Tuổi: {item.age}</Text>
        <Text>Điểm: {item.grade}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text style={styles.edit}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.delete}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ----------------- JSX -----------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Danh Sách Học Sinh</Text>

      <TextInput
        style={styles.search}
        placeholder="Tìm kiếm theo tên/tuổi/điểm"
        value={searchText}
        onChangeText={setSearchText}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập tên học sinh"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập tuổi"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập điểm"
        keyboardType="numeric"
        value={grade}
        onChangeText={setGrade}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>
          {editingId === null ? "THÊM HỌC SINH" : "LƯU THAY ĐỔI"}
        </Text>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.smallBtn} onPress={sortByGradeDesc}>
          <Text style={styles.smallBtnText}>Sắp xếp điểm ↓</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallBtn} onPress={filterGradeGTE8}>
          <Text style={styles.smallBtnText}>Lọc điểm ≥ 8</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallBtn, { backgroundColor: "#888" }]}
          onPress={resetList}
        >
          <Text style={styles.smallBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginVertical: 8 }}>
        Số học sinh có điểm &gt; 8: {countHighGrade}
      </Text>

      <FlatList
        data={displayedStudents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Không có học sinh</Text>}
      />
    </View>
  );
};

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginVertical: 6,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  smallBtn: {
    backgroundColor: "#0a84ff",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  smallBtnText: { color: "#fff", fontWeight: "600" },
  card: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginVertical: 6,
    alignItems: "center",
  },
  cardTitle: { fontWeight: "700", marginBottom: 6 },
  cardActions: { marginLeft: 12, alignItems: "flex-end" },
  edit: { color: "green", marginBottom: 6, fontWeight: "600" },
  delete: { color: "red", fontWeight: "600" },
});

export default StudentManager;
