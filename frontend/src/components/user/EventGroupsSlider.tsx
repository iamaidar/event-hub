import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import {
  EventGroupType,
  isUserInAnyGroupByEventId,
} from "../../api/eventGroupApi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../UI/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface EventGroupsSliderProps {
  eventGroups: EventGroupType[];
  onReachEnd: () => void;
  onJoinNow: (id: number | string) => Promise<void>;
  eventId: string | number;
  userId: number;
}

const EventGroupsSlider: React.FC<EventGroupsSliderProps> = ({
  eventGroups,
  onReachEnd,
  onJoinNow,
  eventId,
}) => {
  const [isUserInAnyGroup, setIsUserInAnyGroup] = useState<{
    result: boolean;
    groupId: string | number | null;
  }>({ result: false, groupId: null });

  const navigate = useNavigate();

  const handleChatClick = (groupId: number | string) => {
    navigate(`/user/user/chat/${groupId}`);
  };

  const getRequirementsText = (group: EventGroupType): string => {
    const { genderRequirement, minAge, maxAge } = group;
    const requirements: string[] = [];

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

  useEffect(() => {
    isUserInAnyGroupByEventId(eventId).then((data) => {
      setIsUserInAnyGroup(data);
    });
  }, []);

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
        onReachEnd={onReachEnd}
        breakpoints={{
          1024: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          480: { slidesPerView: 1 },
        }}
        className="py-4 flex items-stretch"
      >
        {eventGroups.map((group) => (
          <SwiperSlide key={group.id} className="h-auto flex">
            <div className="flex flex-col min-h-[200px] w-full bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {group.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Creator:{" "}
                  <span className="font-medium">{group.creator.username}</span>
                </p>
                {group.description ? (
                  <p className="text-sm text-gray-700 line-clamp-3 flex-grow">
                    {group.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic flex-grow">
                    No description
                  </p>
                )}
              </div>
              <div className=" shrink-0">
                <p className="text-sm text-gray-600 mb-3">
                  Requirements:{" "}
                  <span className="font-semibold text-purple-600">
                    {getRequirementsText(group)}
                  </span>
                </p>
                <div className="flex justify-end">
                  {!isUserInAnyGroup.result && (
                    <Button
                      text="Join Now"
                      variant="solid"
                      className="text-xs px-3 py-1"
                      onClick={() => onJoinNow(group.id)}
                    />
                  )}

                  {isUserInAnyGroup.result &&
                    isUserInAnyGroup.groupId === group.id && (
                      <Button
                        text="Chat now"
                        variant="solid"
                        className="text-xs px-3 py-1"
                        onClick={() => handleChatClick(group.id)}
                      />
                    )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

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
