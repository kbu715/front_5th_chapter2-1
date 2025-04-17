import AddToCart from "./AddToCart";
import CartList from "./CartList";
import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import ProductSelect from "./ProductSelect";
import StockStatus from "./StockStatus";
import { INITIAL_PRODUCTS } from "../lib/constants";
type Store = {
  cart: Product[];
  products: Product[];
};

export const store: Store = {
  cart: [],
  products: INITIAL_PRODUCTS
};

const CartWrapper = () => {
  return (
    <div
      id="wrapper"
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
    >
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartList>
        {store.cart.map((item) => (
          <CartItem
            id={item.id}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
          />
        ))}
      </CartList>
      <CartTotal totalAmount={0} discountRate={0} />
      <ProductSelect />
      <AddToCart />
      <StockStatus />
    </div>
  );
};

export default CartWrapper;
