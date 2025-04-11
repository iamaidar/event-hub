import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { EventGroupType } from "../../api/eventGroupApi.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventGroupsSliderProps {
  eventGroups: EventGroupType[];
  onReachEnd: () => void; // Добавляем для ленивой загрузки
}

const EventGroupsSlider: React.FC<EventGroupsSliderProps> = ({
  eventGroups,
  onReachEnd,
}) => {
  const getRequirementsText = (group: EventGroupType) => {
    const { genderRequirement, minAge, maxAge } = group;
    const requirements = [];

    if (genderRequirement) {
      requirements.push(
        genderRequirement === "male" ? "Men only" : "Women only",
      );
    }
    if (minAge !== undefined && minAge !== null) {
      requirements.push(`From ${minAge} years`);
    }
    if (maxAge !== undefined && maxAge !== null) {
      requirements.push(`Up to ${maxAge} years`);
    }

    return requirements.length > 0
      ? requirements.join(", ")
      : "No requirements";
  };

  return (
    <div className="relative max-w-7xl mx-auto px-16 mt-4">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".event-groups-swiper-button-next",
          prevEl: ".event-groups-swiper-button-prev",
        }}
        pagination={{ clickable: true }}
        spaceBetween={15}
        slidesPerView={3}
        onReachEnd={onReachEnd} // Ленивая загрузка при достижении конца
        breakpoints={{
          1024: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          480: { slidesPerView: 1 },
        }}
        className="py-4 flex items-stretch" // Выравнивание по высоте
      >
        {eventGroups.map((group) => (
          <SwiperSlide key={group.id}>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {group.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Creator:{" "}
                    <span className="font-medium">
                      {group.creator.username}
                    </span>
                  </p>
                  {group.description ? (
                    <p className="text-sm text-gray-700 line-clamp-2 flex-grow">
                      {group.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic flex-grow">
                      No description
                    </p>
                  )}
                </div>
                <div className="mt-3 shrink-0">
                  <p className="text-sm text-gray-600">
                    Requirements:{" "}
                    <span className="font-semibold text-purple-600">
                      {getRequirementsText(group)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <div className="event-groups-swiper-button-prev absolute left-[-20px] top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer z-10 flex items-center justify-center h-12 w-12">
        <ChevronLeft className="h-8 w-8" />
      </div>
      <div className="event-groups-swiper-button-next absolute right-[-20px] top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer z-10 flex items-center justify-center h-12 w-12">
        <ChevronRight className="h-8 w-8" />
      </div>
    </div>
  );
};

export default EventGroupsSlider;
