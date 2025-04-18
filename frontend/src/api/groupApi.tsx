// src/api/groupApi.ts

export type Group = {
    id: number;
    name: string;
    description: string;
    joinedAt: string;
};

export const getMyGroups = async (): Promise<Group[]> => {
    // Симуляция задержки сети
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Мок-мероприятия
    return [
        {
            id: 1,
            name: 'Jazz Night Festival 2025',
            description: 'An unforgettable night of smooth jazz under the stars.',
            joinedAt: '2025-02-10T19:00:00Z',
        },
        {
            id: 2,
            name: 'Modern Art Expo',
            description: 'A showcase of contemporary artists from around the globe.',
            joinedAt: '2025-03-18T10:30:00Z',
        },
        {
            id: 3,
            name: 'Spring Food & Music Fair',
            description: 'Live bands, delicious street food, and a festive atmosphere.',
            joinedAt: '2025-04-01T12:00:00Z',
        },
        {
            id: 4,
            name: 'Tech Innovations Exhibition',
            description: 'Explore the future of technology with interactive exhibits.',
            joinedAt: '2025-04-10T15:45:00Z',
        },
    ];
};
