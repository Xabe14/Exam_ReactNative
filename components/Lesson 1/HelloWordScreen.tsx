import React from "react";
import { StyleSheet, Text, View } from "react-native";

const HelloWorldScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, My name is Y Xa Bế!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: "red",
  },
});
export default HelloWorldScreen;
