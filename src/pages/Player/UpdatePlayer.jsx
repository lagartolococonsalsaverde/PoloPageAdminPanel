import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoggedinLayout from "../../components/LoggedinLayout";
import { fetchPlayerById, updatePlayer } from "../../services/dashboard.api";
import { toast } from "react-toastify";

const UpdatePlayer = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const data = await fetchPlayerById(id);
                setFormData({
                    name: data.name || "",
                    birthDate: data.birthDate?.slice(0, 10) || "",
                    handicap: data.handicap ?? 0,
                    gender: data.gender || "male",
                    rank: data.rank || "junior",
                    category: data.category || "pro",
                    previousHandicap: data.previousHandicap ?? "",
                    whatsapp: data.whatsapp ?? "",
                });
            } catch (err) {
                console.error("Error fetching player:", err);
                setMessage("Failed to fetch player data.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlayer();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "handicap" || name === "previousHandicap" ? Number(value) : value,
        }));
    };

    const handleUpdate = async () => {
        setUpdating(true);
        setMessage("");
        try {
            const payload = {
                ...formData,
                previousHandicap: formData.previousHandicap || null,
                whatsapp: formData.whatsapp || null,
            };
            await updatePlayer(id, payload);
            toast.success("Player updated successfully!");
        } catch (err) {
            console.error(err);
            setMessage("Failed to update player.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <LoggedinLayout>
                <div className="text-center text-white p-4">Loading player data...</div>
            </LoggedinLayout>
        );
    }

    if (!formData) {
        return (
            <LoggedinLayout>
                <div className="text-center text-red-500 p-4">Player not found.</div>
            </LoggedinLayout>
        );
    }

    return (
        <LoggedinLayout>
            <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl my-10 text-left">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Update Player</h2>

                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                        <input
                            type="date"
                            name="birthDate"
                            className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Handicap</label>
                        <input
                            type="number"
                            name="handicap"
                            placeholder="0"
                            className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.handicap}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                        <select
                            name="rank"
                            className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.rank}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Rank</option>
                            <option value="junior">Junior</option>
                            <option value="senior">Senior</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="pro">Pro</option>
                            <option value="amateur">Amateur</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Previous Handicap (optional)</label>
                        <input
                            type="number"
                            name="previousHandicap"
                            placeholder="e.g. 5"
                            className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.previousHandicap}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (optional)</label>
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="e.g. +1234567890"
                            className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.whatsapp}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        onClick={handleUpdate}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Update Player"}
                    </button>

                    {message && (
                        <p className="text-center text-green-600 text-sm mt-2">{message}</p>
                    )}
                </div>
            </div>
        </LoggedinLayout>
    );
};

export default UpdatePlayer;
