import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoggedinLayout from "../../components/LoggedinLayout";
import { toast } from "react-toastify";
import { fetchContactsById, updateContacts } from "../../services/contacts";

const UpdateContacts = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await fetchContactsById(id);
        setFormData({
          type: data.type || "",
          description: data.description || "",
        });
      } catch (err) {
        console.error("Error fetching Contacts:", err);
        setMessage("Failed to fetch Contacts data.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "contacts" || name === "previousContacts"
          ? Number(value)
          : value,
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setMessage("");
    try {
      const payload = {
        ...formData,
      };
      await updateContacts(id, payload);
      toast.success("Contacts updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update contacts.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <LoggedinLayout>
        <div className="text-center text-white p-4">
          Loading Contacts data...
        </div>
      </LoggedinLayout>
    );
  }

  if (!formData) {
    return (
      <LoggedinLayout>
        <div className="text-center text-red-500 p-4">Contacts not found.</div>
      </LoggedinLayout>
    );
  }

  return (
    <LoggedinLayout>
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl my-10 text-left">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Update Contacts
        </h2>

        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              type
            </label>
            <input
              type="text"
              name="type"
              placeholder="Enter type"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.type}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              type
            </label>
            <input
              type="text"
              name="description"
              placeholder="Enter description"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleUpdate}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Contacts"}
          </button>

          {message && (
            <p className="text-center text-green-600 text-sm mt-2">{message}</p>
          )}
        </div>
      </div>
    </LoggedinLayout>
  );
};

export default UpdateContacts;
