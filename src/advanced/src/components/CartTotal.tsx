import { useMemo } from "react";
import LoyaltyPoints from "./LoyaltyPoints";
import { useCart } from "../contexts/CartProvider";
import {
  BULK_DISCOUNT_RATE,
  PRODUCT_BULK_DISCOUNTS,
  TUESDAY_DISCOUNT_RATE,
  BULK_PURCHASE_ITEM_THRESHOLD,
  BULK_PURCHASE_THRESHOLD
} from "../lib/constants";
import { memo } from "react";

const CartTotal = memo(() => {
  const { state } = useCart();

  const calculateCartTotal = useMemo(() => {
    let totalAmount = 0;
    let subTotalAmount = 0;
    let totalQuantity = 0;

    for (const cartItem of state.cart) {
      const quantity = cartItem.quantity;
      const amount = cartItem.price * quantity;
      let discountRate = 0;

      totalQuantity += quantity;
      subTotalAmount += amount;

      if (quantity >= BULK_PURCHASE_ITEM_THRESHOLD) {
        discountRate =
          PRODUCT_BULK_DISCOUNTS[
            cartItem.id as keyof typeof PRODUCT_BULK_DISCOUNTS
          ] || 0;
      }

      totalAmount += amount * (1 - discountRate);
    }

    let discountRate = 0;

    if (totalQuantity >= BULK_PURCHASE_THRESHOLD) {
      const bulkDiscount = totalAmount * BULK_DISCOUNT_RATE;
      const itemDiscount = subTotalAmount - totalAmount;

      if (bulkDiscount > itemDiscount) {
        totalAmount = subTotalAmount * (1 - BULK_DISCOUNT_RATE);
        discountRate = BULK_DISCOUNT_RATE;
      } else {
        discountRate = (subTotalAmount - totalAmount) / subTotalAmount;
      }
    } else {
      discountRate = (subTotalAmount - totalAmount) / subTotalAmount;
    }

    const isTuesday = new Date().getDay() === 2;

    if (isTuesday) {
      totalAmount = totalAmount * (1 - TUESDAY_DISCOUNT_RATE);
      discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
    }

    return { totalAmount, discountRate };
  }, [state.cart]);

  const roundedTotalAmount = useMemo(
    () => Math.round(calculateCartTotal.totalAmount),
    [calculateCartTotal.totalAmount]
  );
  const discountPercentage = useMemo(
    () => (calculateCartTotal.discountRate * 100).toFixed(1),
    [calculateCartTotal.discountRate]
  );

  return (
    <div className="text-xl font-bold my-4" id="cart-total">
      총액: {roundedTotalAmount}원
      {calculateCartTotal.discountRate > 0 ? (
        <span className="text-green-500 ml-2">
          ({discountPercentage}% 할인 적용)
        </span>
      ) : null}
      <LoyaltyPoints totalAmount={roundedTotalAmount} />
    </div>
  );
});

export default CartTotal;

CartTotal.displayName = "CartTotal";
