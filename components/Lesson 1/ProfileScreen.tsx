import { Button } from "@react-navigation/elements";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type ProfileScreenProps = {
  name: string;
  age: number;
};
const ProfileScreen = ({ name, age }: ProfileScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, My name is {name}!</Text>
      <Text>I am {age} years old</Text>
      <Button onPress={() => alert("Hello, " + name)}>Click Me</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 24,
    color: "red",
  },
});
export default ProfileScreen;
