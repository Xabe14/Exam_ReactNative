// import React, { useState } from 'react';
// import { Button, Text } from 'react-native';

// const ProfileUseState = () => {
//     const [name, setName] = useState("Y Xa Bế");
//     const [age, setAge] = useState(18);
//   return (
//     <>
//       <Text>Hello, My name is {name}</Text>
//       <Text>I am {age} years old</Text>
//       <Button title="Click me" onPress={() => {
//         alert("Hello, " + name + ". You are " + age + " years old.");
//       }} />
//     </>
//   )
// }

// export default ProfileUseState;


import React, { useState } from 'react'
import { Button, TextInput, View } from 'react-native'

const ProfileUseState = () => {
    const [info, setInfo] = useState({ name: '', age: 1 });
    const ShowAlert = () => {
        alert(`Hello, ${info.name}. You are ${info.age} years old.`);
    }
  return (
    <View>
      <TextInput placeholder="Enter your name" onChangeText={(text) => setInfo({ ...info, name: text })} />
      <TextInput placeholder="Enter your age" keyboardType="numeric" onChangeText={(text) => setInfo({ ...info, age: parseInt(text) })} />
        <Button title="Click me" onPress={ShowAlert} /> 
    </View>
  )
}



export default ProfileUseState
