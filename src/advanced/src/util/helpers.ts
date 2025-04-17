import { FLASH_SALE_DISCOUNT_RATE } from "../lib/constants";

const getDiscountedPrice = (amount: number, rate: number) =>
  amount * (1 - rate);

const setupDiscountTimer = (
  interval: number,
  delay: number,
  callback: () => void
) => {
  setTimeout(() => setInterval(callback, interval), delay);
};

// 알림 메시지 생성 함수
const getDiscountAlertMessage = (product: Product, discountRate: number) => {
  return `${product.name}${
    discountRate === FLASH_SALE_DISCOUNT_RATE
      ? `이(가) ${discountRate * 100}% 할인 중입니다!`
      : `은(는) 어떠세요? 지금 구매하시면 ${discountRate * 100}% 추가 할인!`
  }`;
};

export { getDiscountedPrice, setupDiscountTimer, getDiscountAlertMessage };
