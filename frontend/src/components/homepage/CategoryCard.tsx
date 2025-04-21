import Card, { CategoryCardProps } from "../../UI/Card";
import Button from "../../UI/Button.tsx";
import axios from "axios";
import { getAccessToken } from "../../utils/tokenService.tsx";
import { useEffect, useState } from "react";

const CategoryCard = () => {
  const [categories, setCategories] = useState<CategoryCardProps[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories", {
        params: {
          page: 1,
          limit: 4,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
      .then((response) => {
        const categoriesData = response.data.data.data as CategoryCardProps[];
        setCategories(categoriesData);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });
  }, []);

  return (
    <div className="mt-8 text-center">
      <div className="flex justify-between items-center px-6">
        <h3 className="text-2xl font-bold">Browse By Category</h3>
        <Button text="View more" to="/more" variant="outline" />
      </div>

      <div className="flex justify-center gap-6 mt-6">
        {categories.map((category, index) => (
          <Card key={index} {...category}></Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
