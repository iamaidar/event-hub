import  { useEffect, useState } from 'react';
// Импортируй свой API
import { getMyGroups } from "../../../api/groupApi"; // путь может отличаться

type Group = {
    id: number;
    name: string;
    description: string;
    joinedAt: string;
};

export default function MyGroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getMyGroups();
                setGroups(data);
            } catch (err) {
                console.error('Failed to fetch groups:', err);
                setError('Failed to load groups.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">My Groups</h2>

            {loading && <p className="text-gray-500">Loading your groups...</p>}
            {error && <p className="text-red-600 font-medium">{error}</p>}

            {!loading && groups.length === 0 && (
                <p className="text-gray-600">You haven't joined any groups yet.</p>
            )}

            <ul className="space-y-4">
                {groups.map((group) => (
                    <li key={group.id} className="border p-4 rounded shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{group.description}</p>
                        <p className="text-gray-400 text-sm">
                            Joined: {new Date(group.joinedAt).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
