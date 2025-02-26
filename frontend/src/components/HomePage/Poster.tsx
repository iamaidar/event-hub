import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import musicBg1 from "../../assets/images/music.png";
import musicBg2 from "../../assets/images/music_2.png";
import musicBg3 from "../../assets/images/music_3.png";

const slides = [
    {
        imageUrl: musicBg1,
        title: "Насладитесь музыкой на фестивале!!",
        description: "Описание",
        link: "/events",
        linkText: "Купить сейчас"
    },
    {
        imageUrl: musicBg2,
        title: "Второй слайд",
        description: "Описание второго слайда",
    },
    {
        imageUrl: musicBg3,
        title: "Третий слайд",
        description: "Описание третьего слайда",
    },
];


const Poster: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]); // Следим только за длиной массива

    if (slides.length === 0) {
        return <div className="text-center text-gray-500">Нет слайдов</div>;
    }

    const currentSlide = slides[currentImageIndex];

    return (
        <div className="relative w-full h-[600px] overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40">
                <h2 className="text-4xl font-bold mb-2">{currentSlide.title}</h2>
                <p className="text-lg mb-4">{currentSlide.description}</p>
                {currentSlide.link && currentSlide.linkText && (
                    <Link
                        to={currentSlide.link}
                        className="bg-white text-[#04092C] font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition"
                    >
                        {currentSlide.linkText}
                    </Link>
                )}
            </div>

            {/* Кнопки переключения */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-900/70 transition"
                onClick={() =>
                    setCurrentImageIndex((prevIndex) =>
                        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
                    )
                }
            >
                ❮
            </button>
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-900/70 transition"
                onClick={() =>
                    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slides.length)
                }
            >
                ❯
            </button>
        </div>
    );
};

export default Poster;
