import Button from "./Button.tsx";
import event_2 from "../assets/images/event_2.png";

export interface EventCardProps {
  date_time: string;
  title: string;
  location: string;
}

const EventCard: React.FC<EventCardProps> = ({
  date_time,
  title,
  location,
}) => {
  const date = new Date(date_time);

  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex items-center bg-white shadow-md rounded-lg p-4 mb-4">
      <img src={event_2} alt={title} className="w-20 h-20 rounded-md mr-4" />
      <div className="flex-1">
        <p className="text-sm text-gray-500">
          {formattedDate} • {formattedTime}
        </p>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-gray-600">{location}</p>
      </div>
      <div className="flex flex-col items-end">
        <Button text="Посмотреть детали" to="/details" variant="outline" />
        <Button
          variant="solid"
          text="Забронировать сейчас"
          onClick={() => console.log("Клик!")}
        />
      </div>
    </div>
  );
};

export default EventCard;
