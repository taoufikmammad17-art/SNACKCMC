import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product, CartItem, Order } from '@/data/products';

interface Toast {
  message: string;
  id: number;
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  toasts: Toast[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);

  const showToast = useCallback((message: string) => {
    const id = toastId + 1;
    setToastId(id);
    setToasts((prev) => [...prev, { message, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, [toastId]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let newItems;
      if (existing) {
        newItems = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
    showToast(`${product.name} ajouté au panier`);
  }, [showToast]);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => {
      const newOrders = [order, ...prev];
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return newOrders;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) => {
      const newOrders = prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      );
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return newOrders;
    });
  }, []);

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        orders,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addOrder,
        updateOrderStatus,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
