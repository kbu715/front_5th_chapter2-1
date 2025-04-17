import AddToCart from "./AddToCart";
import CartList from "./CartList";
import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import ProductSelect from "./ProductSelect";
import StockStatus from "./StockStatus";
import { useCart } from "../contexts/CartProvider";
import { useFlashSaleTimer } from "../hooks/useFlashSaleTimer";
import { useRecommendationSaleTimer } from "../hooks/useRecommendationSaleTimer";

const CartWrapper = () => {
  const { state } = useCart();

  useFlashSaleTimer();
  useRecommendationSaleTimer();

  return (
    <div
      id="wrapper"
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
    >
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartList>
        {state.cart.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
          />
        ))}
      </CartList>
      <CartTotal />
      <ProductSelect />
      <AddToCart />
      <StockStatus />
    </div>
  );
};

export default CartWrapper;

CartWrapper.displayName = "CartWrapper";
