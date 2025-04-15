import LoyaltyPoints from "./LoyaltyPoints.js";
import {
  BULK_DISCOUNT_RATE,
  PRODUCT_BULK_DISCOUNTS,
  TUESDAY_DISCOUNT_RATE,
  BULK_PURCHASE_ITEM_THRESHOLD,
  BULK_PURCHASE_THRESHOLD,
} from "../lib/constants";
import { getDiscountedPrice } from "../util/helpers.js";

function CartTotal({ totalAmount, discountRate }) {
  return `<div class="text-xl font-bold my-4" id="cart-total">총액: ${Math.round(totalAmount)}원${discountRate > 0 ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>` : ""}${LoyaltyPoints({ totalAmount })}</div>`;
}

export default CartTotal;

export const renderCartTotal = (totalAmount, discountRate) => {
  document.getElementById("cart-total").innerHTML = CartTotal({
    totalAmount,
    discountRate,
  });
};

// 장바구니 계산 함수
export const calculateCartTotal = (cartItems, products) => {
  let totalAmount = 0;
  let cartItemCount = 0;
  let subTotalAmount = 0;

  for (const item of Array.from(cartItems)) {
    const currentProduct = products.find((product) => product.id === item.id);
    const quantity = parseInt(
      item.querySelector("span").textContent.split("x ")[1]
    );
    const currentProductPrice = currentProduct.price * quantity;
    let discountRate = 0;

    cartItemCount += quantity;
    subTotalAmount += currentProductPrice;

    if (quantity >= BULK_PURCHASE_ITEM_THRESHOLD) {
      discountRate = PRODUCT_BULK_DISCOUNTS[currentProduct.id] || 0;
    }

    totalAmount += getDiscountedPrice(currentProductPrice, discountRate);
  }

  let discountRate = 0;

  if (cartItemCount >= BULK_PURCHASE_THRESHOLD) {
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
