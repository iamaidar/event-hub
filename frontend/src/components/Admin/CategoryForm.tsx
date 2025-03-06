interface CategoryFormProps {
    name: string;
    imageUrl: string;
    status: string;
    setName: (value: string) => void;
    setImageUrl: (value: string) => void;
    setStatus: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitButtonText: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
                                                         name,
                                                         imageUrl,
                                                         status,
                                                         setName,
                                                         setImageUrl,
                                                         setStatus,
                                                         onSubmit,
                                                         submitButtonText,
                                                     }) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white text-gray-800 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center">Category Management</h2>
            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                    />
                    {imageUrl && (
                        <div className="mt-3">
                            <img
                                src={imageUrl}
                                alt="Category Preview"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                        required
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition"
                >
                    {submitButtonText}
                </button>
            </form>
        </div>
    );
};

export default CategoryForm;
