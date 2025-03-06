import { Link } from "react-router-dom";

const CategoryTable = () => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-4">
            <table className="min-w-full text-gray-900">
                <thead className="bg-gray-100">
                <tr>
                    {["Name", "Image", "Status", "Actions"].map((heading) => (
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
                {[
                    { id: 1, imageUrl: "https://via.placeholder.com/50", name: "Category 1", status: "Active", statusColor: "bg-green-100 text-green-700" },
                    { id: 2, imageUrl: "https://via.placeholder.com/50", name: "Category 2", status: "Inactive", statusColor: "bg-red-100 text-red-700" },
                ].map((category, index) => (
                    <tr key={category.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-6 py-4">
                            <img src={category.imageUrl} alt={category.name} className="w-12 h-12 object-cover rounded-full" />
                        </td>
                        <td className="px-6 py-4">{category.name}</td>
                        <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.statusColor}`}>
                                    {category.status}
                                </span>
                        </td>
                        <td className="px-6 py-4 flex space-x-3">
                            <Link to={`/admin/categories/${category.id}`} className="text-blue-500 hover:underline">
                                Details
                            </Link>
                            <Link to={`/admin/categories/edit/${category.id}`} className="text-green-500 hover:underline">
                                Edit
                            </Link>
                            <button className="text-red-500 hover:underline">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;
