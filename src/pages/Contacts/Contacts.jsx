import  { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import LoggedinLayout from "../../components/LoggedinLayout";
import { Link, useNavigate } from "react-router-dom";
import { deleteContacts, fetchContacts } from "../../services/contacts";

const PER_PAGE = 10;

const Contacts = () => {
  const navigate = useNavigate();

  const [contacts, setcontacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getContacts = async () => {
    setLoading(true);
    try {
      const response = await fetchContacts(currentPage + 1, PER_PAGE);
      if (response) {
        setcontacts(response.data || []);
        setTotal(response.total);
      } else {
        setError("Failed to fetch contacts");
      }
    } catch (err) {
      setError("Error fetching contacts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContacts();
  }, [currentPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDeleteClick = (contactId) => {
    setSelectedContactId(contactId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteContacts(selectedContactId);
      setShowConfirmModal(false);
      setSelectedContactId(null);
      getContacts(); // Refresh list
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const pageCount = Math.ceil(total / PER_PAGE);

  return (
    <LoggedinLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold text-white mb-6">Contacts</h2>

        <Link
          to={"/create-contact"}
          className="block w-fit mx-auto bg-blue-50 hover:bg-blue-100 rounded-md text-blue-900 px-4 py-2 mb-4"
        >
          Add Contact
        </Link>

        {loading && <p className="text-white">Loading contacts...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">
                      Number
                    </th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="hover:bg-gray-50 transition"
                      onClick={() => navigate(`/update-contact/${contact._id}`)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {contact.name || "--"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {contact.number || "--"}
                      </td>
                      <td className="px-6 py-4 text-sm text-center z-10">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteClick(contact._id);
                          }}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              previousLabel="< Prev"
              onPageChange={handlePageClick}
              pageCount={pageCount}
              forcePage={currentPage}
              containerClassName={
                "flex space-x-2 bg-white p-3 justify-center rounded-lg shadow-md mt-6"
              }
              pageClassName={"px-3 py-2 bg-gray-100 rounded-md cursor-pointer"}
              pageLinkClassName={"text-gray-700"}
              previousClassName={"px-4 py-2 bg-blue-500 text-white rounded-md"}
              nextClassName={"px-4 py-2 bg-blue-500 text-white rounded-md"}
              activeClassName={"!bg-blue-500 text-white"}
              activeLinkClassName="text-white"
            />
          </>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 bg-[#00000055] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-96 text-center">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this Contact?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={deleting}
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

export default Contacts;
