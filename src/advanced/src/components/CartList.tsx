type Props = {
  children: React.ReactNode;
};

const CartContainer = ({ children }: Props) => {
  return <div id="cart-items">{children}</div>;
};

export default CartContainer;
