import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Import your images
import musicBg1 from "../assets/images/music.png"; // Замените на свои пути
import musicBg2 from "../assets/images/music_2.png"; // Замените на свои пути
import musicBg3 from "../assets/images/music_3.png"; // Замените на свои пути

const images = [musicBg1, musicBg2, musicBg3]; // Массив ваших изображений

const Home = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Автоматическая смена слайдов
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Меняем слайд каждые 5 секунд (5000 миллисекунд)

        return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }, []);

    // Обработчики для кнопок навигации
    const goToPreviousSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNextSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="relative px-50 py-10">
            {/* Background Image Slider */}
            <div
                className="relative h-[600px] w-full bg-cover bg-center transition-opacity duration-500"
                style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Насладитесь музыкой на фестивале!!
                    </h1>
                    <Link
                        to="/events"
                        className="bg-white text-[#04092C] font-bold py-3 px-8 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Book Now
                    </Link>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-40 z-10">
                <button
                    aria-label="Previous Slide"
                    className="bg-gray-800/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-900/70 transition-colors"
                    onClick={goToPreviousSlide}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
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
                <button
                    aria-label="Next Slide"
                    className="bg-gray-800/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-900/70 transition-colors"
                    onClick={goToNextSlide}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
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

export default Home;