import { LOW_STOCK_THRESHOLD } from "../lib/constants";

function StockStatus({ products }) {
  const lowStockProducts = products
    .filter((product) => product.quantity < LOW_STOCK_THRESHOLD)
    .map(
      (product) =>
        `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절"}`
    );

  return `
      <div id="stock-status" class="text-sm text-gray-500 mt-2 whitespace-pre-line">
        ${lowStockProducts.join("\n")}
      </div>
    `;
}

export default StockStatus;

export const renderStockStatus = (products) => {
  const stockStatusElement = document.getElementById("stock-status");

  if (!stockStatusElement) return;

  const lowStockProducts = products
    .filter((product) => product.quantity < LOW_STOCK_THRESHOLD)
    .map(
      (product) =>
        `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절"}`
    );

  stockStatusElement.innerHTML = lowStockProducts.join("\n");
};
