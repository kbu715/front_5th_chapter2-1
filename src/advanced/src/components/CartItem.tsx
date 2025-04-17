type Props = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const CartItem = ({ id, name, price, quantity }: Props) => {
  return (
    <div id={id} className="flex justify-between items-center mb-2">
      <span style={{ fontSize: "14px", color: "#333" }} id={`cart-item-${id}`}>
        {name} - {price}원 x {quantity}
      </span>
      <div>
        <button
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            marginRight: "4px"
          }}
          data-product-id={id}
          data-change="-1"
          className="quantity-change"
        >
          -
        </button>
        <button
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            marginRight: "4px"
          }}
          data-product-id={id}
          data-change="1"
          className="quantity-change"
        >
          +
        </button>
        <button
          style={{
            background: "#ef4444",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px"
          }}
          data-product-id={id}
          className="remove-item"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
