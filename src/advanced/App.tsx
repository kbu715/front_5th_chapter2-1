import CartWrapper from "./src/components/CartWrapper";
import { CartProvider } from "./src/contexts/CartProvider";

export function App() {
  return (
    <div id="container" className="bg-gray-100 p-8">
      <CartProvider>
        <CartWrapper />
      </CartProvider>
    </div>
  );
}
