import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import './Dashboard.css';

const Dashboard = () => {
    const authContext = useContext(AuthContext);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-4 mystyle">d</h1>
                <p className="text-gray-600 text-lg mb-4">Вы вошли как:</p>
                <div className="bg-blue-100 text-blue-600 py-2 px-4 rounded-md font-semibold">
                    {authContext?.user?.email}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;