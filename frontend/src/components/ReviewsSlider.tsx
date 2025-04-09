import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

// Define types for review data
interface Review {
  user: {
    username: string;
  };
  rating: number;
  comment?: string;
}

// Define props type for the ReviewsSlider component
interface ReviewsSliderProps {
  reviews: Review[];
}

const ReviewsSlider: React.FC<ReviewsSliderProps> = ({ reviews }) => {
  return (
    <div className="relative max-w-6xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          1024: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          480: { slidesPerView: 1 },
        }}
        className="py-6"
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="mt-4 bg-white p-6 rounded-lg shadow-md h-[200px] flex flex-col justify-between">
              {/* Верхняя часть: пользователь и рейтинг */}
              <div className="flex flex-col justify-between h-full">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-900 font-semibold">
                    {review.user.username}
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(review.rating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Нижняя часть: комментарий */}
                <p className="text-gray-700 flex-grow break-words">
                  {review.comment || "Без комментария"}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Внешние стрелки */}
      <div className="swiper-button-prev !absolute -left-10 top-1/2 transform -translate-y-1/2 !text-gray-700"></div>
      <div className="swiper-button-next !absolute -right-10 top-1/2 transform -translate-y-1/2 !text-gray-700"></div>
    </div>
  );
};

export default ReviewsSlider;
