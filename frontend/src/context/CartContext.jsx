import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('gsr_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal e.g. 0.10
  const [voucherCode, setVoucherCode] = useState('');

  useEffect(() => {
    localStorage.setItem('gsr_cart', JSON.stringify(cart));
  }, [cart]);

  const formatRupiah = (num) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateCartQty = (productId, increment) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === productId);
      if (!existing) return prevCart;

      const newQty = existing.quantity + increment;
      if (newQty <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      );
    });
  };

  const removeCartItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const applyVoucher = (code) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'GSRWEB') {
      setAppliedDiscount(0.10);
      setVoucherCode('GSRWEB');
      return { success: true, message: 'Voucher GSRWEB berhasil diterapkan! Diskon 10% dipotong dari subtotal.' };
    } else {
      setAppliedDiscount(0);
      setVoucherCode('');
      return { success: false, message: 'Voucher tidak valid atau kadaluwarsa.' };
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
    setVoucherCode('');
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = subtotal * appliedDiscount;
    const total = subtotal - discountAmount;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      discountAmount,
      total,
      totalItems
    };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        voucherCode,
        appliedDiscount,
        formatRupiah,
        addToCart,
        updateCartQty,
        removeCartItem,
        applyVoucher,
        clearCart,
        calculateTotals
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
