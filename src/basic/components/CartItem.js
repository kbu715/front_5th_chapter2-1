function CartItem({ id, name, val, q }) {
  return `
    <div id="${id}" class="flex justify-between items-center mb-2">
      <span style="font-size: 14px; color: #333;">${name} - ${val}원 x ${q}</span>
      <div>
        <button 
          style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 4px;"
          data-product-id="${id}" 
          data-change="-1" 
          class="quantity-change"
        >-</button>
        <button 
          style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 4px;"
          data-product-id="${id}" 
          data-change="1" 
          class="quantity-change"
        >+</button>
        <button 
          style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px;"
          data-product-id="${id}" 
          class="remove-item"
        >삭제</button>
      </div>
    </div>
  `;
}

export default CartItem;

export const renderCartItem = (product) => {
  document.getElementById("cart-items").innerHTML += CartItem({
    id: product.id,
    name: product.name,
    val: product.val,
    q: product.q,
  });
};
