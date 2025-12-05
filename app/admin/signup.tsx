import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/auth";
import { validateUsername, validatePassword } from "../utils/validation";

export default function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setUsernameError(validateUsername(text));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(validatePassword(text));
  };

  const handleSignup = async () => {
    const userError = validateUsername(username);
    const passError = validatePassword(password);

    setUsernameError(userError);
    setPasswordError(passError);

    if (userError || passError) return;

    const success = await signup(username.trim(), password.trim());
    if (success) {
      router.replace("/(tabs)/login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={handleUsernameChange}
        autoCapitalize="none"
      />
      {usernameError && <Text style={styles.error}>{usernameError}</Text>}

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={handlePasswordChange}
      />
      {passwordError && <Text style={styles.error}>{passwordError}</Text>}

      <View style={styles.buttonContainer}>
        <Button title="Signup" onPress={handleSignup} color="#E91E63" />
        <Button
          title="Back to Login"
          onPress={() => router.push("/(tabs)/login")}
          color="#E91E63"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F1E9",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  error: { color: "red", marginBottom: 10 },
});
