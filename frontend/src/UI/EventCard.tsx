import Button from "./Button.tsx";
interface EventCardProps {
    date: string;
    time: string;
    title: string;
    location: string;
    image: string;
}

const EventCard: React.FC<EventCardProps> = ({ date, time, title, location, image }) => {
    return (
        <div className="flex items-center bg-white shadow-md rounded-lg p-4 mb-4">
            <img src={image} alt={title} className="w-20 h-20 rounded-md mr-4" />
            <div className="flex-1">
                <p className="text-sm text-gray-500">{date} • {time}</p>
                <h4 className="font-bold text-lg">{title}</h4>
                <p className="text-gray-600">{location}</p>
            </div>
            <div className="flex flex-col items-end">
                <Button text="Посмотреть детали" to="/details" variant="outline" />
                <Button variant="solid" text="Забронировать сейчас" onClick={() => console.log("Клик!")} />
            </div>
        </div>
    );
};

export default EventCard;