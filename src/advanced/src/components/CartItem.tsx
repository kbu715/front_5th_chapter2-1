import { memo } from "react";

type Props = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const CartItem = memo(({ id, name, price, quantity }: Props) => {
  return (
    <div id={id} className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-700" id={`cart-item-${id}`}>
        {name} - {price}원 x {quantity}
      </span>
      <div>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1 quantity-change"
          data-product-id={id}
          data-change="-1"
        >
          -
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1 quantity-change"
          data-product-id={id}
          data-change="1"
        >
          +
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded remove-item"
          data-product-id={id}
        >
          삭제
        </button>
      </div>
    </div>
  );
});

export default CartItem;

CartItem.displayName = "CartItem";
