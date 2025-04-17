import { useCart } from "../contexts/CartProvider";
import { memo } from "react";

const AddToCart = memo(() => {
  const { state, setCart, setProducts } = useCart();

  const handleAddToCart = () => {
    const currentProduct = state.products.find(
      (product) => product.id === state.lastSelectedProductId
    );

    if (!currentProduct || currentProduct.quantity <= 0) {
      window.alert("재고가 부족합니다.");
      return;
    }

    const existingCartItem = state.cart.find(
      (item) => item.id === currentProduct.id
    );

    if (existingCartItem) {
      setCart(
        state.cart.map((item) =>
          item.id === currentProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...state.cart, { ...currentProduct, quantity: 1 }]);
    }

    setProducts(
      state.products.map((product) =>
        product.id === currentProduct.id
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={handleAddToCart}
    >
      추가
    </button>
  );
});

export default AddToCart;

AddToCart.displayName = "AddToCart";
