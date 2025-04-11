import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  user: { username: string };
  rating: number;
  comment?: string;
}

interface ReviewsSliderProps {
  reviews: Review[];
  onReachEnd: () => void; // Новый пропс для уведомления о достижении конца
}

const ReviewsSlider: React.FC<ReviewsSliderProps> = ({
  reviews,
  onReachEnd,
}) => {
  return (
    <div className="relative max-w-7xl mx-auto px-16">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".reviews-swiper-button-next",
          prevEl: ".reviews-swiper-button-prev",
        }}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={3}
        onReachEnd={onReachEnd} // Срабатывает при достижении конца слайдера
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
                <p className="text-gray-700 flex-grow break-words pr-4">
                  {review.comment || "No comment"}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="reviews-swiper-button-prev absolute left-[-20px] top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer z-10 flex items-center justify-center h-12 w-12">
        <ChevronLeft className="h-8 w-8" />
      </div>
      <div className="reviews-swiper-button-next absolute right-[-20px] top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer z-10 flex items-center justify-center h-12 w-12">
        <ChevronRight className="h-8 w-8" />
      </div>
    </div>
  );
};

export default ReviewsSlider;
