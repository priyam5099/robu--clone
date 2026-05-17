"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define what a Cart Item looks like
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// 2. Define what a Product looks like BEFORE it goes in the cart (No quantity yet)
export type ProductInput = Omit<CartItem, 'quantity'>;

// 3. Define the tools available in our Cart Context
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductInput) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
}

// 4. Create the Context (The empty brain)
const CartContext = createContext<CartContextType | undefined>(undefined);

// 5. Create the Provider (The actual logic that wraps our app)
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Strictly typed as ProductInput instead of 'any'
  const addToCart = (product: ProductInput) => {
    setCart((prevCart) => {
      // Check if it's already in the cart
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        // If yes, just increase the quantity
        return prevCart.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // If no, add it as a new item with quantity 1
      return [...prevCart, { 
        _id: product._id, 
        name: product.name, 
        price: product.price, 
        imageUrl: product.imageUrl, 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return; // Don't allow 0 or negative
    setCart(prevCart => prevCart.map(item => 
      item._id === id ? { ...item, quantity } : item
    ));
  };

  // Helper values calculated on the fly
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// 6. A custom hook to easily grab cart tools from any file
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}