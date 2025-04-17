import LoyaltyPoints from "./LoyaltyPoints.js";
import {
  BULK_DISCOUNT_RATE,
  PRODUCT_BULK_DISCOUNTS,
  TUESDAY_DISCOUNT_RATE,
  BULK_PURCHASE_ITEM_THRESHOLD,
  BULK_PURCHASE_THRESHOLD
} from "../lib/constants";
import { getDiscountedPrice } from "../util/helpers.js";
import { renderStockStatus } from "./StockStatus.js";
import { store } from "../store/index.js";

function CartTotal({ totalAmount, discountRate }) {
  return `
    <div class="text-xl font-bold my-4" id="cart-total">
      총액: ${Math.round(totalAmount)}원${discountRate > 0 ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>` : ""}${LoyaltyPoints({ totalAmount })}
    </div>
  `;
}

export default CartTotal;

export const renderCartTotal = (totalAmount, discountRate) => {
  const cartTotalElement = document.getElementById("cart-total");

  if (!cartTotalElement) return;

  cartTotalElement.innerHTML = CartTotal({
    totalAmount,
    discountRate
  });
};

export const calculateCartTotal = (cartItems) => {
  let totalAmount = 0;
  let subTotalAmount = 0;
  let totalQuantity = 0;

  for (const cartItem of Array.from(cartItems)) {
    const quantity = cartItem.quantity;
    const amount = cartItem.price * quantity;
    let discountRate = 0;

    totalQuantity += quantity;
    subTotalAmount += amount;

    if (quantity >= BULK_PURCHASE_ITEM_THRESHOLD) {
      discountRate = PRODUCT_BULK_DISCOUNTS[cartItem.id] || 0;
    }

    totalAmount += getDiscountedPrice(amount, discountRate);
  }

  let discountRate = 0;

  if (totalQuantity >= BULK_PURCHASE_THRESHOLD) {
    const bulkDiscount = totalAmount * BULK_DISCOUNT_RATE;
    const itemDiscount = subTotalAmount - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = getDiscountedPrice(subTotalAmount, BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = (subTotalAmount - totalAmount) / subTotalAmount;
    }
  } else {
    discountRate = (subTotalAmount - totalAmount) / subTotalAmount;
  }

  const isTuesday = new Date().getDay() === 2;

  if (isTuesday) {
    totalAmount = getDiscountedPrice(totalAmount, TUESDAY_DISCOUNT_RATE);
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  return { totalAmount, discountRate };
};

// cart 계산 결과 표시
export const renderCartSummary = () => {
  const { totalAmount, discountRate } = calculateCartTotal(store.cart);

  renderCartTotal(totalAmount, discountRate);
  renderStockStatus(store.products);
};
