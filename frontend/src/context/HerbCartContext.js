import React, { createContext, useContext, useState } from "react";

// 1. Create the context object.
const HerbCartContext = createContext();

// 2. Provider component that wraps your app and manages the cart state.
export function HerbCartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add a herb to the cart (no duplicates by name)
  const addHerb = (herb) => {
    const herbKey = herb.name || herb.pinyinName;
    setCart((prev) => {
      if (prev.some((h) => (h.name || h.pinyinName) === herbKey)) return prev;
      return [...prev, herb];
    });
  };

  // Remove a herb by name
  const removeHerb = (herbName) => {
    setCart((prev) =>
      prev.filter((h) => (h.name || h.pinyinName) !== herbName)
    );
  };

  // Clear the whole cart
  const clearCart = () => setCart([]);

  return (
    <HerbCartContext.Provider value={{ cart, addHerb, removeHerb, clearCart }}>
      {children}
    </HerbCartContext.Provider>
  );
}

// 3. Custom hook to access cart in any component.
export function useHerbCart() {
  return useContext(HerbCartContext);
}