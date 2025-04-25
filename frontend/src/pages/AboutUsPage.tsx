import React from "react";
import { Users, Star } from "lucide-react";

const AboutUsPage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-8 text-gray-800">
            <h1 className="text-2xl font-bold mb-8 text-center text-purple-500">About EventHub</h1>

            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                    <strong className="text-purple-500">EventHub</strong> is a modern platform for booking tickets to various events. Our goal is to create not just a service, but a vibrant community of people who love spending time together.
                </p>
                <p>
                    We built <strong className="text-purple-500">EventHub</strong> as a meeting point for individuals with shared interests and event organizers. We aim to support a lively cultural environment and connect people with events that matter.
                </p>
                <p>
                    EventHub helps users not only to buy tickets, but also to share their experiences, emotions, and find new friends. People are the true value of <strong className="text-purple-500">EventHub</strong> — not just the technology.
                </p>

                <h2 className=" font-semibold mt-10 mb-6 text-center">Key Features</h2>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="  p-6 ">
                        <div className="flex items-center mb-4">
                            <Star className="text-purple-500 mr-3" size={28} />
                            <h3 className="text-xl font-semibold">Authentic Reviews & Ratings</h3>
                        </div>
                        <p>
                            After attending events, users can leave honest and authentic feedback. Ratings, likes/dislikes, and the ability to edit or remove reviews help maintain trust and transparency.
                        </p>
                    </div>

                    <div className=" p-6">
                        <div className="flex items-center mb-4">
                            <Users className="text-purple-500 mr-3" size={28} />
                            <h3 className="text-xl font-semibold">Find Companions & Group Chat</h3>
                        </div>
                        <p>
                            Don’t want to attend an event alone? Create or join a group for shared visits and chat directly within the platform. Make new connections around shared interests!
                        </p>
                    </div>
                </div>

                <p className="mt-10">
                    <strong>EventHub</strong> is not just about tickets — it’s about the experiences, the people, and the memories you create together.
                </p>

                <p className="italic text-gray-500 mt-6 text-center">
                    Welcome to the EventHub community!
                </p>
            </div>
        </div>
    );
};

export default AboutUsPage;
