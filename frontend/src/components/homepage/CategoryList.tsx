import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard.tsx";
import { CategoryType, fetchCategories } from "../../api/categoryApi.tsx";

interface CategoryListProps {
    title: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ title }) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err: any) {
                setError(err.message || "Не удалось загрузить категории");
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) {
        return <p className="text-center">Загрузка...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (categories.length === 0) {
        return <p className="text-center">Категории пока отсутствуют</p>;
    }

    return (
        <section className="p-4">
            <h3 className="text-2xl font-bold text-center">{title}</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <CategoryCard key={category.id} {...category} />
                ))}
            </div>
        </section>
    );
};

export default CategoryList;
