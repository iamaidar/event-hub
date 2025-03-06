import React from "react";
import { Link } from "react-router-dom";

const EventDetail: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Event Title</h1>
                <div className="space-y-3 text-gray-700">
                    <p className="border-b pb-2"><strong>Description:</strong> This is a sample event description.</p>
                    <p className="border-b pb-2"><strong>Date & Time:</strong> March 15, 2024 6:00 PM</p>
                    <p className="border-b pb-2"><strong>Location:</strong> Sample Location</p>
                    <p className="border-b pb-2"><strong>Category:</strong> Sample Category</p>
                    <p className="border-b pb-2"><strong>Price:</strong> $50</p>
                    <p className="border-b pb-2"><strong>Total Tickets:</strong> 100</p>
                    <p className="border-b pb-2"><strong>Status:</strong>
                        <span className="ml-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                            Active
                        </span>
                    </p>
                    <p><strong>Verified:</strong> ✅ Yes</p>
                    <p className="border-b pb-2"><strong>Image:</strong>
                        <img src="https://via.placeholder.com/150" alt="Event" className="mt-2 rounded-lg" />
                    </p>
                </div>
                <Link
                    to="/admin/events"
                    className="mt-6 inline-block bg-purple-500 text-white px-4 py-2 rounded-full shadow hover:bg-purple-600 transition"
                >
                    ← Back to Events List
                </Link>
            </div>
        </div>
    );
};

export default EventDetail;
