import Button from "./Button.tsx";
import sport from "../assets/images/category/sport.png";

export interface CategoryCardProps {
  name: string;
}

const Card: React.FC<CategoryCardProps> = ({ name }) => {
  return (
    <div className="relative w-56 h-72 rounded-lg overflow-hidden shadow-lg">
      <img src={sport} alt={name} className="w-full h-full object-cover" />
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <Button text={name} to="/categories" variant="dark" />
      </div>
    </div>
  );
};

export default Card;
