// 상품 데이터
const initialProducts = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

const initialLastSelectedProductId = initialProducts[0].id;

export const store = {
  lastSelectedProductId: initialLastSelectedProductId,
  loyaltyPoints: 0,
  totalAmount: 0,
  products: [...initialProducts],
  //TODO: 카트에 추가된 상품 목록
  cart: [],
};
