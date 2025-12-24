import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import LoggedinLayout from "../../components/LoggedinLayout";
import { Link, useNavigate } from "react-router-dom";
import { UserCircleIcon, Trash2, Edit } from "lucide-react";
import { fetchServices, deleteServices } from "../../services/services";
import { CategoryTypes } from "./enum";
import CommentSection from "../../components/CommentSection";

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
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-green-800">Services</h1>
          <Link
            to="/create-service"
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Post a Listing
          </Link>
        </div>

        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => {
                setCategoryFilter("");
                setCurrentPage(0);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${categoryFilter === ""
                  ? "bg-green-700 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              All
            </button>
            {CATEGORY_TYPES.map((ct) => (
              <button
                key={ct}
                onClick={() => {
                  setCategoryFilter(ct);
                  setCurrentPage(0);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${categoryFilter === ct
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                {ct}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading listings...
          </div>
        ) : (
          <div className="space-y-6">
            {services.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">No services found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {services.map((s) => (
                  <div
                    key={s._id}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition relative"
                  >
                    {/* Admin Actions */}
                    <div className="absolute top-6 right-6 flex gap-2">
                      <button
                        onClick={() => navigate(`/update-service/${s._id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Edit Service"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(s._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition"
                        title="Delete Service"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-start justify-between mb-4 pr-20">
                      <div>
                        <h3 className="text-xl font-semibold text-green-800 mb-1">
                          {s.name}
                        </h3>
                        <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          {s.category || "Uncategorized"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      {s.user?.avatar ? (
                        <img
                          src={s.user.avatar}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <UserCircleIcon size={24} />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {s.user?.username || s.user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {/* Add date if available, or just role/placeholder */}
                          Owner
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 w-20">Price:</span>
                          {s.price ? `$${s.price}` : "Not specified"}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 w-20">Location:</span>
                          {s.location || "Not provided"}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 w-20">WhatsApp:</span>
                          {s.whatsapp || "N/A"}
                        </p>
                      </div>
                    </div>

                    <CommentSection listingId={s._id} />
                  </div>
                ))}
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
                containerClassName="flex space-x-2 bg-white p-3 justify-center rounded-lg shadow-md mt-6 w-fit mx-auto"
                pageClassName="px-3 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                pageLinkClassName="text-gray-700"
                previousClassName="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                nextClassName="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                activeClassName="!bg-green-700 !text-white"
                activeLinkClassName="text-white"
              />
            )}
          </div>
        )}

        {/* Delete Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center transform transition-all scale-100">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Service?</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to remove this listing? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition shadow-sm"
                >
                  {deleting ? "Deleting..." : "Delete Listing"}
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

