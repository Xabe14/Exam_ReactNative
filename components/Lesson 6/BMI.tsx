import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
// import { Value } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';

const BMI = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeigth] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [color, setColor] = useState<string>('');

  const handleCalculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      Alert.alert(
        'Lỗi',
        'Vui lòng nhập chiều cao (cm) và cân nặng (kg) hợp lệ.',
      );
      return;
    }
    const hInMeters = h / 100;
    const bmiValue = w / (hInMeters * hInMeters);

    if (bmiValue < 18.5) {
      setResult('thieu can nha');
      setColor('yellow');
    } else if (bmiValue <= 24.9) {
      setResult('Binh thuong');
      setColor('green');
    } else if (bmiValue <= 29.9) {
      setResult('thua can roi');
      setColor('red');
    } else {
      setResult('beo phi ❤️❤️❤️❤️❤️');
      setColor('pink');
    }
  };
  const handleReset = () => {
    setHeigth('');
    setWeight('');
    setResult('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section1}>
        <View style={{ flex: 3, justifyContent: 'center' }}>
          <Text style={styles.title}>BMI</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={height}
            onChangeText={(text: string) => {
              setHeigth(text);
            }}
            placeholder="Chiều cao (cm)"
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weight}
            onChangeText={(text: string) => {
              setWeight(text);
            }}
            placeholder="Can nang (kg)"
          />
        </View>
        <View style={{ flex: 2, flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }]}
            onPress={handleCalculate}
          >
            <Text style={styles.label}>Tính BMI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }]}
            onPress={handleReset}
          >
            <Text style={styles.label}> Reset </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.section2,
          { backgroundColor: color },
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={styles.label}>{result}</Text>
      </View>
    </View>
  );
};

export default BMI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    backgroundColor: '#fff',
  },
  section1: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#bce9c6ff',
  },
  section2: {
    flex: 2,
    marginTop: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    // height: 50,
    borderColor: '#ccc',
    borderWidth: 4,
    borderRadius: 8,
    margin: 5,
    // marginBottom: 15,
    // paddingHorizontal: 5,
    fontSize: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
    color: '#221c1cff',
    padding: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
