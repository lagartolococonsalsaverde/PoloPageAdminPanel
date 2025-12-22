import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import LoggedinLayout from "../../components/LoggedinLayout";
import { Link, useNavigate } from "react-router-dom";
import { UserCircleIcon } from "lucide-react";
import { fetchServices, deleteServices } from "../../services/services";
import { CategoryTypes } from "./enum"; // adjust path if needed

const PER_PAGE = 10;
const CATEGORY_TYPES = Object.values(CategoryTypes);

const Services = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [categoryFilter, setCategoryFilter] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getServices = async () => {
    setLoading(true);
    try {
      const res = await fetchServices(
        currentPage + 1,
        PER_PAGE,
        categoryFilter
      );
      setServices(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, [currentPage, categoryFilter]);

  const handleDeleteClick = (id) => {
    setSelectedServiceId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteServices(selectedServiceId);
      setShowConfirmModal(false);
      setSelectedServiceId(null);
      getServices();
      toast.success("Service deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err.response?.data?.message || "Failed to delete service");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <LoggedinLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-white">Services</h2>

          <div className="flex gap-3">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCurrentPage(0);
                setCategoryFilter(e.target.value);
              }}
              className="bg-white border px-3 py-2 rounded-md"
            >
              <option value="">All Categories</option>
              {CATEGORY_TYPES.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>

            <Link
              to="/create-service"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Add Service
            </Link>
          </div>
        </div>

        {/* Table */}
        {loading && <p className="text-white">Loading services...</p>}

        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-sm text-left">Name</th>
                  <th className="px-4 py-3 text-sm text-left">Category</th>
                  <th className="px-4 py-3 text-sm text-left">Posted By</th>
                  <th className="px-4 py-3 text-sm text-left">Price</th>
                  <th className="px-4 py-3 text-sm text-left">Location</th>
                  <th className="px-4 py-3 text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No services found
                    </td>
                  </tr>
                )}

                {services.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/update-service/${s._id}`)}
                  >
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                        {s.category || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-gray-700 text-sm">
                        <UserCircleIcon size={16} className="mr-1" />
                        <span>{s.user?.username || s.user?.name || "Unknown User"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">${s.price}</td>
                    <td className="px-4 py-3">{s.location}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(s._id);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > PER_PAGE && (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            previousLabel="< Prev"
            onPageChange={({ selected }) => setCurrentPage(selected)}
            pageCount={Math.ceil(total / PER_PAGE)}
            forcePage={currentPage}
            containerClassName="flex space-x-2 bg-white p-3 justify-center rounded-lg shadow-md mt-6"
            pageClassName="px-3 py-2 bg-gray-100 rounded-md cursor-pointer"
            pageLinkClassName="text-gray-700"
            previousClassName="px-4 py-2 bg-blue-500 text-white rounded-md"
            nextClassName="px-4 py-2 bg-blue-500 text-white rounded-md"
            activeClassName="!bg-blue-500 text-white"
            activeLinkClassName="text-white"
          />
        )}


        {/* Delete Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg text-center w-96">
              <p className="mb-4 text-lg font-medium">
                Delete this service?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoggedinLayout>
  );
};

export default Services;
