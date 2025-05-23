import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCategoryById,
  updateCategory,
  CategoryType,
} from "../../../api/categoryApi";
import CategoryForm from "../../../components/admin/category/CategoryForm";

const CategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageBase64, setImageBase64] = useState<string | null>(
    category?.image_base64 || null,
  );

  useEffect(() => {
    if (id) {
      fetchCategoryById(id)
        .then(setCategory)
        .catch(() => alert("Error loading category"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    try {
      await updateCategory(id!, category);
      navigate("/admin/categories");
    } catch (error) {
      alert("Error updating category");
    }
  };

  if (loading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Edit Category</h1>
      {category && (
        <CategoryForm
          name={category.name}
          setName={(name) => setCategory({ ...category, name })}
          description={category.description || ""}
          setDescription={(description) =>
            setCategory({ ...category, description })
          }
          is_verified={category.is_verified || false}
          setIsVerified={(is_verified) =>
            setCategory({ ...category, is_verified })
          }
          imageBase64={imageBase64}
          setImageBase64={setImageBase64}
          onSubmit={handleSubmit}
          submitButtonText="Save Changes"
        />
      )}
    </div>
  );
};

export default CategoryEdit;
