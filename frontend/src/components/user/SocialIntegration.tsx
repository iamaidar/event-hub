import { useEffect, useState, useCallback, useRef } from "react";
import {
  EventGroupType,
  fetchPaginatedEventGroups,
  createEventGroup,
  joinToGroup,
} from "../../api/eventGroupApi.tsx";
import EventGroupsSlider from "./EventGroupsSlider.tsx";
import Modal from "../../components/Modal";
import Button from "../../UI/Button";
import { toast } from "react-toastify";

interface SocialIntegrationProps {
  eventId: number;
  userId: number;
}

const SocialIntegration: React.FC<SocialIntegrationProps> = ({
  eventId,
  userId,
}) => {
  const isMounted = useRef(false);

  const [eventGroupsState, setEventGroupsState] = useState({
    eventGroups: [] as EventGroupType[],
    eventGroupsPage: 1,
    totalPages: 0,
    isLoading: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    title: "",
    description: "",
    status: "active" as const,
    genderRequirement: "" as "" | "male" | "female" | "any",
    minAge: undefined as number | undefined,
    maxAge: undefined as number | undefined,
    members_limit: 1, // Изменено с 0 на 1, так как 0 не имеет смысла для лимита участников
  });

  const fetchEventGroupsData = useCallback(
    async (page: number) => {
      setEventGroupsState((prev) => ({ ...prev, isLoading: true }));
      try {
        const eventGroupData = await fetchPaginatedEventGroups(
          page,
          4,
          eventId,
        );
        setEventGroupsState((prev) => ({
          ...prev,
          eventGroups:
            page === 1
              ? eventGroupData.data || []
              : prev.eventGroups.concat(eventGroupData.data || []), // Очищаем при page=1
          totalPages: eventGroupData.totalPages || 0,
          eventGroupsPage: page,
          isLoading: false,
        }));
      } catch (err) {
        console.error("Error loading event groups:", err);
        setEventGroupsState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [eventId],
  );

  useEffect(() => {
    if (!isMounted.current) {
      fetchEventGroupsData(1);
      isMounted.current = true;
    }
  }, [fetchEventGroupsData]);

  const handleCreateGroup = async () => {
    try {
      const groupData = {
        eventId,
        title: newGroup.title,
        description: newGroup.description || undefined,
        status: newGroup.status,
        genderRequirement: newGroup.genderRequirement || undefined,
        minAge: newGroup.minAge,
        maxAge: newGroup.maxAge,
        members_limit: newGroup.members_limit, // Добавляем members_limit
      };
      await createEventGroup(groupData);
      setModalOpen(false);
      setNewGroup({
        title: "",
        description: "",
        status: "active",
        genderRequirement: "",
        minAge: undefined,
        maxAge: undefined,
        members_limit: 1, // Сбрасываем на 1
      });
      fetchEventGroupsData(1); // Перезагружаем с первой страницы
    } catch (err) {
      console.error("Error creating event group:", err);
    }
  };

  const handleReachEnd = useCallback(() => {
    if (
      eventGroupsState.eventGroupsPage < eventGroupsState.totalPages &&
      !eventGroupsState.isLoading
    ) {
      console.log(
        "Reached end, loading page:",
        eventGroupsState.eventGroupsPage + 1,
      );
      fetchEventGroupsData(eventGroupsState.eventGroupsPage + 1);
    }
  }, [
    eventGroupsState.eventGroupsPage,
    eventGroupsState.totalPages,
    eventGroupsState.isLoading,
    fetchEventGroupsData,
  ]);

  const handleJoin = useCallback(
    async (groupId: string | number) => {
      try {
        const result = await joinToGroup(groupId);
        toast.success(result.message, {
          autoClose: 3000,
        });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to join the group",
          {
            autoClose: 5000,
          },
        );
      }
    },
    [eventId],
  );

  return (
    <>
      <Button
        text="Create Event Group"
        onClick={() => setModalOpen(true)}
        variant="solid"
        className="block mx-auto mt-4"
      />
      {eventGroupsState.eventGroups.length > 0 ? (
        <>
          <EventGroupsSlider
            eventGroups={eventGroupsState.eventGroups}
            onReachEnd={handleReachEnd}
            onJoinNow={handleJoin}
            eventId={eventId}
            userId={userId}
          />
          {eventGroupsState.isLoading && (
            <p className="text-center text-gray-500 mt-4">
              Loading more event groups...
            </p>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No Event Groups Available
        </p>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Create New Event Group</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Group Title"
            value={newGroup.title}
            onChange={(e) =>
              setNewGroup((prev) => ({ ...prev, title: e.target.value }))
            }
            className="border px-2 py-1 rounded w-full"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={newGroup.description}
            onChange={(e) =>
              setNewGroup((prev) => ({ ...prev, description: e.target.value }))
            }
            className="border px-2 py-1 rounded w-full h-24"
          />
          <select
            value={newGroup.genderRequirement}
            onChange={(e) =>
              setNewGroup((prev) => ({
                ...prev,
                genderRequirement: e.target.value as
                  | ""
                  | "male"
                  | "female"
                  | "any",
              }))
            }
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">No Gender Requirement</option>
            <option value="male">Male Only</option>
            <option value="female">Female Only</option>
            <option value="any">Any Gender</option>
          </select>
          <input
            type="number"
            placeholder="Minimum Age (optional)"
            value={newGroup.minAge !== undefined ? newGroup.minAge : ""}
            onChange={(e) =>
              setNewGroup((prev) => ({
                ...prev,
                minAge: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            min="0"
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="number"
            placeholder="Maximum Age (optional)"
            value={newGroup.maxAge !== undefined ? newGroup.maxAge : ""}
            onChange={(e) =>
              setNewGroup((prev) => ({
                ...prev,
                maxAge: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            min="0"
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="number"
            placeholder="Members Limit"
            value={newGroup.members_limit}
            onChange={(e) =>
              setNewGroup((prev) => ({
                ...prev,
                members_limit: Number(e.target.value) || 1, // Минимальное значение 1
              }))
            }
            min="1"
            required
            className="border px-2 py-1 rounded w-full"
          />
          <Button
            text="Create Group"
            onClick={handleCreateGroup}
            variant="solid"
          />
        </div>
      </Modal>
    </>
  );
};

export default SocialIntegration;
