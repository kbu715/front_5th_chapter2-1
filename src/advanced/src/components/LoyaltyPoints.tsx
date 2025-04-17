import { POINTS_PER_AMOUNT } from "../lib/constants";

type Props = {
  totalAmount: number;
};

const LoyaltyPoints = ({ totalAmount }: Props) => {
  const points = Math.floor(totalAmount / POINTS_PER_AMOUNT);

  return (
    <span id="loyalty-points" className="text-blue-500 ml-2">
      (포인트: {points})
    </span>
  );
};

export default LoyaltyPoints;
