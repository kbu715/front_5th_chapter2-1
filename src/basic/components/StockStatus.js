import { LOW_STOCK_THRESHOLD } from "../lib/constants";

function StockStatus({ products }) {
  const lowStockProducts = products
    .filter((product) => product.q < LOW_STOCK_THRESHOLD)
    .map(
      (product) =>
        `${product.name}: ${product.q > 0 ? `재고 부족 (${product.q}개 남음)` : "품절"}`
    );

  return `
      <div id="stock-status" class="text-sm text-gray-500 mt-2">
        ${lowStockProducts.join("\n")}
      </div>
    `;
}

export default StockStatus;

export const renderStockStatus = (products) => {
  document.getElementById("stock-status").innerHTML = StockStatus({
    products,
  });
};
