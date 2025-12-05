import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#26a69a", // màu xanh pastel
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#d0f0e0", // nền pastel xanh nhạt
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="userHome"
        options={{
          title: "User Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Admin Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color }) => (
            <Ionicons name="log-in-outline" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "Signup",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-add-outline" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
