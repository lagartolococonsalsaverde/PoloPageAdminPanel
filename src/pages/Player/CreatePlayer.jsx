import React, { useEffect, useState } from "react";
import LoggedinLayout from "../../components/LoggedinLayout";
import { createPlayer } from "../../services/dashboard.api";
import { fetchHandicaps } from "../../services/handicap";
import { toast } from "react-toastify";

const initialFormState = {
    name: "",
    birthDate: "",
    handicap: 0,
    gender: "",
    rank: "junior",
    category: "pro",
    previousHandicap: "",
    whatsapp: "",
};

const CreatePlayer = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [handicaps, setHandicaps] = useState([]);
    const [availableHandicaps, setAvailableHandicaps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "handicap" || name === "previousHandicap" ? Number(value) : value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Full name is required.";
        if (!formData.birthDate) newErrors.birthDate = "Birth date is required.";
        // if (formData.handicap === null || formData.handicap === "") newErrors.handicap = "Handicap is required.";
        if (!formData.gender) newErrors.gender = "Gender is required.";
        if (!formData.whatsapp) newErrors.whatsapp = "Whatsapp number is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        // Check for duplicate types
        const typeCounts = {};
        for (const h of handicaps) {
            if (h.type) {
                typeCounts[h.type] = (typeCounts[h.type] || 0) + 1;
            }
        }

        // Find if any type appears more than 2 times
        const duplicateType = Object.entries(typeCounts).find(([_, count]) => count > 1);

        if (duplicateType) {
            // Show error however you want — toast, state error, alert, etc.
            toast.error(`The handicap type appears more than once.`);
            return; // Stop further update
        }

        setLoading(true);
        setMessage("");
        try {
            const payload = {
                ...formData,
                previousHandicap: formData.previousHandicap || null,
                whatsapp: formData.whatsapp || null,
                handicaps: handicaps.filter((h) => h.type),
            };
            const response = await createPlayer(payload);
            if (response?.success) {
                setMessage("Player created successfully!");
                setFormData(initialFormState);
                setHandicaps([]);
                setErrors({});
            } else {
                // toast.error(response.message)
            }
        } catch (err) {
            console.error(err);
            setMessage("Failed to create player.");
        } finally {
            setLoading(false);
        }
    };

    // const handleHandicapChange = (index, field, value) => {
    //     const updated = [...handicaps];
    //     updated[index][field] = field === "number" ? Number(value) : value;
    //     setHandicaps(updated);
    // };

    const handleHandicapChange = (index, field, value) => {
        const updated = [...handicaps];
        updated[index][field] = field === "number" ? Number(value) : value;

        // if (field === "number") {
        //     setHandicaps(updated)
        //     return;
        // }

        // // Check for duplicate types
        // const typeCounts = {};
        // for (const h of updated) {
        //     if (h.type) {
        //         typeCounts[h.type] = (typeCounts[h.type] || 0) + 1;
        //     }
        // }

        // // Find if any type appears more than 2 times
        // const duplicateType = Object.entries(typeCounts).find(([_, count]) => count > 1);

        // if (duplicateType) {
        //     // Show error however you want — toast, state error, alert, etc.
        //     toast.error(`Duplicate handicaps not allowed.`);
        //     return; // Stop further update
        // }

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

    return (
        <LoggedinLayout>
            <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl my-10 text-left">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Create New Player</h2>

                <div className="grid gap-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            className="border border-gray-300 p-3 rounded-xl w-full focus:ring-blue-400"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date *</label>
                        <input
                            type="date"
                            name="birthDate"
                            className="border border-gray-300 p-3 rounded-xl w-full focus:ring-blue-400"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                        {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                    </div>

                    {/* Handicap */}
                    {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Handicap *</label>
            <input
              type="number"
              name="handicap"
              placeholder="0"
              className="border border-gray-300 p-3 rounded-xl w-full focus:ring-blue-400"
              value={formData.handicap}
              onChange={handleChange}
            />
            {errors.handicap && <p className="text-red-500 text-sm mt-1">{errors.handicap}</p>}
          </div> */}

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                        <select
                            name="gender"
                            className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:ring-blue-400"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                    </div>

                    {/* Optional Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Previous Handicap (optional)</label>
                        <input
                            type="number"
                            name="previousHandicap"
                            placeholder="e.g. 5"
                            className="border border-gray-300 p-3 rounded-xl w-full focus:ring-blue-400"
                            value={formData.previousHandicap}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="e.g. +1234567890"
                            className="border border-gray-300 p-3 rounded-xl w-full focus:ring-blue-400"
                            value={formData.whatsapp}
                            onChange={handleChange}
                        />
                        {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
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
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Player"}
                    </button>

                    {message && (
                        <p className="text-center text-green-600 text-sm mt-2">{message}</p>
                    )}
                </div>
            </div>
        </LoggedinLayout>
    );
};

export default CreatePlayer;
