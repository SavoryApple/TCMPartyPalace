import React, { createContext, useContext, useState } from "react";

const HerbCartContext = createContext();

const MAX_HERBS = 25;

export function HerbCartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [alert, setAlert] = useState(null); // For custom alerts

  // Show alert for 2 seconds then hide
  function showAlert(message) {
    setAlert(message);
    setTimeout(() => setAlert(null), 2000);
  }

  const addHerb = (herb) => {
    const herbKey = herb.name || herb.pinyinName;
    setCart((prev) => {
      if (prev.length >= MAX_HERBS) {
        showAlert("You can only add up to 25 herbs to the cart!");
        return prev;
      }
      if (prev.some((h) => (h.name || h.pinyinName) === herbKey)) return prev;
      return [...prev, herb];
    });
  };

  const removeHerb = (herbName) => {
    setCart((prev) =>
      prev.filter((h) => (h.name || h.pinyinName) !== herbName)
    );
  };

  const clearCart = () => setCart([]);

  const herbCount = cart.length;

  return (
    <HerbCartContext.Provider value={{
      cart,
      addHerb,
      removeHerb,
      clearCart,
      herbCount,
      maxHerbs: MAX_HERBS,
      alert,           // Pass alert state
      setAlert,        // Pass setter in case you want to show other alerts
    }}>
      {children}
    </HerbCartContext.Provider>
  );
}

export function useHerbCart() {
  return useContext(HerbCartContext);
}