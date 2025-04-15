import { store } from "../store";
import { addCartItem, handleQuantityChange } from "./CartList";
import { calculateCart } from "../main.basic";

function AddToCart() {
  return `
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">
      추가
    </button>
  `;
}

export default AddToCart;

export const renderAddToCart = () => {
  const button = document.getElementById("add-to-cart");
  const select = document.getElementById("product-select");

  if (!button) return;

  button.addEventListener("click", () => {
    const productToAdd = store.products.find((p) => p.id === select.value);

    if (productToAdd && productToAdd.q > 0) {
      const existing = document.getElementById(productToAdd.id);

      if (existing) {
        if (handleQuantityChange(existing, productToAdd, 1)) {
          calculateCart();
        }
      } else {
        addCartItem(productToAdd);
        productToAdd.q--;
        calculateCart();
      }
    }
  });
};
