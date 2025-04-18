import { NavLink, Outlet } from 'react-router-dom';
import { User, CreditCard, Users } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="h-24 relative mb-20">
                <div className="absolute bottom-0 left-72 transform translate-y-1/2">
                    <div className="w-32 h-32 bg-gray-300 rounded-md border-4 border-white overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                            <User size={64} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-72 ml-40 text-black">
                    <h1 className="text-2xl font-bold">Nurkyz</h1>
                    <p className="text-gray-400 text-sm">kanybekova</p>
                </div>
            </div>

            {/* Layout */}
            <div className="container mx-auto px-64 py-10 flex">
                {/* Sidebar */}
                <div className="w-64 mr-8 px-4 py-4 space-y-2">
                    <NavLink to="my-info" className={({ isActive }) =>
                        `w-full block px-4 py-3 rounded-md flex items-center ${isActive ? 'bg-purple-400 text-white' : 'hover:bg-gray-100 text-gray-700'}`
                    }>
                        <User size={18} className="mr-2" />
                        Basic Info
                    </NavLink>
                    <NavLink to="my-tickets" className={({ isActive }) =>
                        `w-full block px-4 py-3 rounded-md flex items-center ${isActive ? 'bg-purple-400 text-white' : 'hover:bg-gray-100 text-gray-700'}`
                    }>
                        <CreditCard size={18} className="mr-2" />
                        My Tickets
                    </NavLink>
                    <NavLink to="my-groups" className={({ isActive }) =>
                        `w-full block px-4 py-3 rounded-md flex items-center ${isActive ? 'bg-purple-400 text-white' : 'hover:bg-gray-100 text-gray-700'}`
                    }>
                        <Users size={18} className="mr-2" />
                        My Groups
                    </NavLink>
                </div>

                {/* Content from child routes */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
