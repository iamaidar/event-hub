import EventCard from "../../UI/EventCard";
import festivalImage from '../../assets/images/festival.png';
import event_2 from '../../assets/images/event_2.png';
import event_3 from '../../assets/images/event_3.png';
const events = [
    {
        date: "Aug 13",
        time: "10:00am",
        title: "Elements: Music and Arts Festival - Sunday",
        location: "Pocono Raceway",
        image: festivalImage,
    },
    {
        date: "Aug 13",
        time: "11:00am",
        title: "Orange County Fair - Admission",
        location: "Orange County Fair and Event Center",
        image: event_2,
    },
    {
        date: "Aug 13",
        time: "11:00am",
        title: "Audien (21+ Event)",
        location: "AVY Dayclub",
        image: event_3,
    },
];


const EventList: React.FC = () => {
    return (
        <section className="mt-8 p-4">
            <h3 className="text-2xl font-bold text-center">Лучшие Предложения Рядом С Вами</h3>
            <div className="mt-4">
                {events.map((event, index) => (
                    <EventCard key={index} {...event} />
                ))}
            </div>
        </section>
    );
};

export default EventList;
