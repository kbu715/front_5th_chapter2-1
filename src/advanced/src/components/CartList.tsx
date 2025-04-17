import { useCallback, useMemo } from "react";
import { useCart } from "../contexts/CartProvider";
import { INITIAL_PRODUCTS } from "../lib/constants";

type Props = {
  children: React.ReactNode;
};

const CartList = ({ children }: Props) => {
  const { state, setCart, setProducts } = useCart();

  const currentCartItems = useMemo(() => state.cart, [state.cart]);
  const currentProducts = useMemo(() => state.products, [state.products]);

  const handleRemoveItem = useCallback(
    (currentCartItemId: string, quantity: number) => {
      if (!currentCartItemId || !quantity) return;

      setCart(
        currentCartItems.filter((cartItem) => cartItem.id !== currentCartItemId)
      );
      setProducts(
        currentProducts.map((product) =>
          product.id === currentCartItemId
            ? {
                ...product,
                quantity: product.quantity + quantity
              }
            : product
        )
      );
    },
    [currentCartItems, currentProducts, setCart, setProducts]
  );

  const handleIncreaseQuantity = useCallback(
    (currentCartItemId: string) => {
      if (!currentCartItemId) return;

      const currentCartItem = currentCartItems.find(
        (item) => item.id === currentCartItemId
      );

      if (!currentCartItem) return;

      const maxQuantity = INITIAL_PRODUCTS.find(
        (product) => product.id === currentCartItemId
      )?.quantity;

      if (!maxQuantity) return;

      if (currentCartItem.quantity + 1 > maxQuantity) {
        window.alert("재고가 부족합니다.");
        return;
      }

      setCart(
        currentCartItems.map((cartItem) =>
          cartItem.id === currentCartItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );

      setProducts(
        currentProducts.map((product) =>
          product.id === currentCartItemId
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      );
    },
    [currentCartItems, currentProducts, setCart, setProducts]
  );

  const handleDecreaseQuantity = useCallback(
    (currentCartItemId: string) => {
      if (!currentCartItemId) return;

      const currentCartItem = currentCartItems.find(
        (item) => item.id === currentCartItemId
      );

      if (!currentCartItem) return;

      if (currentCartItem.quantity - 1 <= 0) {
        handleRemoveItem(currentCartItemId, currentCartItem.quantity);
        return;
      }

      setCart(
        currentCartItems.map((cartItem) =>
          cartItem.id === currentCartItemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );

      setProducts(
        currentProducts.map((product) =>
          product.id === currentCartItemId
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    },
    [currentCartItems, currentProducts, setCart, setProducts, handleRemoveItem]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const buttonElement = target.closest("[data-product-id]") as HTMLElement;

      if (!buttonElement) return;

      const currentCartItemId = buttonElement.dataset.productId;

      if (!currentCartItemId) return;

      const currentCartItem = currentCartItems.find(
        (item) => item.id === currentCartItemId
      );

      if (!currentCartItem) return;

      if (target.classList.contains("remove-item")) {
        handleRemoveItem(currentCartItemId, currentCartItem.quantity);
      } else if (target.classList.contains("quantity-change")) {
        if (!target.dataset.change) return;
        const quantityDelta = parseInt(target.dataset.change);
        if (quantityDelta > 0) {
          handleIncreaseQuantity(currentCartItemId);
        } else {
          handleDecreaseQuantity(currentCartItemId);
        }
      }
    },
    [
      currentCartItems,
      handleRemoveItem,
      handleIncreaseQuantity,
      handleDecreaseQuantity
    ]
  );

  return (
    <div id="cart-items" onClick={handleClick}>
      {children}
    </div>
  );
};

export default CartList;

CartList.displayName = "CartList";
