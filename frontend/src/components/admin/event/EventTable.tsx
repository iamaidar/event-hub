import { Link } from "react-router-dom";
import React from "react";
import { EventType } from "../../../api/eventApi";

interface EventTableProps {
  events: EventType[];
  onDelete: (id: number) => void;
}

const EventTable: React.FC<EventTableProps> = ({ events, onDelete }) => {
  return (
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full text-gray-900">
          <thead className="bg-gray-100">
          <tr>
            {[
              "Image",
              "Title",
              "Date & Time",
              "Location",
              "Price",
              "Tickets",
              "Organizer",
              "Status",
              "Actions",
            ].map((heading) => (
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
          {events.map((event, index) => {
            // @ts-ignore
            const statusColor: any = {
              pending: "bg-blue-100 text-blue-700",
              published: "bg-yellow-100 text-yellow-700",
              completed: "bg-green-100 text-green-700",
              cancelled: "bg-orange-100 text-orange-700",
              inactive: "bg-zinc-200 text-zinc-600",
              deleted: "bg-neutral-300 text-neutral-600",
            }[event.status as keyof typeof statusColor] || "bg-gray-100 text-gray-700";

            return (
                <tr key={event.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4">
                    <img
                        src={event.image_base64 || "https://via.placeholder.com/50"}
                        alt={event.title}
                        className="h-10 w-10 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4">{event.title}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(event.date_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{event.location}</td>
                  <td className="px-6 py-4 text-gray-500">${event.price}</td>
                  <td className="px-6 py-4 text-gray-500">{event.total_tickets}</td>
                  <td className="px-6 py-4 text-gray-500">{event.organizer.username}</td>
                  <td className="px-6 py-4">
                  <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                  >
                    {event.status}
                  </span>
                    {event.is_verified && (
                        <span className="ml-2 text-blue-500 text-xs font-semibold">
                      ✔ Verified
                    </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex space-x-3">
                    <Link to={`/admin/events/${event.id}`} className="text-blue-500 hover:underline">
                      Details
                    </Link>
                    <Link to={`/admin/events/edit/${event.id}`} className="text-green-500 hover:underline">
                      Edit
                    </Link>
                    <button
                        onClick={() => onDelete(event.id)}
                        className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
            );
          })}
          </tbody>
        </table>
      </div>
  );
};

export default EventTable;
