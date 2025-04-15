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
  const selectElem = document.getElementById("product-select");
  selectElem.value = store.lastSelectedProductId;

  selectElem.innerHTML = ProductSelect({
    products,
  });
};
