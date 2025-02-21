
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="relative">
            {/* Background Image with Overlay */}
            <div
                className="relative h-[600px] w-full bg-cover bg-center"
                style={{
                    backgroundImage: `url('your-image-url.jpg')`, // Replace with your image URL
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-midnight-blue/70"></div>{" "}
                {/* Gradient Overlay */}
                {/* Content */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Насладитесь музыкой на фестивале!!
                    </h1>
                    <Link
                        to="/events"
                        className="bg-white text-midnight-blue py-3 px-8 rounded-full font-semibold hover:bg-lavender hover:text-midnight-blue transition-colors"
                    >
                        Book Now
                    </Link>
                </div>
            </div>

            {/* Navigation Arrows (Optional - for future slider) */}
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
                <button className="bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/50 transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>
                <button className="bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/50 transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default HomePage;