import { useEffect, useState } from "react";
import { CategoryType, fetchCategories } from "../api/categoryApi.tsx";
import Card from "../UI/Card.tsx";

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err: any) {
                setError(err.message || "Failed to load categories");
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading categories...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    if (categories.length === 0) {
        return <p className="text-center mt-10">No categories available</p>;
    }

    return (
        <section className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">All Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {categories.map((category) => (
                    <Card
                        key={category.id}
                        id={category.id}
                        name={category.name}
                        image_base64={category.image_base64}
                    />
                ))}
            </div>
        </section>
    );
};

export default CategoriesPage;

