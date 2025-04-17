import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useMemo,
  useCallback
} from "react";
import { INITIAL_PRODUCTS } from "../lib/constants";

type CartState = {
  cart: Product[];
  products: Product[];
  lastSelectedProductId: string | null;
};

type CartContextType = {
  state: CartState;
  setCart: (cart: Product[]) => void;
  setProducts: (products: Product[]) => void;
  setLastSelectedProductId: (id: string | null) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [lastSelectedProductId, setLastSelectedProductId] = useState<
    string | null
  >(INITIAL_PRODUCTS[0].id);

  const memoizedSetCart = useCallback((cart: Product[]) => {
    setCart(cart);
  }, []);

  const memoizedSetProducts = useCallback((products: Product[]) => {
    setProducts(products);
  }, []);

  const memoizedSetLastSelectedProductId = useCallback((id: string | null) => {
    setLastSelectedProductId(id);
  }, []);

  const state = useMemo<CartState>(
    () => ({
      cart,
      products,
      lastSelectedProductId
    }),
    [cart, products, lastSelectedProductId]
  );

  const contextValue = useMemo(
    () => ({
      state,
      setCart: memoizedSetCart,
      setProducts: memoizedSetProducts,
      setLastSelectedProductId: memoizedSetLastSelectedProductId
    }),
    [
      state,
      memoizedSetCart,
      memoizedSetProducts,
      memoizedSetLastSelectedProductId
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
