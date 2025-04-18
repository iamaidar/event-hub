import React, { useState } from 'react';

type ProfileField = {
    label: string;
    key: keyof UserProfile;
    placeholder?: string;
};

type UserProfile = {
    name: string;
    gender: string;
    location: string;
    age: string;
};

const fields: ProfileField[] = [
    { label: 'Name', key: 'name' },
    { label: 'Gender', key: 'gender', placeholder: 'Not provided' },
    { label: 'Location', key: 'location', placeholder: 'Your location' },
    { label: 'Age', key: 'age', placeholder: 'Your age' },
];

const MyProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Nurkyz',
        gender: '',
        location: '',
        age: '',
    });

    const [editingKey, setEditingKey] = useState<keyof UserProfile | null>(null);
    const [tempValue, setTempValue] = useState<string>('');

    const handleEdit = (key: keyof UserProfile) => {
        setEditingKey(key);
        setTempValue(profile[key] || '');
    };

    const handleSave = () => {
        if (editingKey) {
            setProfile({ ...profile, [editingKey]: tempValue });
            setEditingKey(null);
        }
    };

    const handleCancel = () => {
        setEditingKey(null);
        setTempValue('');
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Basic Info</h2>

            <ul className="space-y-6">
                {fields.map(({ label, key, placeholder }) => (
                    <li key={key} className="border-b pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">{label}</p>
                                {editingKey === key ? (
                                    <textarea
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        className="mt-1 w-full border rounded px-3 py-2 text-sm resize-none"
                                    />
                                ) : (
                                    <p className="text-gray-800 mt-1 text-base">
                                        {profile[key] || placeholder || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            {editingKey === key ? (
                                <div className="flex flex-col gap-1 mt-1">
                                    <button
                                        onClick={handleSave}
                                        className="text-green-600 hover:underline text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="text-gray-500 hover:underline text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleEdit(key)}
                                    className="text-blue-600 hover:underline text-sm mt-1"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyProfilePage;
