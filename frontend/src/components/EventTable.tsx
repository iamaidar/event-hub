import { Link } from "react-router-dom";

const EventTable = () => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-4">
            <table className="min-w-full text-gray-900">
                <thead className="bg-gray-100">
                <tr>
                    {["Image", "Title", "Date & Time", "Location", "Price", "Status", "Actions"].map((heading) => (
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
                    { id: 1, imageUrl: "https://via.placeholder.com/50", title: "Event Title 1", date: "March 15, 2024 6:00 PM", location: "Location 1", price: "$20", status: "Active", statusColor: "bg-green-100 text-green-700" },
                    { id: 2, imageUrl: "https://via.placeholder.com/50", title: "Event Title 2", date: "March 20, 2024 7:00 PM", location: "Location 2", price: "$25", status: "Pending", statusColor: "bg-yellow-100 text-yellow-700" },
                ].map((event, index) => (
                    <tr key={event.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-6 py-4">
                            <img src={event.imageUrl} alt={event.title} className="w-12 h-12 object-cover rounded-full" />
                        </td>
                        <td className="px-6 py-4">{event.title}</td>
                        <td className="px-6 py-4 text-gray-500">{event.date}</td>
                        <td className="px-6 py-4 text-gray-500">{event.location}</td>
                        <td className="px-6 py-4 text-gray-500">{event.price}</td>
                        <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.statusColor}`}>
                                    {event.status}
                                </span>
                        </td>
                        <td className="px-6 py-4 flex space-x-3">
                            <Link to={`/admin/events/${event.id}`} className="text-blue-500 hover:underline">
                                Details
                            </Link>
                            <Link to={`/admin/events/edit/${event.id}`} className="text-green-500 hover:underline">
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

export default EventTable;
