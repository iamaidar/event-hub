import CategoryTable from "../../../components/Admin/CategoryTable.tsx";
import Button from "../../../UI/Button.tsx";

interface CategoryListProps {}

const CategoryList: React.FC<CategoryListProps> = () => {
    return (
        <div className="container mx-auto px-4 py-8 relative">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button text="Create Category" to="/admin/categories/create" variant="green" />
            </div>

            <CategoryTable />
        </div>
    );
};

export default CategoryList;
