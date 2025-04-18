import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#04092C] text-white py-4  bottom-0 left-0 w-full">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-50">
                <div className="flex flex-col items-center md:items-start">
                    <div className="text-3xl font-bold text-white">
                        <span className="text-purple-500">E</span>ventHub
                    </div>
                </div>
                <div className="flex space-x-8 mt-4 md:mt-0">
                    <Link to="/Home" className="text-white hover:text-gray-400">Home</Link>
                    <Link to="/about" className="text-white hover:text-gray-400">About Us</Link>
                    <Link to="/categories" className="text-white hover:text-gray-400">Categories</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;