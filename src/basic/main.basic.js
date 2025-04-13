// 상품 데이터
const products = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

// DOM Layout 구성
const root = document.getElementById("app");
const container = document.createElement("div");
const wrapper = document.createElement("div");
const title = document.createElement("h1");

// 전역 변수 선언
let productSelect, addToCartBtn, cartItemsContainer, cartTotal, stockStatus;
let lastSelectedProductId = undefined;
let loyaltyPoints = 0;
let totalAmount = 0;
let cartItemCount = 0;

// 메인 함수 - DOM 초기화 및 이벤트 설정
const main = () => {
  cartItemsContainer = document.createElement("div");
  cartTotal = document.createElement("div");
  productSelect = document.createElement("select");
  addToCartBtn = document.createElement("button");
  stockStatus = document.createElement("div");

  cartItemsContainer.id = "cart-items";
  cartTotal.id = "cart-total";
  productSelect.id = "product-select";
  addToCartBtn.id = "add-to-cart";
  stockStatus.id = "stock-status";

  container.className = "bg-gray-100 p-8";
  wrapper.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  title.className = "text-2xl font-bold mb-4";
  cartTotal.className = "text-xl font-bold my-4";
  productSelect.className = "border rounded p-2 mr-2";
  addToCartBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockStatus.className = "text-sm text-gray-500 mt-2";

  title.textContent = "장바구니";
  addToCartBtn.textContent = "추가";

  updateProductOptions();

  wrapper.appendChild(title);
  wrapper.appendChild(cartItemsContainer);
  wrapper.appendChild(cartTotal);
  wrapper.appendChild(productSelect);
  wrapper.appendChild(addToCartBtn);
  wrapper.appendChild(stockStatus);

  container.appendChild(wrapper);
  root.appendChild(container);

  calculateCart();

  // 번개세일 타이머 설정
  setTimeout(() => {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * products.length);
      const randomProduct = products[randomIndex];

      if (Math.random() < 0.3 && randomProduct.q > 0) {
        randomProduct.val = Math.round(randomProduct.val * 0.8);

        alert(`번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);

        updateProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 추천 상품 타이머 설정
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProductId) {
        const recommendedProduct = products.find((product) => {
          return product.id !== lastSelectedProductId && product.q > 0;
        });

        if (recommendedProduct) {
          alert(
            `${recommendedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
          );

          recommendedProduct.val = Math.round(recommendedProduct.val * 0.95);

          updateProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

// 상품 선택 옵션 업데이트
const updateProductOptions = () => {
  productSelect.innerHTML = "";

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} - ${product.val}원`;

    if (product.q === 0) {
      option.disabled = true;
    }

    productSelect.appendChild(option);
  });
};

// 장바구니 계산 함수
const calculateCart = () => {
  const cartItems = cartItemsContainer.children;
  totalAmount = 0;
  cartItemCount = 0;
  let subTotalAmount = 0;

  // 각 상품별 수량 및 할인율 계산
  Array.from(cartItems).forEach((item) => {
    const currentProduct = products.find((product) => product.id === item.id);
    const quantity = parseInt(
      item.querySelector("span").textContent.split("x ")[1]
    );
    const currentProductPrice = currentProduct.val * quantity;
    let discountRate = 0;

    cartItemCount += quantity;
    subTotalAmount += currentProductPrice;

    // 10개 이상 구매시 상품별 할인율 적용
    if (quantity >= 10) {
      switch (currentProduct.id) {
        case "p1":
          discountRate = 0.1;
          break;
        case "p2":
          discountRate = 0.15;
          break;
        case "p3":
          discountRate = 0.2;
          break;
        case "p4":
          discountRate = 0.05;
          break;
        case "p5":
          discountRate = 0.25;
          break;
      }
    }

    totalAmount += currentProductPrice * (1 - discountRate);
  });

  let discountRate = 0;

  // 대량 구매 할인 적용 (30개 이상)
  if (cartItemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotalAmount - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotalAmount * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotalAmount - totalAmount) / subTotalAmount;
    }
  } else {
    discountRate = (subTotalAmount - totalAmount) / subTotalAmount;
  }

  // 화요일 추가 할인
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  // 총액 표시 업데이트
  cartTotal.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (discountRate > 0) {
    const discountLabel = document.createElement("span");
    discountLabel.className = "text-green-500 ml-2";
    discountLabel.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    cartTotal.appendChild(discountLabel);
  }

  updateStockStatus();
  renderLoyaltyPoints();
};

// 적립 포인트 표시 업데이트
const renderLoyaltyPoints = () => {
  loyaltyPoints = Math.floor(totalAmount / 1000);
  let pointsTag = document.getElementById("loyalty-points");

  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    cartTotal.appendChild(pointsTag);
  }

  pointsTag.textContent = `(포인트: ${loyaltyPoints})`;
};

// 재고 상태 표시 업데이트
const updateStockStatus = () => {
  let stockStatusText = "";

  products.forEach((product) => {
    if (product.q < 5) {
      stockStatusText += `${product.name}: ${
        product.q > 0 ? `재고 부족 (${product.q}개 남음)` : "품절"
      }\n`;
    }
  });

  stockStatus.textContent = stockStatusText;
};

main();

// 장바구니 추가 버튼 이벤트 핸들러
addToCartBtn.addEventListener("click", () => {
  lastSelectedProductId = productSelect.value;
  const productToAddToCart = products.find(
    (product) => product.id === lastSelectedProductId
  );

  if (productToAddToCart && productToAddToCart.q > 0) {
    const product = document.getElementById(productToAddToCart.id);

    if (product) {
      const newQuantity =
        parseInt(product.querySelector("span").textContent.split("x ")[1]) + 1;

      if (newQuantity <= productToAddToCart.q) {
        product.querySelector("span").textContent =
          `${productToAddToCart.name} - ${productToAddToCart.val}원 x ${newQuantity}`;
        productToAddToCart.q--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newProduct = document.createElement("div");
      newProduct.id = productToAddToCart.id;
      newProduct.className = "flex justify-between items-center mb-2";
      newProduct.innerHTML = `
        <span style="font-size: 14px; color: #333;">
          ${productToAddToCart.name} - ${productToAddToCart.val}원 x 1
        </span>
        <div>
          <button 
            style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 4px;" 
            data-product-id="${productToAddToCart.id}" 
            data-change="-1" 
            class="quantity-change">-</button>
          <button 
            style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 4px;" 
            data-product-id="${productToAddToCart.id}" 
            data-change="1" 
            class="quantity-change">+</button>
          <button 
            style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px;" 
            data-product-id="${productToAddToCart.id}" 
            class="remove-item">삭제</button>
        </div>
      `;
      cartItemsContainer.appendChild(newProduct);
      productToAddToCart.q--;
    }

    calculateCart();
  }
});

// 장바구니 아이템 수량 변경 및 삭제 이벤트 핸들러
cartItemsContainer.addEventListener("click", (event) => {
  const target = event.target;

  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    const productId = target.dataset.productId;
    const productElement = document.getElementById(productId);
    const currentProduct = products.find((product) => product.id === productId);

    if (target.classList.contains("quantity-change")) {
      const newQuantityValue = parseInt(target.dataset.change);
      const currentQuantity = parseInt(
        productElement.querySelector("span").textContent.split("x ")[1]
      );
      const newQuantity = currentQuantity + newQuantityValue;

      if (
        newQuantity > 0 &&
        newQuantity <= currentProduct.q + currentQuantity
      ) {
        productElement.querySelector("span").textContent =
          `${productElement.querySelector("span").textContent.split("x ")[0]}x ${newQuantity}`;
        currentProduct.q -= newQuantityValue;
      } else if (newQuantity <= 0) {
        productElement.remove();
        currentProduct.q -= newQuantityValue;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      const removeQuantity = parseInt(
        productElement.querySelector("span").textContent.split("x ")[1]
      );
      currentProduct.q += removeQuantity;
      productElement.remove();
    }

    calculateCart();
  }
});
