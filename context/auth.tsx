import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import {
  getUserByCredentials,
  addUser,
  User as DbUser,
} from "../components/Lesson 13/database";

// 🔹 Auth user type (mở rộng avatar)
export type User = {
  id: number;
  username: string;
  role: "user" | "admin";
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, pass: string) => Promise<User | null>;
  signup: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 🔹 Load user từ AsyncStorage khi app mở
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("loggedInUser");
        if (stored) {
          const parsed: User = JSON.parse(stored);
          setUser(parsed);

          // 🔹 Redirect tự động theo role
          if (parsed.role === "admin") {
            router.replace("/admin/home");
          } else {
            router.replace("/(tabs)");
          }
        }
      } catch (e) {
        console.log("Load user error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // 🔹 Login
  const login = async (username: string, password: string) => {
    const dbUser: DbUser | null = await getUserByCredentials(
      username,
      password
    );
    if (!dbUser) {
      Alert.alert("Sai thông tin đăng nhập!");
      return null;
    }

    const logged: User = {
      id: dbUser.id,
      username: dbUser.username,
      role: dbUser.role,
      avatar: dbUser.avatar, // lấy avatar
    };

    setUser(logged);
    await AsyncStorage.setItem("loggedInUser", JSON.stringify(logged));
    Alert.alert(`Xin chào ${dbUser.username}!`);

    // 🔹 Redirect theo role
    if (dbUser.role === "admin") router.replace("/admin/home");
    else router.replace("/(tabs)");

    return logged;
  };

  // 🔹 Signup
  const signup = async (
    username: string,
    pass: string,
    avatar: string | null = null
  ) => {
    const success = await addUser(username, pass, avatar, "user");
    if (success) Alert.alert("Đăng ký thành công!");
    else Alert.alert("Tên đăng nhập đã tồn tại!");
    return success;
  };

  // 🔹 Logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("loggedInUser");
    router.replace("/(tabs)/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
