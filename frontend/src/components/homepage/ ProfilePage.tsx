import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Tickets, Users, Trash2, Pencil } from 'lucide-react';
import { getCurrentUser, updateUserProfile, deleteAvatar } from '../../api/userApi';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getCurrentUser();
                setUser(res);
            } catch (err) {
                console.error('Error fetching user', err);
            }
        };
        fetchUser();
    }, []);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result?.toString().split(',')[1];
                if (base64) {
                    try {
                        const updated = await updateUserProfile({
                            avatar_base64: base64,
                            avatar_mime_type: file.type,
                        });
                        setUser(updated);
                    } catch (err) {
                        console.error('Error updating avatar', err);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAvatar = async () => {
        try {
            await deleteAvatar();
            setUser((prevUser: any) => ({
                ...prevUser,
                avatar_base64: null,
                avatar_mime_type: null,
            }));
            alert('Avatar deleted successfully');
        } catch (err) {
            console.error('Error deleting avatar', err);
            alert('Failed to delete avatar');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="flex items-center justify-center py-8">
                <div className="flex items-center relative">
                    {/* Avatar Block */}
                    <div className="w-32 h-32 bg-gray-300 rounded-md border-4 border-white overflow-hidden relative group mr-4">
                        {user?.avatar_base64 ? (
                            <img
                                src={`data:${user.avatar_mime_type};base64,${user.avatar_base64}`}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-400">
                                <User size={64} className="text-white" />
                            </div>
                        )}
                        {/* Overlay buttons */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center space-y-2 transition-opacity">
                            <label className="text-white text-sm cursor-pointer flex items-center gap-1 hover:underline">
                                <Pencil size={16} />
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                            {user?.avatar_base64 && (
                                <button
                                    onClick={handleDeleteAvatar}
                                    className="text-white text-sm flex items-center gap-1 hover:underline"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="text-black">
                        <h1 className="text-2xl font-bold">
                            { user?.username || 'User'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Layout */}
            <div className="container mx-auto px-64 flex">
                {/* Sidebar */}
                <div className="w-64 mr-8 px-4 py-4 space-y-2">
                    <NavLink
                        to="my-info"
                        className={({ isActive }) =>
                            `w-full block px-4 py-3 rounded-md flex items-center ${isActive ? 'bg-purple-400 text-white' : 'hover:bg-gray-100 text-gray-700'}`
                        }
                    >
                        <User size={18} className="mr-2" />
                        My Details
                    </NavLink>
                    <NavLink
                        to="my-tickets"
                        className={({ isActive }) =>
                            `w-full block px-4 py-3 rounded-md flex items-center ${isActive ? 'bg-purple-400 text-white' : 'hover:bg-gray-100 text-gray-700'}`
                        }
                    >
                        <Tickets size={18} className="mr-2" />
                        My Tickets
                    </NavLink>
                    <NavLink
                        to="my-groups"
                        className={({ isActive }) =>
                            `w-full block px-4 py-3 rounded-md flex items-center ${isActive ? 'bg-purple-400 text-white' : 'hover:bg-gray-100 text-gray-700'}`
                        }
                    >
                        <Users size={18} className="mr-2" />
                        My Groups
                    </NavLink>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
