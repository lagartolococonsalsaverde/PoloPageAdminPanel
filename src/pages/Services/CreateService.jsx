import { useState } from "react";
import LoggedinLayout from "../../components/LoggedinLayout";
import { createService } from "../../services/services";
import { useNavigate } from "react-router-dom";
import { CategoryTypes } from "./enum"; // adjust path if needed

const CATEGORY_OPTIONS = Object.values(CategoryTypes);

const CreateService = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    whatsapp: "",
    category: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createService(form);
    navigate("/services");
  };

  return (
    <LoggedinLayout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Create Service</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            name="name"
            placeholder="Service name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          {/* WhatsApp */}
          <input
            name="whatsapp"
            placeholder="WhatsApp number"
            value={form.whatsapp}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          {/* Location */}
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          {/* Category Dropdown */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
            required
          >
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create Service
          </button>
        </form>
      </div>
    </LoggedinLayout>
  );
};

export default CreateService;
