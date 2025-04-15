import { POINTS_PER_AMOUNT } from "../lib/constants.js";

function LoyaltyPoints({ totalAmount }) {
  const points = Math.floor(totalAmount / POINTS_PER_AMOUNT);

  return `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${points})</span>`;
}

export default LoyaltyPoints;
