import { FLASH_SALE_INTERVAL } from "../lib/constants";
import { useCart } from "../contexts/CartProvider";
import { FLASH_SALE_DISCOUNT_RATE } from "../lib/constants";
import { getDiscountAlertMessage, getDiscountedPrice } from "../util/helpers";
import { useSaleTimer } from "./useSaleTimer";

export const useFlashSaleTimer = () => {
  const { state, setProducts } = useCart();
  const { products } = state;

  const updateProductPrice = (
    product: Product,
    discountRate: number,
    showAlert: boolean = true
  ) => {
    const updatedProducts = products.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          price: Math.round(getDiscountedPrice(p.price, discountRate))
        };
      }
      return p;
    });

    setProducts(updatedProducts);

    if (showAlert) {
      alert(getDiscountAlertMessage(product, discountRate));
    }
  };

  useSaleTimer(FLASH_SALE_INTERVAL, Math.random() * 10000, () => {
    const randomIndex = Math.floor(Math.random() * products.length);
    const randomProduct = products[randomIndex];
    if (Math.random() < 0.3) {
      updateProductPrice(randomProduct, FLASH_SALE_DISCOUNT_RATE, true);
    }
  });
};
