import Card from "../../UI/Card";
import theater from "../../assets/images/category/theater.png";
import concert from "../../assets/images/category/concert.png";
import sport from "../../assets/images/category/sport.png";
import kids from "../../assets/images/category/kids.png";
import Button from "../../UI/Button.tsx";

const CategoryCard = () => {
    return<div className="mt-8 text-center">
        <div className="flex justify-between items-center px-6">
            <h3 className="text-2xl font-bold">Просмотр По Категориям</h3>
            <Button text="Посмотреть больше" to="/more" variant="outline" />
        </div>

        <div className="flex justify-center gap-6 mt-6">
            <Card title="ТЕАТР" image={theater } link="/theater"/>
            <Card title="КОНЦЕРТЫ" image={concert} link="/concerts"/>
            <Card title="СПОРТ" image={sport} link="/sports"/>
            <Card title="ДЕТЯМ" image={kids} link="/concerts" />
        </div>
    </div>
};

export default CategoryCard;