import { useCallback } from "react";
import { useCart } from "../contexts/CartProvider";
import { useCartItemHandlers } from "../hooks/useCartItemHandler";

type Props = {
  children: React.ReactNode;
};

const CartList = ({ children }: Props) => {
  const { state } = useCart();

  const { handleRemoveItem, handleIncreaseQuantity, handleDecreaseQuantity } =
    useCartItemHandlers();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const buttonElement = target.closest("[data-product-id]") as HTMLElement;

      if (!buttonElement) {
        throw new Error("버튼 요소가 없습니다.");
      }

      const currentCartItemId = buttonElement.dataset.productId;

      if (!currentCartItemId) {
        throw new Error("상품 ID가 없습니다.");
      }

      const currentCartItem = state.cart.find(
        (item) => item.id === currentCartItemId
      );

      if (!currentCartItem) {
        throw new Error("존재하지 않는 상품입니다.");
      }

      if (target.classList.contains("remove-item")) {
        handleRemoveItem(currentCartItemId);
      } else if (target.classList.contains("quantity-change")) {
        if (!target.dataset.change) {
          throw new Error("변경 값이 없습니다.");
        }

        const quantityDelta = parseInt(target.dataset.change);

        if (quantityDelta > 0) {
          handleIncreaseQuantity(currentCartItemId);
        } else {
          handleDecreaseQuantity(currentCartItemId);
        }
      }
    },
    [
      state.cart,
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
