import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {CategoryType, fetchCategoryById,} from "../../../api/categoryApi";

const CategoryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState<CategoryType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchCategory() {
            try {
                const data = await fetchCategoryById(Number(id));
                setCategory(data);
            } catch (err) {
                setError("Ошибка при получении информации о категории");
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [id]);

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
    }

    if (!category) {
        return <div className="container mx-auto px-4 py-8">Category not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl px-5 font-bold mb-4 text-gray-800">{category.name}</h1>
                <div className="space-y-3 text-gray-700">
                    <p className="border-b pb-2">
                        <strong>Name:</strong> {category.name}
                    </p>
                    <div className="border-b pb-2">
                        <strong>Image:</strong>
                        <div className="mt-2">
                            {category.image_base64 ? (
                                <img
                                    src={category.image_base64}
                                    alt={category.name}
                                    className="rounded-lg"
                                />
                            ) : (
                                <img
                                    src="https://via.placeholder.com/150"
                                    alt="Placeholder"
                                    className="rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                    <p className="border-b pb-2">
                        <strong>Status:</strong>
                        <span className="ml-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
              {category.is_verified ? "Active" : "Inactive"}
            </span>
                    </p>
                </div>
                <Link
                    to="/admin/categories"
                    className="mt-6 inline-block bg-purple-500 text-white px-4 py-2 rounded-full shadow hover:bg-purple-600 transition"
                >
                    ← Back to Categories List
                </Link>
            </div>
        </div>
    );
};

export default CategoryDetail;