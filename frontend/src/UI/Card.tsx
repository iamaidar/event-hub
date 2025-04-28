import Button from "./Button.tsx";

export interface CategoryCardProps {
    id: number;
    name: string;
    image_base64?: string| null;
}

const Card: React.FC<CategoryCardProps> = ({ id, name, image_base64 }) => {
    return (
        <div className="relative w-56 h-72 rounded-lg overflow-hidden shadow-lg">
            <img
                src={image_base64 || "https://via.placeholder.com/50"}
                alt={name}
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <Button
                    text={name}
                    to={`/categories/${id}`} // 🚀 Динамическая ссылка на категорию
                    variant="dark"
                />
            </div>
        </div>
    );
};

export default Card;
