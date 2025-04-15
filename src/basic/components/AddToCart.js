import { store } from "../store";
import { handleQuantityChange } from "./CartList";
import { calculateCart } from "../main.basic";
import CartItem from "./CartItem";

function AddToCart() {
  return `
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">
      추가
    </button>
  `;
}

export default AddToCart;

export function addCartItem(product) {
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
  };
  const cartItemsElement = document.getElementById("cart-items");

  cartItemsElement.insertAdjacentHTML("beforeend", CartItem(cartItem));
}

export const renderAddToCart = () => {
  const addToCartButton = document.getElementById("add-to-cart");
  const productSelect = document.getElementById("product-select");

  if (!addToCartButton || !productSelect) return;

  addToCartButton.addEventListener("click", () => {
    const productToAdd = store.products.find(
      (product) => product.id === productSelect.value
    );

    if (productToAdd && productToAdd.quantity > 0) {
      const existing = document.getElementById(productToAdd.id);

      if (existing) {
        if (handleQuantityChange(existing, productToAdd, 1)) {
          calculateCart();
        }
      } else {
        addCartItem(productToAdd);
        productToAdd.quantity--;
        calculateCart();
      }
    }
  });
};
