import { store } from "../store";
import { calculateCart } from "../main.basic";

function CartList() {
  return `
    <div id="cart-items"></div>
  `;
}

export default CartList;

export function renderCartList() {
  const cartItemsElement = document.getElementById("cart-items");

  if (!cartItemsElement) return;

  cartItemsElement.onclick = (event) => {
    const target = event.target;
    if (!target.closest("[data-product-id]")) return;

    const productId = target.dataset.productId;
    const productElement = document.getElementById(productId);
    const currentProduct = store.products.find((p) => p.id === productId);
    const span = productElement.querySelector("span");

    const currentQuantity = parseInt(span.textContent.split("x ")[1]);

    if (target.classList.contains("quantity-change")) {
      const changeValue = parseInt(target.dataset.change);

      const result = calculateQuantityChange(
        currentQuantity,
        changeValue,
        currentProduct.quantity + currentQuantity
      );

      if (result.isSuccess) {
        if (result.shouldRemove) {
          productElement.remove();
        } else {
          span.textContent = `${currentProduct.name} - ${currentProduct.price}원 x ${result.newQuantity}`;
        }
        currentProduct.quantity -= changeValue;
        calculateCart();
      } else {
        alert("재고가 부족합니다.");
      }
    }

    if (target.classList.contains("remove-item")) {
      const removeQuantity = currentQuantity;
      currentProduct.quantity += removeQuantity;
      productElement.remove();
      calculateCart();
    }
  };
}

export const calculateQuantityChange = (
  currentQuantity,
  newQuantityValue,
  maxQuantity
) => {
  const newQuantity = currentQuantity + newQuantityValue;

  if (newQuantity > 0 && newQuantity <= maxQuantity) {
    return { isSuccess: true, newQuantity };
  } else if (newQuantity <= 0) {
    return { isSuccess: true, newQuantity: 0, shouldRemove: true };
  }
  return { isSuccess: false };
};

// 수량 변경 처리 함수
export const handleQuantityChange = (
  productElement,
  currentProduct,
  newQuantityValue
) => {
  const currentQuantity = parseInt(
    productElement.querySelector("span").textContent.split("x ")[1]
  );

  const result = calculateQuantityChange(
    currentQuantity,
    newQuantityValue,
    currentProduct.quantity + currentQuantity
  );

  const { isSuccess, newQuantity, shouldRemove } = result;

  if (isSuccess) {
    if (shouldRemove) {
      productElement.remove();
    } else {
      productElement.querySelector("span").textContent =
        `${productElement.querySelector("span").textContent.split("x ")[0]}x ${newQuantity}`;
    }
    currentProduct.quantity -= newQuantityValue;
    return true;
  } else {
    alert("재고가 부족합니다.");
    return false;
  }
};
