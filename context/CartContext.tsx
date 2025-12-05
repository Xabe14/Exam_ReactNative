// // context/CartContext.tsx
// import React, { createContext, useState, useContext, ReactNode } from "react";
// import { CartItem, Product } from "../components/Lesson 13/database";

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (product: CartItem) => void;
//   removeFromCart: (id: number) => void;
//   clearCart: () => void;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const addToCart = (product: CartItem) => {
//     setCartItems((prev) => [...prev, product]);
//   };

//   const removeFromCart = (id: number) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const clearCart = () => setCartItems([]);

//   return (
//     <CartContext.Provider
//       value={{ cartItems, addToCart, removeFromCart, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within a CartProvider");
//   return context;
// };
