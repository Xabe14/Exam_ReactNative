import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import React, { useState, useRef } from 'react';

const HomeWork= () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [x, setX] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ref để focus khi lỗi
  const inputARef = useRef<TextInput>(null);
  const inputBRef = useRef<TextInput>(null);

  const handleSolve = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    // Kiểm tra giá trị nhập hợp lệ
    if (isNaN(numA)) {
      setError('⚠️ Vui lòng nhập số hợp lệ cho a');
      inputARef.current?.focus();
      setX(null);
      return;
    }

    if (isNaN(numB)) {
      setError('⚠️ Vui lòng nhập số hợp lệ cho b');
      inputBRef.current?.focus();
      setX(null);
      return;
    }

    // Nếu đúng thì xóa lỗi
    setError(null);

    if (numA === 0) {
      if (numB === 0) {
        setX('Phương trình vô số nghiệm');
      } else {
        setX('Phương trình vô nghiệm');
      }
    } else {
      const result = -numB / numA;
      setX(`Nghiệm X = ${result}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giải phương trình bậc 1</Text>

      <TextInput
        ref={inputARef}
        style={[styles.input, error?.includes('a') && styles.inputError]}
        placeholder="Nhập a"
        value={a}
        onChangeText={setA}
      />

      <TextInput
        ref={inputBRef}
        style={[styles.input, error?.includes('b') && styles.inputError]}
        placeholder="Nhập b"
        value={b}
        onChangeText={setB}
      />

      <Button title="Giải" onPress={handleSolve} />

      {/* Hiển thị lỗi */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Hiển thị kết quả */}
      {x && !error && <Text style={styles.result}>{x}</Text>}
    </View>
  );
};

export default HomeWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3a2a2ff',
    // padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  result: {
    color: 'blue',
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
  },
});