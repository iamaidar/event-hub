import React, { createContext, useState, useContext } from "react";

interface EventType {
    id: number;
    title: string;
    description: string;
    // ... другие поля
}

interface EventContextProps {
    events: EventType[];
    addEvent: (newEvent: EventType) => void;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<EventType[]>([]);

    const addEvent = (newEvent: EventType) => {
        setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    };

    return (
        <EventContext.Provider value={{ events, addEvent }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error("useEventContext must be used within a EventProvider");
    }
    return context;
};