import React, { useEffect, useState } from "react";
import LoggedinLayout from "../../components/LoggedinLayout";
import { createPlayer } from "../../services/dashboard.api";
import { fetchHandicaps } from "../../services/handicap";

const initialFormState = {
  name: "",
  birthDate: "",
  handicap: 0,
  gender: "male",
  rank: "junior",
  category: "pro",
  previousHandicap: "",
  whatsapp: "",
};

const CreatePlayer = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [handicaps, setHandicaps] = useState([{ type: "", number: 0 }]);
  const [availableHandicaps, setAvailableHandicaps] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "handicap" || name === "previousHandicap"
          ? Number(value)
          : value,
    }));
  };

  //   const handleSubmit = async () => {
  //     setLoading(true);
  //     setMessage("");
  //     try {
  //       const payload = {
  //         ...formData,
  //         previousHandicap: formData.previousHandicap || null,
  //         whatsapp: formData.whatsapp || null,
  //       };
  //       await createPlayer(payload);
  //       setMessage("Player created successfully!");
  //       setFormData(initialFormState);
  //     } catch (err) {
  //       console.error(err);
  //       setMessage("Failed to create player.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        ...formData,
        previousHandicap: formData.previousHandicap || null,
        whatsapp: formData.whatsapp || null,
        handicaps: handicaps.filter((h) => h.type), // remove empty entries
      };
      await createPlayer(payload);
      setMessage("Player created successfully!");
      setFormData(initialFormState);
      setHandicaps([{ type: "", number: 0 }]);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create player.");
    } finally {
      setLoading(false);
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
    const updated = handicaps.filter((_, i) => i !== index);
    setHandicaps(updated);
  };

  useEffect(() => {
    const fetchHandicapTypes = async () => {
      const res = await fetchHandicaps(1, 100); // Your API call
      setAvailableHandicaps(res.data);
    };
    fetchHandicapTypes();
  }, []);

  return (
    <LoggedinLayout>
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl my-10 text-left">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Create New Player
        </h2>

        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
            </label>
            <input
              type="date"
              name="birthDate"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Handicap
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rank
            </label>
            <select
              name="rank"
              className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.rank}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Rank
              </option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
            </select>
          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              className="border border-gray-300 p-3 rounded-xl w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="pro">Pro</option>
              <option value="amateur">Amateur</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Previous Handicap (optional)
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number (optional)
            </label>
            <input
              type="text"
              name="whatsapp"
              placeholder="e.g. +1234567890"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.whatsapp}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Handicap Allotments
            </label>
            {handicaps.map((h, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                {/* <select
                  value={h.type}
                  onChange={(e) =>
                    handleHandicapChange(index, "type", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-md w-2/3"
                >
                  <option value="">Select Type</option>
                  {availableHandicaps.map((opt) => (
                    <option key={opt._id} value={opt._id}>
                      {opt.name}
                    </option>
                  ))}
                </select> */}

                <select
                  value={h.type}
                  onChange={(e) =>
                    handleHandicapChange(index, "type", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-md w-2/3"
                >
                  <option value="">Select Type</option>
                  {availableHandicaps.map((opt) => (
                    <option key={opt._id} value={opt._id}>
                      {opt.type}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Value"
                  value={h.number}
                  onChange={(e) =>
                    handleHandicapChange(index, "number", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-md w-1/3"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeHandicapField(index)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addHandicapField}
              className="text-blue-500 text-sm mt-1"
            >
              + Add Handicap
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
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
