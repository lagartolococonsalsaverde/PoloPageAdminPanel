import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../environments/development.environment";
import Cookies from "js-cookie";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${BASE_URL}auth/sign-in`,
                { email: email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                Cookies.set("token", response.data.data.token);
                Cookies.set("refreshToken", response.data.data.refreshToken);

                navigate("/dashboard");
            }
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#EEDFDE] px-4">
            <form
                onSubmit={handleLogin}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back 👋
                </h2>

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 text-start mb-1">
                        Email/Username
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your email/username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg focus:ring-2 focus:ring-green-700 focus:outline-none"
                        required
                    />
                </div>

                {/* Password Input with Toggle */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-600 text-start mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg focus:ring-2 focus:ring-green-700 focus:outline-none pr-10"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 my-auto right-3 rounded-full flex items-center bg-transparent cursor-pointer outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} color="black" /> : <Eye size={20} color="black" />}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full bg-green-700 text-white cursor-pointer my-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition-all flex justify-center items-center disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
