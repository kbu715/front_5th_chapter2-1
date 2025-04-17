import { store } from "../store";
import { renderCartList } from "./CartList";
import { renderCartSummary } from "./CartTotal";

function AddToCart() {
  return `
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">
      추가
    </button>
  `;
}

export default AddToCart;

export const setupAddToCartListner = () => {
  const addToCartButton = document.getElementById("add-to-cart");
  const productSelect = document.getElementById("product-select");

  if (!addToCartButton || !productSelect) return;

  addToCartButton.addEventListener("click", () => {
    const currentProduct = store.products.find(
      (product) => product.id === productSelect.value
    );

    if (!currentProduct || currentProduct.quantity <= 0) {
      window.alert("재고가 부족합니다.");
      return;
    }

    const existingCartItem = store.cart.find(
      (item) => item.id === currentProduct.id
    );

    if (existingCartItem) {
      store.cart = store.cart.map((item) =>
        item.id === currentProduct.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      store.cart.push({ ...currentProduct, quantity: 1 });
    }

    store.products = store.products.map((product) =>
      product.id === currentProduct.id
        ? { ...product, quantity: product.quantity - 1 }
        : product
    );

    renderCartSummary();
    renderCartList({ cartItems: store.cart });
  });
};
