import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoggedinLayout from "../../components/LoggedinLayout";
import { fetchPlayerById, updatePlayer } from "../../services/dashboard.api";
import { toast } from "react-toastify";
import { fetchHandicaps } from "../../services/handicap";

const UpdatePlayer = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [handicaps, setHandicaps] = useState([]);
    const [availableHandicaps, setAvailableHandicaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const data = await fetchPlayerById(id);
                setFormData({
                    name: data.name || "",
                    birthDate: data.birthDate?.slice(0, 10) || "",
                    handicap: data.handicap ?? 0,
                    gender: data.gender || "",
                    // rank: data.rank || "junior",
                    // category: data.category || "pro",
                    previousHandicap: data.previousHandicap ?? "",
                    whatsapp: data.whatsapp ?? "",
                });
                setHandicaps(data.handicaps)
            } catch (err) {
                console.error("Error fetching player:", err);
                toast.error("Failed to fetch player data.");
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
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Full Name is required.";
        if (!formData.birthDate) newErrors.birthDate = "Birth Date is required.";
        // if (formData.handicap === "" || isNaN(formData.handicap)) newErrors.handicap = "Valid Handicap is required.";
        if (!formData.gender) newErrors.gender = "Gender is required.";
        return newErrors;
    };

    const handleUpdate = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setUpdating(true);
        try {
            const payload = {
                ...formData,
                previousHandicap: formData.previousHandicap || null,
                whatsapp: formData.whatsapp || null,
                handicaps: handicaps.filter((h) => h.type).map(({ _id, ...rest }) => rest),
            };
            const response = await updatePlayer(id, payload);
            if (response?.success) {
                toast.success("Player updated successfully!");
            } else {
                // toast.error(response?.message || "Something went wrong! Please Try Again.")
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update player.");
        } finally {
            setUpdating(false);
        }
    };

    const handleHandicapChange = (index, field, value) => {
        const updated = [...handicaps];
        updated[index][field] = field === "number" ? Number(value) : value;
        setHandicaps(updated);
    };

    const addHandicapField = () => {
        setHandicaps([...handicaps, { type: "", number: 0 }]);
    };

    const removeHandicapField = (index) => {
        setHandicaps(handicaps.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const fetchHandicapTypes = async () => {
            const res = await fetchHandicaps(1, 100);
            setAvailableHandicaps(res.data);
        };
        fetchHandicapTypes();
    }, []);

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
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            className={`border ${errors.name ? "border-red-500" : "border-gray-300"} p-3 rounded-xl w-full`}
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                        <input
                            type="date"
                            name="birthDate"
                            className={`border ${errors.birthDate ? "border-red-500" : "border-gray-300"} p-3 rounded-xl w-full`}
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                        {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                    </div>

                    {/* Handicap */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Handicap</label>
                        <input
                            type="number"
                            name="handicap"
                            className={`border ${errors.handicap ? "border-red-500" : "border-gray-300"} p-3 rounded-xl w-full`}
                            value={formData.handicap}
                            onChange={handleChange}
                        />
                        {errors.handicap && <p className="text-red-500 text-sm mt-1">{errors.handicap}</p>}
                    </div> */}

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            className={`border ${errors.gender ? "border-red-500" : "border-gray-300"} p-3 rounded-xl w-full bg-white`}
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                    </div>

                    {/* Rank */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                        <select
                            name="rank"
                            className="border border-gray-300 p-3 rounded-xl w-full bg-white"
                            value={formData.rank}
                            onChange={handleChange}
                        >
                            <option value="junior">Junior</option>
                            <option value="senior">Senior</option>
                        </select>
                    </div> */}

                    {/* Category */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            className="border border-gray-300 p-3 rounded-xl w-full bg-white"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="pro">Pro</option>
                            <option value="amateur">Amateur</option>
                        </select>
                    </div> */}

                    {/* Previous Handicap */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Previous Handicap (optional)</label>
                        <input
                            type="number"
                            name="previousHandicap"
                            placeholder="e.g. 5"
                            className="border border-gray-300 p-3 rounded-xl w-full"
                            value={formData.previousHandicap}
                            onChange={handleChange}
                        />
                    </div>

                    {/* WhatsApp */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (optional)</label>
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="e.g. +1234567890"
                            className="border border-gray-300 p-3 rounded-xl w-full"
                            value={formData.whatsapp}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Handicap Allotments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Handicap Allotments</label>
                        {handicaps?.map((h, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <select
                                    value={h.type}
                                    onChange={(e) => handleHandicapChange(index, "type", e.target.value)}
                                    className="border border-gray-300 p-3 rounded-xl w-full focus:ring-blue-400"
                                >
                                    <option value="">Select Type</option>
                                    {availableHandicaps.map((opt) => (
                                        <option key={opt._id} value={opt._id}>{opt.type}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Value"
                                    value={h.number}
                                    onChange={(e) => handleHandicapChange(index, "number", e.target.value)}
                                    className="border border-gray-300 p-3 rounded-xl w-full focus:ring-blue-400"
                                />
                                {/* {index > 0 && ( */}
                                    <button
                                        type="button"
                                        onClick={() => removeHandicapField(index)}
                                        className="text-red-500 text-xl"
                                    >
                                        ×
                                    </button>
                                {/* )} */}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addHandicapField}
                            className="text-blue-500 text-sm mt-1 hover:underline"
                        >
                            + Add Handicap
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Update Player"}
                    </button>
                </div>
            </div>
        </LoggedinLayout>
    );
};

export default UpdatePlayer;
