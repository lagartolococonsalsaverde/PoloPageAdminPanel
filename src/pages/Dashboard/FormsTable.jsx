import React, { useEffect, useState } from "react";
import { fetchForms } from "../../services/dashboard.api";
import { useNavigate } from "react-router-dom";


const FormsTable = ({ onViewResponses }) => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const getForms = async () => {
      try {
        const response = await fetchForms();
        if (response) {
          setForms(response);
        } else {
          setError("Failed to fetch forms");
        }
      } catch (err) {
        setError("Error fetching forms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getForms();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-white mb-6">Forms Dashboard</h2>

      {loading && <p className="text-white">Loading forms...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">ID</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Title</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">View Form</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">View Responses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {forms.map((form) => (
                <tr key={form.id} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition">
                  <td className="py-3 px-4 text-sm text-gray-700">{form.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{form.title}</td>
                  <td className="py-3 px-4">
                    <a
                      href={form._links.display}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Open
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/form-responses-list/${form.id}/${form.title}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 cursor-pointer transition-all"
                    >
                      View Responses
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormsTable;
