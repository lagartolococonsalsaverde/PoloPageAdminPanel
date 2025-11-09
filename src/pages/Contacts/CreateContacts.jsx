import React, { useState } from "react";
import LoggedinLayout from "../../components/LoggedinLayout";
import { createPlayer } from "../../services/dashboard.api";
import { createContact } from "../../services/contact";

const initialFormState = {
  type: "",
  description: "",
};

const CreateContact = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "contact" || name === "previousContact"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        type: formData.type,
        description: formData.description || null,
      };
      await createContact(payload);
      setMessage("Contact added successfully!");
      setFormData(initialFormState);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add contact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoggedinLayout>
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl my-10 text-left">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Create New Contact
        </h2>

        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <input
              type="text"
              name="type"
              placeholder="Enter the type"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.type}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              name="description"
              placeholder="optional"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Contact"}
          </button>

          {message && (
            <p className="text-center text-green-600 text-sm mt-2">{message}</p>
          )}
        </div>
      </div>
    </LoggedinLayout>
  );
};

export default CreateContact;
