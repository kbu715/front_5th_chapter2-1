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

export { createElement, getDiscountedPrice, setupDiscountTimer };
