import React, { useEffect, useState } from 'react';
import { getCurrentUser, updateUserProfile } from '../../../api/userApi';

type UserProfile = {
    username: string;
    firstname: string;
    lastname: string;
    gender: string;
    age: string;
    email: string;
};

const MyProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editingField, setEditingField] = useState<keyof UserProfile | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                const data: UserProfile = {
                    username: user.username || '',
                    firstname: user.firstname || '',
                    lastname: user.lastname || '',
                    gender: user.gender || '',
                    age: user.age ? String(user.age) : '',
                    email: user.email || '',
                };
                setProfile(data);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        };

        fetchUser();
    }, []);

    const handleEditClick = (field: keyof UserProfile) => {
        setEditingField(field);
        setEditValue(profile?.[field] || '');
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
    };

    const handleSave = async () => {
        if (!profile || !editingField) return;

        const updatedProfile = { ...profile, [editingField]: editValue };

        try {
            await updateUserProfile({
                ...updatedProfile,
                age: Number(updatedProfile.age),
            });
            setProfile(updatedProfile);
            setEditingField(null);
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        }
    };

    if (!profile) return <p className="text-center mt-10">Загрузка...</p>;

    const fields: { label: string; key: keyof UserProfile }[] = [
        { label: 'Username', key: 'username' },
        { label: 'First Name', key: 'firstname' },
        { label: 'Last Name', key: 'lastname' },
        { label: 'Gender', key: 'gender' },
        { label: 'Age', key: 'age' },
        { label: 'Email', key: 'email' },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto ">
            <h2 className="text-2xl font-semibold mb-4 ">My Details</h2>

            <div className="space-y-6">
                {fields.map(({ label, key }) => (
                    <div key={key} className="border-b pb-4 flex justify-between items-center">
                        <div className="w-full">
                            <p className="text-sm text-gray-500">{label}</p>
                            {editingField === key ? (
                                <>
                                    {key === 'gender' ? (
                                        <select
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="mt-1 border border-gray-300 rounded px-3 py-1"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    ) : key === 'age' ? (
                                        <div className="flex items-center mt-1 space-x-2">
                                            <button
                                                onClick={() => setEditValue((prev) => String(Math.max(0, Number(prev) - 1)))}
                                                className="px-2 py-1 bg-gray-200 rounded"
                                            >−</button>
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-16 text-center px-2 py-1 border rounded"
                                            />
                                            <button
                                                onClick={() => setEditValue((prev) => String(Number(prev) + 1))}
                                                className="px-2 py-1 bg-gray-200 rounded"
                                            >+</button>
                                        </div>
                                    ) : (
                                        <input
                                            type={key === 'email' ? 'email' : 'text'}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="mt-1 text-md text-gray-700 border-b border-gray-300 focus:outline-none focus:border-purple-500 w-full"
                                        />
                                    )}

                                    <div className="mt-2 space-x-3">
                                        <button
                                            onClick={handleSave}
                                            className="text-sm text-white bg-purple-500 px-3 py-1 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="text-sm text-gray-600 hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-md text-gray-800 mt-1">
                                    {profile[key] || 'Not provided'}
                                </p>
                            )}
                        </div>

                        {editingField !== key && (
                            <button
                                onClick={() => handleEditClick(key)}
                                className="text-sm text-purple-600 hover:underline ml-4"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyProfilePage;
