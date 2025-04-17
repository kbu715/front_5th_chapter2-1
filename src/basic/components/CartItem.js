function CartItem({ id, name, price, quantity }) {
  return `
      <div id="${id}" class="flex justify-between items-center mb-2">
        <span style="font-size: 14px; color: #333;" id="cart-item-${id}">${name} - ${price}원 x ${quantity}</span>
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
