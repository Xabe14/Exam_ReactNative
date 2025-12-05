import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

// Định nghĩa props cho component
interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}) => {
  // Hàm xử lý khi giá tối thiểu thay đổi
  const handleMinPriceChange = (text: string) => {
    // Loại bỏ ký tự không phải số và chuyển thành số nguyên. Nếu rỗng, gán là 0.
    const price = parseInt(text.replace(/\D/g, "")) || 0;
    setMinPrice(price);
  };

  // Hàm xử lý khi giá tối đa thay đổi
  const handleMaxPriceChange = (text: string) => {
    // Loại bỏ ký tự không phải số và chuyển thành số nguyên.
    // Nếu rỗng, gán giá trị Max mặc định cao (đã định nghĩa trong HomeScreen)
    const price = parseInt(text.replace(/\D/g, "")) || 100000000;
    setMaxPrice(price);
  };

  // Hàm định dạng số hiển thị trong TextInput (thêm dấu phân cách hàng nghìn)
  const formatNumber = (num: number) => {
    if (num === 0 || num === 100000000) return ""; // Không hiển thị 0 hoặc giá trị Max mặc định
    return num.toLocaleString("vi-VN");
  };

  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Lọc theo Khoảng Giá</Text>

      <View style={styles.inputsRow}>
        {/* Input Giá tối thiểu */}
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            placeholder="Giá Tối thiểu"
            // Hiển thị giá đã định dạng
            value={formatNumber(minPrice)}
            onChangeText={handleMinPriceChange}
          />
        </View>

        <Text style={styles.separator}>-</Text>

        {/* Input Giá tối đa */}
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            placeholder="Giá Tối đa"
            // Hiển thị giá đã định dạng (nếu nhỏ hơn giá trị mặc định rất lớn)
            value={maxPrice < 100000000 ? formatNumber(maxPrice) : ""}
            onChangeText={handleMaxPriceChange}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: 15,
    paddingVertical: 10,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputGroup: {
    flex: 1,
  },
  priceInput: {
    height: 40,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 15,
    textAlign: "center",
  },
  separator: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: "300",
    color: "#666",
  },
});

export default PriceFilter;
