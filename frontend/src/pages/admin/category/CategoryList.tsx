import React, { useEffect, useState } from "react";
import { fetchCategories, deleteCategory, CategoryType } from "../../../api/categoryApi";
import CategoryTable from "../../../components/admin/CategoryTable";
import Button from "../../../UI/Button";

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            setError("Error loading categories");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(id);
                setCategories(categories.filter((category) => category.id !== id));
            } catch (error) {
                alert("Error deleting category");
            }
        }
    };

    if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
    if (error) return <div className="container mx-auto px-4 py-8">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 relative">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button text="Create Category" to="/admin/categories/create" variant="green" />
            </div>

            <CategoryTable categories={categories} onDelete={handleDelete} />
        </div>
    );
};

export default CategoryList;
