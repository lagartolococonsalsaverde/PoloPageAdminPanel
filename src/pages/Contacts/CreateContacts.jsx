import { useState } from "react";
import LoggedinLayout from "../../components/LoggedinLayout";
import { createContact } from "../../services/contacts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialFormState = {
  name: "",
  number: "",
};

const CreateContact = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate()

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
      debugger
      if (!formData.name) {
        toast.error("Please enter a name.")
      }

      if (!formData.number) {
        toast.error("Please enter a phone number.")
      }

      if (formData?.name?.length > 100) {
        toast.error("Name length should be less than 100.")
      }

      if (formData?.number?.length > 15) {
        toast.error("Number length should be less than 16.")
      }

      if ((formData.number.trim()).includes(" ")) {
        toast.error("Spaces not allowed in phone number");
      }

      const payload = {
        name: formData.name,
        number: (formData.number.trim()) || null,
      };
      await createContact(payload);
      setMessage("Contact added successfully!");
      setFormData(initialFormState);
      navigate("/contacts")
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
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter the name"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="number"
              placeholder="+12-------"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.number}
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
            <p className="text-center text-green-600 font-medium text-[15px] mt-2 py-6 px-5 bg-green-100 rounded-xl">{message}</p>
          )}
        </div>
      </div>
    </LoggedinLayout>
  );
};

export default CreateContact;
