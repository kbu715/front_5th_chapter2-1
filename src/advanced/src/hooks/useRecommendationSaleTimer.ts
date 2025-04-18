import { useCart } from "../contexts/CartProvider";
import { getDiscountAlertMessage, getDiscountedPrice } from "../util/helpers";
import {
  RECOMMENDATION_INTERVAL,
  RECOMMENDATION_DISCOUNT_RATE
} from "../lib/constants";
import { useSaleTimer } from "./useSaleTimer";

export const useRecommendationSaleTimer = () => {
  const { state, setProducts } = useCart();
  const { products, lastSelectedProductId } = state;

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

  useSaleTimer(RECOMMENDATION_INTERVAL, Math.random() * 20000, () => {
    if (lastSelectedProductId) {
      const recommendedProduct = products.find(
        (product) =>
          product.id !== lastSelectedProductId && product.quantity > 0
      );

      if (recommendedProduct) {
        updateProductPrice(
          recommendedProduct,
          RECOMMENDATION_DISCOUNT_RATE,
          true
        );
      }
    }
  });
};
