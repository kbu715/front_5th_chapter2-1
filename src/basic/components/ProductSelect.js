import { store } from "../store";

function ProductSelect({ products }) {
  return `
    <select id="product-select" class="border rounded p-2 mr-2">
      ${products.map((product) => `<option value="${product.id}" ${product.quantity === 0 ? "disabled" : ""}>${product.name} - ${product.price}원</option>`).join("")}
    </select>
  `;
}

export default ProductSelect;

export const renderProductSelect = (products) => {
  const productSelect = document.getElementById("product-select");
  productSelect.innerHTML = products
    .map(
      (product) =>
        `<option value="${product.id}" ${product.quantity === 0 ? "disabled" : ""}>${product.name} - ${product.price}원</option>`
    )
    .join("");
};

export const setupProductSelectListener = () => {
  const productSelect = document.getElementById("product-select");

  if (!productSelect) return;

  productSelect.addEventListener("change", (e) => {
    store.lastSelectedProductId = e.target.value;
  });
};
