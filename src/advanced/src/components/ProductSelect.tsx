import { useCallback, useMemo, memo } from "react";
import { useCart } from "../contexts/CartProvider";

const ProductSelect = memo(() => {
  const { state, setLastSelectedProductId } = useCart();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLastSelectedProductId(e.target.value);
    },
    [setLastSelectedProductId]
  );

  const options = useMemo(
    () =>
      state.products.map((product) => (
        <option
          key={product.id}
          value={product.id}
          disabled={product.quantity === 0}
        >
          {product.name} - {product.price}원
        </option>
      )),
    [state.products]
  );

  return (
    <select
      id="product-select"
      className="border rounded p-2 mr-2"
      onChange={handleChange}
    >
      {options}
    </select>
  );
});

export default ProductSelect;

ProductSelect.displayName = "ProductSelect";
