import AddToCart, { renderAddToCart } from "./components/AddToCart";
import CartList, { renderCartList } from "./components/CartList";
import CartTotal, {
  calculateCartTotal,
  renderCartTotal,
} from "./components/CartTotal";
import ProductSelect, { renderProductSelect } from "./components/ProductSelect";
import StockStatus, { renderStockStatus } from "./components/StockStatus";
import {
  FLASH_SALE_DISCOUNT_RATE,
  FLASH_SALE_INTERVAL,
  RECOMMENDATION_DISCOUNT_RATE,
  RECOMMENDATION_INTERVAL,
} from "./lib/constants";

import { store } from "./store";
import {
  getDiscountAlertMessage,
  getDiscountedPrice,
  setupDiscountTimer,
} from "./util/helpers";

const root = document.getElementById("app");

const updateProductPrice = (product, discountRate, showAlert = true) => {
  if (product.quantity <= 0) return;

  const updatedProduct = {
    ...product,
    price: Math.round(getDiscountedPrice(product.price, discountRate)),
  };

  if (showAlert) {
    alert(getDiscountAlertMessage(product, discountRate));
  }

  store.products = store.products.map((product) =>
    product.id === updatedProduct.id ? updatedProduct : product
  );

  renderProductSelect(store.products);
};

const main = () => {
  root.innerHTML = `
    <div id="container" class="bg-gray-100 p-8">
      <div id="wrapper" class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        ${CartList()}
        ${CartTotal({ totalAmount: store.totalAmount, discountRate: 0 })}
        ${ProductSelect({ products: store.products })}
        ${AddToCart()}
        ${StockStatus({ products: store.products })}
      </div>
    </div>
  `;

  renderCartList();
  renderProductSelect(store.products);
  calculateCart();
  renderAddToCart();

  // 번개세일 타이머 설정
  setupDiscountTimer(FLASH_SALE_INTERVAL, Math.random() * 10000, () => {
    const randomIndex = Math.floor(Math.random() * store.products.length);
    const randomProduct = store.products[randomIndex];
    if (Math.random() < 0.3) {
      updateProductPrice(randomProduct, FLASH_SALE_DISCOUNT_RATE);
    }
  });

  // 추천 상품 타이머 설정
  setupDiscountTimer(RECOMMENDATION_INTERVAL, Math.random() * 20000, () => {
    if (store.lastSelectedProductId) {
      const recommendedProduct = store.products.find(
        (product) =>
          product.id !== store.lastSelectedProductId && product.quantity > 0
      );
      if (recommendedProduct) {
        updateProductPrice(recommendedProduct, RECOMMENDATION_DISCOUNT_RATE);
      }
    }
  });
};

// 장바구니 계산 결과 표시
export const calculateCart = () => {
  const { totalAmount, discountRate } = calculateCartTotal(
    document.getElementById("cart-items").children,
    store.products
  );

  store.totalAmount = totalAmount;

  renderCartTotal(totalAmount, discountRate);
  renderStockStatus(store.products);
};

main();
