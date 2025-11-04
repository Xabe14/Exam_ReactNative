import React, { useState } from 'react';
import { View, TextInput, Text,StyleSheet } from 'react-native';

type data = {
  name: string;
  age: number;
};

const Parent = () => {
  const [value, setValue] = useState<data>({ name: '', age: 0 });

  const handleDataChange = (data:data) => {
    setValue(data);
  };

  return (
    <View style={styles.container}>
        <Text>--- Display ---</Text>
        <Text>Tên cha là: {value.name}</Text>
        <Text>Tuổi cha là: {value.age}</Text>
      <Text>--- Parent ---</Text>
      <TextInput
        placeholder="Nhập tên (cha)"
        value={value.name}
        onChangeText={(text) => setValue({ ...value, name: text })}
        style={styles.TextInput}
      />
      <TextInput
        placeholder="Nhập tuổi (cha)"
        value={value.age.toString()}
        onChangeText={(text) => setValue({ ...value, age: Number(text) })}
        style={styles.TextInput}
      />

      <Child value={value} onChange={handleDataChange} />
    </View>
  );
};

const Child = ({ value, onChange }: { value: data; onChange: (data: data) => void }) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text>--- Child ---</Text>
      <TextInput
        placeholder="Nhập tên (con)"
        value={value.name}
        onChangeText={(text) => onChange({ ...value, name: text })}
        style={styles.TextInput}
      />
      <TextInput
        placeholder="Nhập tuổi (con)"
        value={value.age.toString()}
        onChangeText={(text) => onChange({ ...value, age: Number(text) })}
        style={styles.TextInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f7c9c9ff' },
    TextInput: { borderWidth: 2, marginVertical: 10, padding: 10, borderColor: '#423434ff' },
});


export default Parent;
