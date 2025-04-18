import { useCart } from "../contexts/CartProvider";
import { useCallback } from "react";
import { INITIAL_PRODUCTS } from "../lib/constants";

export const useCartItemHandlers = () => {
  const { state, setCart, setProducts } = useCart();

  const handleRemoveItem = useCallback(
    (currentCartItemId: string) => {
      setCart(
        state.cart.filter((cartItem) => cartItem.id !== currentCartItemId)
      );
      setProducts(
        state.products.map((product) =>
          product.id === currentCartItemId
            ? {
                ...product,
                quantity:
                  INITIAL_PRODUCTS.find(
                    (product) => product.id === currentCartItemId
                  )?.quantity || 0
              }
            : product
        )
      );
    },
    [state.cart, state.products, setCart, setProducts]
  );

  const handleIncreaseQuantity = useCallback(
    (currentCartItemId: string) => {
      const currentCartItem = state.cart.find(
        (item) => item.id === currentCartItemId
      );

      if (!currentCartItem) {
        throw new Error("존재하지 않는 상품입니다.");
      }

      const maxQuantity = INITIAL_PRODUCTS.find(
        (product) => product.id === currentCartItemId
      )?.quantity;

      if (!maxQuantity) return;

      if (currentCartItem.quantity + 1 > maxQuantity) {
        window.alert("재고가 부족합니다.");
        return;
      }

      setCart(
        state.cart.map((cartItem) =>
          cartItem.id === currentCartItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );

      setProducts(
        state.products.map((product) =>
          product.id === currentCartItemId
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      );
    },
    [state.cart, state.products, setCart, setProducts]
  );

  const handleDecreaseQuantity = useCallback(
    (currentCartItemId: string) => {
      const currentCartItem = state.cart.find(
        (item) => item.id === currentCartItemId
      );

      if (!currentCartItem) {
        throw new Error("존재하지 않는 상품입니다.");
      }

      if (currentCartItem.quantity - 1 <= 0) {
        handleRemoveItem(currentCartItemId);
        return;
      }

      setCart(
        state.cart.map((cartItem) =>
          cartItem.id === currentCartItemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );

      setProducts(
        state.products.map((product) =>
          product.id === currentCartItemId
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    },
    [state.cart, state.products, setCart, setProducts, handleRemoveItem]
  );

  return {
    handleRemoveItem,
    handleIncreaseQuantity,
    handleDecreaseQuantity
  };
};
