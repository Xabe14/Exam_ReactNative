import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth";

export default function UserTabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "#E91E63", headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color }) => (
            <Ionicons name="log-in" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "Signup",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-add" color={color} size={28} />
          ),
        }}
      />
      {user && (
        <Tabs.Screen
          name="logout"
          options={{
            title: "Logout",
            tabBarIcon: ({ color }) => (
              <Ionicons name="log-out" color={color} size={28} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
