import Cookies from "js-cookie";
import { useState } from "react";
import { Menu, X, ChevronDown, UserCircleIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isTemplateOpen, setIsTemplateOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        navigate("/login");
    };

    return (
        <nav className="bg-gradient-to-r from-[#1579fc] to-blue-400 shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-white text-2xl font-bold tracking-wide">
                    Polo<span className="text-yellow-300">Page</span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white focus:outline-none cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Navigation Links */}
                <div
                    className={`md:flex md:items-center md:space-x-6 absolute md:static bg-blue-600 md:bg-transparent top-16 left-0 w-full md:w-auto transition-all duration-300 ease-in-out ${isOpen ? "block" : "hidden"
                        }`}
                >
                    <Link
                        to="/dashboard"
                        className="block md:inline-block text-white hover:text-yellow-300 px-6 py-3 md:py-2 transition duration-300"
                    >
                        Dashboard
                    </Link>
                    
                    <Link
                        to="/players"
                        className="block md:inline-block text-white hover:text-yellow-300 px-6 py-3 md:py-2 transition duration-300"
                    >
                        Players
                    </Link>
                    
                    <Link
                        to="/qna"
                        className="block md:inline-block text-white hover:text-yellow-300 px-6 py-3 md:py-2 transition duration-300"
                    >
                        Q&A
                    </Link>

                    {/* Template Dropdown */}
                    {/* <div
                        className="relative flex justify-center group"
                        onMouseEnter={() => setIsTemplateOpen(true)}
                        onMouseLeave={() => setIsTemplateOpen(false)}
                    >
                        <button className="flex items-center text-white hover:text-yellow-300 px-6 py-3 md:py-2 transition duration-300">
                            Templates <ChevronDown size={18} className="ml-2" />
                        </button>
                        {isTemplateOpen && (
                            <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg w-44 mt-2 overflow-hidden z-10">
                                <Link
                                    to="/sms-templates"
                                    className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-blue-100 hover:font-medium transition duration-200"
                                >
                                    SMS Templates
                                </Link>
                                <Link
                                    to="/product-templates"
                                    className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-blue-100 hover:font-medium transition duration-200"
                                >
                                    Product Templates
                                </Link>
                                <Link
                                    to="/product-title-template"
                                    className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-blue-100 hover:font-medium transition duration-200"
                                >
                                    Product Title
                                </Link>
                                <Link
                                    to="/product-month-template"
                                    className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-blue-100 hover:font-medium transition duration-200"
                                >
                                    Product Month
                                </Link>
                            </div>
                        )}
                    </div> */}
                    {/* User Dropdown */}
                    <div
                        className="relative flex justify-center group"
                        onMouseEnter={() => setIsUserOpen(true)}
                        onMouseLeave={() => setIsUserOpen(false)}
                    >
                        <button className="flex items-center text-white hover:text-yellow-300 px-6 py-3 md:py-2 transition duration-300">
                            <UserCircleIcon color="white" /> <ChevronDown size={18} className="ml-2" />
                        </button>
                        {isUserOpen && (
                            <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg w-44 mt-2 overflow-hidden z-10">
                                <Link
                                    to="/user-settings"
                                    className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-blue-100 hover:font-medium transition duration-200"
                                >
                                    Settings
                                </Link>
                                <button
                                    className="w-full block px-4 py-2 text-[15px] text-gray-700 hover:bg-blue-100 hover:font-medium transition duration-200"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
