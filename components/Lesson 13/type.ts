// types.ts
import { ImageSourcePropType } from 'react-native';

// Dùng cho màn hình Home
export interface Product1 {
  id: string;
  name: string;
  price: string;
  image: ImageSourcePropType;
}

// Dùng cho Category/Product
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  categoryId: number;
}

// Các màn hình trong Stack Navigator của Home
export type HomeStackParamList = {
  Home: undefined;
  Details: { product: Product1 };
  Accessory: undefined;
  Fashion: undefined;
  Categories: undefined;
  About: undefined;
  AdminDashboard: undefined;
  CategoryManagement: undefined;
  UserManagement: undefined;
  AddUser: undefined;
  EditUser: { userId: number };
  ProductManagement: { categoryId: number };
};
