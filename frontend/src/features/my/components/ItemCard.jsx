import { Link } from "react-router-dom";

const ItemCard = ({ to, children }) => (
  <Link
    to={to}
    className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-primary transition-colors"
  >
    {children}
  </Link>
);

export default ItemCard;
