// 상수 정의
const BULK_PURCHASE_THRESHOLD = 30;
const BULK_PURCHASE_ITEM_THRESHOLD = 10;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const POINTS_PER_AMOUNT = 1000;
const LOW_STOCK_THRESHOLD = 5;
const FLASH_SALE_INTERVAL = 30000;
const FLASH_SALE_DISCOUNT_RATE = 0.2;
const RECOMMENDATION_INTERVAL = 60000;
const RECOMMENDATION_DISCOUNT_RATE = 0.05;

const PRODUCT_BULK_DISCOUNTS = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

// 상품 데이터
const initialProducts = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

// 헬퍼 함수 모음
const createElement = (tag, props = {}) => {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value) {
      element[key] = value;
    }
  }

  return element;
};

const getDiscountedPrice = (amount, rate) => amount * (1 - rate);

const setupDiscountTimer = (interval, delay, callback) => {
  setTimeout(() => setInterval(callback, interval), delay);
};

// DOM Layout 구성
const root = document.getElementById("app");
const container = createElement("div", { className: "bg-gray-100 p-8" });
const wrapper = createElement("div", {
  className:
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
});
const title = createElement("h1", {
  className: "text-2xl font-bold mb-4",
  textContent: "장바구니",
});

// DOM elements
const elements = {
  cartItemsContainer: null,
  cartTotal: null,
  productSelect: null,
  addToCartBtn: null,
  stockStatus: null,
};

// Application state
const state = {
  lastSelectedProductId: undefined,
  loyaltyPoints: 0,
  totalAmount: 0,
  cartItemCount: 0,
  products: [...initialProducts],
};

// 알림 메시지 생성 함수
const getDiscountAlertMessage = (product, discountRate) => {
  return `${product.name}${
    discountRate === FLASH_SALE_DISCOUNT_RATE
      ? `이(가) ${discountRate * 100}% 할인 중입니다!`
      : `은(는) 어떠세요? 지금 구매하시면 ${discountRate * 100}% 추가 할인!`
  }`;
};

// 할인율 적용 상품 가격 계산 함수
const calculateNewProductPrice = (product, discountRate) => {
  if (product.q > 0) {
    return {
      ...product,
      val: Math.round(getDiscountedPrice(product.val, discountRate)),
    };
  }
  return product;
};

// 상품 가격 업데이트 함수
const updateProductPrice = (product, discountRate, showAlert = true) => {
  const updatedProduct = calculateNewProductPrice(product, discountRate);

  if (product.q > 0) {
    if (showAlert) alert(getDiscountAlertMessage(product, discountRate));

    state.products = state.products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p,
    );

    updateProductOptions();
  }
};

// 메인 함수 - DOM 구성 및 이벤트 설정
const main = () => {
  elements.cartItemsContainer = createElement("div", { id: "cart-items" });

  elements.cartTotal = createElement("div", {
    id: "cart-total",
    className: "text-xl font-bold my-4",
  });

  elements.productSelect = createElement("select", {
    id: "product-select",
    className: "border rounded p-2 mr-2",
  });

  elements.addToCartBtn = createElement("button", {
    id: "add-to-cart",
    className: "bg-blue-500 text-white px-4 py-2 rounded",
    textContent: "추가",
  });

  elements.stockStatus = createElement("div", {
    id: "stock-status",
    className: "text-sm text-gray-500 mt-2",
  });

  const domElements = [
    title,
    elements.cartItemsContainer,
    elements.cartTotal,
    elements.productSelect,
    elements.addToCartBtn,
    elements.stockStatus,
  ];

  for (const element of domElements) {
    wrapper.appendChild(element);
  }

  container.appendChild(wrapper);
  root.appendChild(container);

  updateProductOptions();
  calculateCart();

  // 번개세일 타이머 설정
  setupDiscountTimer(FLASH_SALE_INTERVAL, Math.random() * 10000, () => {
    const randomProduct =
      state.products[Math.floor(Math.random() * state.products.length)];
    if (Math.random() < 0.3) {
      updateProductPrice(randomProduct, FLASH_SALE_DISCOUNT_RATE);
    }
  });

  // 추천 상품 타이머 설정
  setupDiscountTimer(RECOMMENDATION_INTERVAL, Math.random() * 20000, () => {
    if (state.lastSelectedProductId) {
      const recommendedProduct = state.products.find(
        (product) =>
          product.id !== state.lastSelectedProductId && product.q > 0,
      );
      if (recommendedProduct) {
        updateProductPrice(recommendedProduct, RECOMMENDATION_DISCOUNT_RATE);
      }
    }
  });
};

// 상품 선택 옵션 업데이트 함수
const createProductOption = (product) => {
  const option = createElement("option", {
    value: product.id,
    textContent: `${product.name} - ${product.val}원`,
    disabled: product.q === 0,
  });
  return option;
};

// 상품 선택 옵션 업데이트
const updateProductOptions = () => {
  elements.productSelect.innerHTML = "";
  for (const product of state.products) {
    elements.productSelect.appendChild(createProductOption(product));
  }
};

// 장바구니 계산 함수
const calculateCartTotals = (cartItems, products) => {
  let totalAmount = 0;
  let cartItemCount = 0;
  let subTotalAmount = 0;

  for (const item of Array.from(cartItems)) {
    const currentProduct = products.find((product) => product.id === item.id);
    const quantity = parseInt(
      item.querySelector("span").textContent.split("x ")[1],
    );
    const currentProductPrice = currentProduct.val * quantity;
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

  return { totalAmount, discountRate, cartItemCount };
};

// 장바구니 계산 결과 표시
const calculateCart = () => {
  const { totalAmount, discountRate, cartItemCount } = calculateCartTotals(
    elements.cartItemsContainer.children,
    state.products,
  );

  state.totalAmount = totalAmount;
  state.cartItemCount = cartItemCount;

  elements.cartTotal.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (discountRate > 0) {
    const discountLabel = createElement("span", {
      className: "text-green-500 ml-2",
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });
    elements.cartTotal.appendChild(discountLabel);
  }

  updateStockStatus();
  renderLoyaltyPoints();
};

// 적립 포인트 계산 함수
const calculateLoyaltyPoints = (totalAmount) => {
  return Math.floor(totalAmount / POINTS_PER_AMOUNT);
};

// 적립 포인트 표시 업데이트
const renderLoyaltyPoints = () => {
  state.loyaltyPoints = calculateLoyaltyPoints(state.totalAmount);
  let pointsTag = document.getElementById("loyalty-points");

  if (!pointsTag) {
    pointsTag = createElement("span", {
      id: "loyalty-points",
      className: "text-blue-500 ml-2",
    });
    elements.cartTotal.appendChild(pointsTag);
  }

  pointsTag.textContent = `(포인트: ${state.loyaltyPoints})`;
};

// 재고 상태 메시지 생성 함수
const getStockStatusMessage = (products) => {
  const lowStockProducts = [];
  for (const product of products) {
    if (product.q < LOW_STOCK_THRESHOLD) {
      lowStockProducts.push(
        `${product.name}: ${product.q > 0 ? `재고 부족 (${product.q}개 남음)` : "품절"}`,
      );
    }
  }
  return lowStockProducts.join("\n");
};

// 재고 상태 표시 업데이트
const updateStockStatus = () => {
  elements.stockStatus.textContent = getStockStatusMessage(state.products);
};

// 장바구니 아이템 생성 함수
const createCartItem = (product) => {
  const newProduct = createElement("div", {
    id: product.id,
    className: "flex justify-between items-center mb-2",
  });

  const buttonStyle =
    "background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 4px;";
  const deleteButtonStyle =
    "background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px;";

  newProduct.innerHTML = `
    <span style="font-size: 14px; color: #333;">
      ${product.name} - ${product.val}원 x 1
    </span>
    <div>
      <button style="${buttonStyle}" data-product-id="${product.id}" data-change="-1" class="quantity-change">-</button>
      <button style="${buttonStyle}" data-product-id="${product.id}" data-change="1" class="quantity-change">+</button>
      <button style="${deleteButtonStyle}" data-product-id="${product.id}" class="remove-item">삭제</button>
    </div>
  `;
  return newProduct;
};

//
const calculateQuantityChange = (
  currentQuantity,
  newQuantityValue,
  maxQuantity,
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
const handleQuantityChange = (
  productElement,
  currentProduct,
  newQuantityValue,
) => {
  const currentQuantity = parseInt(
    productElement.querySelector("span").textContent.split("x ")[1],
  );

  const result = calculateQuantityChange(
    currentQuantity,
    newQuantityValue,
    currentProduct.q + currentQuantity,
  );

  const { isSuccess, newQuantity, shouldRemove } = result;

  if (isSuccess) {
    if (shouldRemove) {
      productElement.remove();
    } else {
      productElement.querySelector("span").textContent =
        `${productElement.querySelector("span").textContent.split("x ")[0]}x ${newQuantity}`;
    }
    currentProduct.q -= newQuantityValue;
    return true;
  } else {
    alert("재고가 부족합니다.");
    return false;
  }
};

main();

// 장바구니 추가 버튼 이벤트 핸들러
elements.addToCartBtn.addEventListener("click", () => {
  state.lastSelectedProductId = elements.productSelect.value;
  const productToAddToCart = state.products.find(
    (product) => product.id === state.lastSelectedProductId,
  );

  if (productToAddToCart && productToAddToCart.q > 0) {
    const existingProduct = document.getElementById(productToAddToCart.id);

    if (existingProduct) {
      if (handleQuantityChange(existingProduct, productToAddToCart, 1)) {
        calculateCart();
      }
    } else {
      elements.cartItemsContainer.appendChild(
        createCartItem(productToAddToCart),
      );
      productToAddToCart.q--;
      calculateCart();
    }
  }
});

// 장바구니 아이템 수량 변경 및 삭제 이벤트 핸들러 (이벤트 위임)
elements.cartItemsContainer.addEventListener("click", (event) => {
  const target = event.target;

  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    const productId = target.dataset.productId;
    const productElement = document.getElementById(productId);
    const currentProduct = state.products.find(
      (product) => product.id === productId,
    );

    if (target.classList.contains("quantity-change")) {
      if (
        handleQuantityChange(
          productElement,
          currentProduct,
          parseInt(target.dataset.change),
        )
      ) {
        calculateCart();
      }
    } else if (target.classList.contains("remove-item")) {
      const removeQuantity = parseInt(
        productElement.querySelector("span").textContent.split("x ")[1],
      );
      currentProduct.q += removeQuantity;
      productElement.remove();
      calculateCart();
    }
  }
});
