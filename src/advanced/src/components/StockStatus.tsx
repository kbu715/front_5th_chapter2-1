import { LOW_STOCK_THRESHOLD } from "../lib/constants";
import { useCart } from "../contexts/CartProvider";
import { useMemo, memo } from "react";

const StockStatus = memo(() => {
  const { state } = useCart();

  const lowStockProducts = useMemo(
    () =>
      state.products
        .filter((product) => product.quantity < LOW_STOCK_THRESHOLD)
        .map(
          (product) =>
            `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절"}`
        )
        .join("\n"),
    [state.products]
  );

  return (
    <div
      id="stock-status"
      className="text-sm text-gray-500 mt-2 whitespace-pre-line"
    >
      {lowStockProducts}
    </div>
  );
});

export default StockStatus;

StockStatus.displayName = "StockStatus";
