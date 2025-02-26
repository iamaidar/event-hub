import Button from "./Button.tsx";
interface CategoryCardProps {
    title: string;
    image: string;
    link: string;
}

export default function CategoryCard({ title, image, link }: CategoryCardProps) {
    return (
        <div className="relative w-56 h-72 rounded-lg overflow-hidden shadow-lg">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <Button text={title} to={link} variant="dark" />
            </div>
        </div>
    );
}