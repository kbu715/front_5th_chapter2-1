import LoyaltyPoints from "./LoyaltyPoints";

type Props = {
  totalAmount: number;
  discountRate: number;
};

const CartTotal = ({ totalAmount, discountRate }: Props) => {
  return (
    <div className="text-xl font-bold my-4" id="cart-total">
      총액: {Math.round(totalAmount)}원
      {discountRate > 0 ? (
        <span className="text-green-500 ml-2">
          (${(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      ) : null}
      {LoyaltyPoints({ totalAmount })}
    </div>
  );
};

export default CartTotal;
