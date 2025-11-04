import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface BMIResult {
  value: string;
  category: string;
  color: string;
  advice: string;
  idealWeight: string;
}

const calculateAndClassify = (
  weight: number,
  height: number
): BMIResult | null => {
  const hM = height / 100; // Chiều cao (m)
  if (weight <= 0 || hM <= 0) return null;

  const bmi = weight / (hM * hM);
  const fixedBMI = bmi.toFixed(1);

  let category: string;
  let color: string;
  let advice: string;

  if (bmi < 18.5) {
    category = "Gầy (Underweight)";
    color = "#4D96FF";
    advice = "Tăng cường dinh dưỡng và tập luyện nhẹ.";
  } else if (bmi <= 24.9) {
    category = "Bình thường (Normal)";
    color = "#4CAF50";
    advice = "Tuyệt vời! Duy trì lối sống lành mạnh.";
  } else if (bmi <= 29.9) {
    category = "Thừa cân (Overweight)";
    color = "#FF9800";
    advice = "Cân nhắc giảm calo, tăng cường cardio.";
  } else {
    category = "Béo phì (Obese)";
    color = "#F44336";
    advice = "Tham khảo chuyên gia để có kế hoạch giảm cân an toàn.";
  }

  const minW = 18.5 * hM * hM;
  const maxW = 24.9 * hM * hM;
  const idealWeight = `${minW.toFixed(1)} kg - ${maxW.toFixed(1)} kg`;

  return { value: fixedBMI, category, color, advice, idealWeight };
};

export default function BMICalculator() {
  const [weightInput, setWeightInput] = useState<string>("");
  const [heightInput, setHeightInput] = useState<string>("");
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState<{
    weight: string | null;
    height: string | null;
  }>({ weight: null, height: null });

  const handleCalculate = () => {
    Keyboard.dismiss();

    const w = Number(weightInput);
    const h = Number(heightInput);

    let newErrors = { weight: "", height: "" };
    let isValid = true;

    // Validation
    if (isNaN(w) || w <= 0 || w > 300) {
      newErrors.weight = "Cân nặng không hợp lệ (0-300kg).";
      isValid = false;
    }
    if (isNaN(h) || h <= 0 || h > 250) {
      newErrors.height = "Chiều cao không hợp lệ (0-250cm).";
      isValid = false;
    }

    setError(newErrors);

    if (!isValid) {
      setResult(null);
      return;
    }

    const finalResult = calculateAndClassify(w, h);
    setResult(finalResult);
  };

  const handleReset = () => {
    setWeightInput("");
    setHeightInput("");
    setResult(null);
    setError({ weight: null, height: null });
    Keyboard.dismiss();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Máy tính chỉ số BMI 📐</Text>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Cân nặng (kg)</Text>
        <TextInput
          style={[styles.input, error.weight && styles.inputError]}
          keyboardType="numeric"
          placeholder="Ví dụ: 70"
          value={weightInput}
          onChangeText={(text) => {
            setWeightInput(text);
            setError((e) => ({ ...e, weight: null }));
          }}
        />
        {error.weight && <Text style={styles.errorText}>{error.weight}</Text>}

        <Text style={styles.label}>Chiều cao (cm)</Text>
        <TextInput
          style={[styles.input, error.height && styles.inputError]}
          keyboardType="numeric"
          placeholder="Ví dụ: 175"
          value={heightInput}
          onChangeText={(text) => {
            setHeightInput(text);
            setError((e) => ({ ...e, height: null }));
          }}
        />
        {error.height && <Text style={styles.errorText}>{error.height}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={handleCalculate}
        >
          <Text style={styles.buttonText}>Tính BMI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultHeader}>Chỉ số BMI:</Text>
          <Text style={[styles.bmiValue, { color: result.color }]}>
            {result.value}
          </Text>

          <View
            style={[
              styles.classificationBox,
              { backgroundColor: result.color + "20" },
            ]}
          >
            <Text style={[styles.classificationText, { color: result.color }]}>
              {result.category}
            </Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>⚖️ Cân nặng lý tưởng:</Text>
            <Text style={styles.summaryDetail}>{result.idealWeight}</Text>
            <Text style={styles.summaryTitle}>💡 Đề xuất:</Text>
            <Text style={styles.summaryDetail}>{result.advice}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },

  inputSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: "#fafafa",
  },
  inputError: { borderColor: "#F44336", borderWidth: 2 },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
    fontWeight: "600",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  calculateButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    elevation: 3,
  },
  resetButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    width: 100,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },

  resultContainer: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
    marginBottom: 20,
  },
  resultHeader: { fontSize: 18, color: "#333", marginBottom: 10 },
  bmiValue: { fontSize: 60, fontWeight: "bold", marginBottom: 10 },
  classificationBox: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "transparent",
  },
  classificationText: { fontSize: 22, fontWeight: "bold", textAlign: "center" },

  summaryBox: {
    width: "100%",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  summaryDetail: {
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
    lineHeight: 22,
  },

  tableContainer: {
    marginTop: 10,
    marginBottom: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
