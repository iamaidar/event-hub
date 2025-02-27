
import CategoryCard from "../components/HomePage/CategoryCard";
import Poster from "../components/HomePage/Poster";
import EventList from "../components/HomePage/EventList";

const Home = () => {


    return (
        <div className="relative px-50 py-10">
            <Poster   />
            <CategoryCard />
            <EventList />
        </div>
    );
};

export default Home;