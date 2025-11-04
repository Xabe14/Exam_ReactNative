import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const colors = ['#FF5733', '#33FF57', '#3357FF', '#F4A261', '#2A9D8F', '#E9C46A', '#E76F51', '#264653', '#E63946'];

const GridLayoutMap = () => {
  return (
    <View style={styles.container}>
      {colors.map((color, index) => (
        <View key={index} style={[styles.box, { backgroundColor: color }]}>
          <Text style={styles.text}>Box {index + 1}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  box: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor:'yellow'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GridLayoutMap;