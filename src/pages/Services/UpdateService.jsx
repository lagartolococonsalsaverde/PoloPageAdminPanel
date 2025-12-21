
import { useEffect, useState } from "react";
import LoggedinLayout from "../../components/LoggedinLayout";
import { fetchServiceById, updateService } from "../../services/services";
import { useNavigate, useParams } from "react-router-dom";

const UpdateService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {


    const fetchService = async () => {
      try {
        const data = await fetchServiceById(id);
        setForm({
          ...data
        });
      } catch (err) {
        console.error("Error fetching services:", err);
        toast.error("Failed to fetch service data.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    delete form._id; // remove _id before sending update
    delete form.createdAt; // remove createdAt before sending update
    delete form.updatedAt; // remove updatedAt before sending update
    delete form.__v; // remove __v before sending update
    await updateService(id, form);
    navigate("/services");
  };

  // debugger;
  if (!form) return null;

  return (
    <LoggedinLayout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Update Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(form).map((key) =>
            key === "_id" ? null : (
              <input
                key={key}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className="w-full p-3 border rounded"
              />
            )
          )}
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Update
          </button>
        </form>
      </div>
    </LoggedinLayout>
  );
};

export default UpdateService;
