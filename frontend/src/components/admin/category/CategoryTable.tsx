import React from "react";
import { Link } from "react-router-dom";
import {CategoryType} from "../../../api/categoryApi.tsx";

interface CategoryTableProps {
    categories: CategoryType[];
    onDelete: (id: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onDelete }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-4">
            <table className="min-w-full text-gray-900">
                <thead className="bg-gray-100">
                <tr>
                    {["Name", "Image", "Verified", "Parent", "Actions"].map((heading) => (
                        <th
                            key={heading}
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                            {heading}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                    <tr key={category.id} className="bg-white">
                        <td className="px-6 py-4">{category.name}</td>
                        <td className="px-6 py-4">
                            {category.image_base64 ? (
                                <img
                                    src={category.image_base64}
                                    alt={category.name}
                                    className="h-10 w-10 object-cover rounded-full"
                                />
                            ) : (
                                <img
                                    src="https://via.placeholder.com/50"
                                    alt="Placeholder"
                                    className="h-10 w-10 object-cover rounded-full"
                                />
                            )}
                        </td>
                        <td className="px-6 py-4">
                            {category.is_verified ? "✅ Verified" : "❌ Not Verified"}
                        </td>
                        <td className="px-6 py-4">
                            {category.parent ? category.parent.name : "—"}
                        </td>
                        <td className="px-6 py-4 flex space-x-3">
                            <Link
                                to={`/admin/categories/${category.id}`}
                                className="text-blue-500 hover:underline"
                            >
                                Details
                            </Link>
                            <Link
                                to={`/admin/categories/edit/${category.id}`}
                                className="text-green-500 hover:underline"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => onDelete(category.id)}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;
