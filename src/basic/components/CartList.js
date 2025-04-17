import { INITIAL_PRODUCTS, store } from "../store";
import CartItem from "./CartItem";
import { renderCartSummary } from "./CartTotal";

function CartList({ cartItems }) {
  return `
    <div id="cart-items">${cartItems
      .map((cartItem) =>
        CartItem({
          id: cartItem.id,
          name: cartItem.name,
          price: cartItem.price,
          quantity: cartItem.quantity
        })
      )
      .join("")}</div>
  `;
}

export default CartList;

export const renderCartList = ({ cartItems }) => {
  const cartItemsElement = document.getElementById("cart-items");
  if (!cartItemsElement) return;

  cartItemsElement.innerHTML = cartItems
    .map((cartItem) =>
      CartItem({
        id: cartItem.id,
        name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity
      })
    )
    .join("");
};

const removeItem = (currentCartItemId, quantity) => {
  if (!currentCartItemId || !quantity) return;

  store.cart = store.cart.filter(
    (cartItem) => cartItem.id !== currentCartItemId
  );
  store.products = store.products.map((product) =>
    product.id === currentCartItemId
      ? {
          ...product,
          quantity: product.quantity + quantity
        }
      : product
  );

  renderCartList({ cartItems: store.cart });
};

const increaseQuantity = (currentCartItemId) => {
  if (!currentCartItemId) return;

  const currentCartItem = store.cart.find(
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

  store.cart = store.cart.map((cartItem) =>
    cartItem.id === currentCartItemId
      ? { ...cartItem, quantity: cartItem.quantity + 1 }
      : cartItem
  );
  store.products = store.products.map((product) =>
    product.id === currentCartItemId
      ? { ...product, quantity: product.quantity - 1 }
      : product
  );

  const newCartItem = store.cart.find((item) => item.id === currentCartItemId);

  if (!newCartItem) return;

  const cartItemText = document.getElementById(
    `cart-item-${currentCartItemId}`
  );
  if (!cartItemText) return;

  cartItemText.textContent = `${newCartItem.name} - ${newCartItem.price}원 x ${newCartItem.quantity}`;
};

const decreaseQuantity = (currentCartItemId) => {
  if (!currentCartItemId) return;

  const currentCartItem = store.cart.find(
    (item) => item.id === currentCartItemId
  );

  if (!currentCartItem) return;

  if (currentCartItem.quantity - 1 <= 0) {
    removeItem(currentCartItemId, currentCartItem.quantity);
    return;
  }

  store.cart = store.cart.map((cartItem) =>
    cartItem.id === currentCartItemId
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
  store.products = store.products.map((product) =>
    product.id === currentCartItemId
      ? { ...product, quantity: product.quantity + 1 }
      : product
  );

  const newCartItem = store.cart.find((item) => item.id === currentCartItemId);
  if (!newCartItem) return;

  const cartItemText = document.getElementById(
    `cart-item-${currentCartItemId}`
  );
  if (!cartItemText) return;

  cartItemText.textContent = `${newCartItem.name} - ${newCartItem.price}원 x ${newCartItem.quantity}`;
};

export function setupCartListListener() {
  const cartItemsElement = document.getElementById("cart-items");
  if (!cartItemsElement) return;

  cartItemsElement.addEventListener("click", (event) => {
    if (!event?.target) return;

    const target = event.target;
    const buttonElement = target.closest("[data-product-id]");

    if (!buttonElement) return;

    const currentCartItemId = buttonElement.dataset.productId;

    if (!currentCartItemId) return;

    const currentCartItem = store.cart.find(
      (item) => item.id === currentCartItemId
    );

    if (!currentCartItem) return;

    if (target.classList.contains("remove-item")) {
      removeItem(currentCartItemId, currentCartItem.quantity);
    } else if (target.classList.contains("quantity-change")) {
      const quantityDelta = parseInt(target.dataset.change);
      if (quantityDelta > 0) {
        increaseQuantity(currentCartItemId);
      } else {
        decreaseQuantity(currentCartItemId);
      }
    }

    renderCartSummary();
  });
}
