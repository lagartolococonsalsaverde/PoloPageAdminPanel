import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import LoggedinLayout from "../../components/LoggedinLayout";
import { updateUserProfile, fetchUserProfile, updateUserPassword } from "../../services/settings.api";
import { toast } from "react-toastify";

const Settings = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    // const [templateProductId, setTemplateProductId] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetchUserProfile();
                setEmail(response.email);
                setUsername(response.username);
                // setTemplateProductId(response.templateProductId);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUser();
    }, []);

    // Update profile API call
    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const response = await updateUserProfile({ email, username });
            if (response) {
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            toast.error("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    // Change password API call
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.info("New passwords do not match!");
            return;
        }

        setPasswordLoading(true);
        try {
            const response = await updateUserPassword(oldPassword, newPassword);
            if (response) {
                toast.success("Password changed successfully!");
            }
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error("Error changing password");
        } finally {
            
            setPasswordLoading(false);
        }
    };

    return (
        <LoggedinLayout>
            <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl px-10 py-8 space-y-6 my-10">
                <h2 className="text-2xl font-bold text-center text-gray-800">User Profile</h2>

                {/* Profile Form */}
                <div className="space-y-4 text-start">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-gray-400 outline-gray-500 rounded-lg focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-gray-400 outline-gray-500 rounded-lg focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Template Product ID</label>
                        <input
                            type="text"
                            value={templateProductId}
                            onChange={(e) => setTemplateProductId(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-gray-400 outline-gray-500 rounded-lg focus:ring focus:ring-blue-300"
                        />
                    </div> */}

                    <button
                        onClick={handleUpdateProfile}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </div>

                {/* Password Change Section */}
                <h2 className="text-xl font-semibold text-center text-gray-800">Change Password</h2>
                <div className="space-y-4">
                    {[
                        { label: "Current Password", value: oldPassword, setValue: setOldPassword, key: "old" },
                        { label: "New Password", value: newPassword, setValue: setNewPassword, key: "new" },
                        { label: "Confirm New Password", value: confirmPassword, setValue: setConfirmPassword, key: "confirm" },
                    ].map(({ label, value, setValue, key }) => (
                        <div key={key} className="relative">
                            <label className="block text-start text-sm font-medium text-gray-700">{label}</label>
                            <div className="relative">
                                <input
                                    type={passwordVisible[key] ? "text" : "password"}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-400 outline-gray-500 rounded-lg focus:ring focus:ring-blue-300 pr-10"
                                />
                                <span
                                    className="absolute top-0 bottom-0 my-auto right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-600"
                                    onClick={() =>
                                        setPasswordVisible((prev) => ({ ...prev, [key]: !prev[key] }))
                                    }
                                >
                                    {passwordVisible[key] ? <Eye size={20} /> : <EyeOff size={20} />}
                                </span>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleChangePassword}
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                        disabled={passwordLoading}
                    >
                        {passwordLoading ? "Changing Password..." : "Change Password"}
                    </button>
                </div>
            </div>
        </LoggedinLayout>
    );
};

export default Settings;
