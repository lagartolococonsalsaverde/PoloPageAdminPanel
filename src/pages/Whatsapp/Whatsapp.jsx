import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import LoggedinLayout from "../../components/LoggedinLayout";
import { fetchReplies, sendMessage } from "../../services/whatsapp.api";

const PER_PAGE = 10;

const Whatsapp = () => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [numbers, setNumbers] = useState("");

  const getReplies = async () => {
    setLoading(true);
    try {
      const response = await fetchReplies(currentPage + 1, PER_PAGE);
      if (response?.data) {
        setReplies(response.data);
        setTotal(response.total);
      } else {
        setError("Failed to fetch replies");
      }
    } catch (err) {
      setError("Error fetching replies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReplies();
  }, [currentPage]);

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const handleSendMessage = async () => {
    const numArray = numbers
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    if (!numArray.length || !message) {
      alert("Please enter numbers and message text");
      return;
    }

    setSending(true);
    try {
      await sendMessage(numArray, message);
      setShowSendModal(false);
      setNumbers("");
      setMessage("");
      alert("Messages sent successfully!");
    } catch (err) {
      console.error("Send failed:", err);
      alert("Failed to send messages");
    } finally {
      setSending(false);
    }
  };

  const pageCount = Math.ceil(total / PER_PAGE);

  return (
    <LoggedinLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold text-white mb-6">
          WhatsApp Replies
        </h2>

        <button
          onClick={() => setShowSendModal(true)}
          className="block w-fit mx-auto bg-green-100 hover:bg-green-200 rounded-md text-green-900 px-4 py-2 mb-4"
        >
          Send Message
        </button>

        {loading && <p className="text-white">Loading replies...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">
                      From
                    </th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">
                      Message
                    </th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {replies.map((reply) => (
                    <tr
                      key={reply._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 text-center">
                        {reply.from || "--"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        {reply.text || "--"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        {new Date(reply.timestamp).toLocaleString()}
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

        {showSendModal && (
          <div className="fixed inset-0 bg-[#00000055] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-96 text-center">
              <h3 className="text-lg font-semibold mb-4">Send Message</h3>

              <textarea
                placeholder="Enter comma-separated phone numbers (e.g. 923365746899,92300112233)"
                className="w-full border p-2 mb-3 rounded-md"
                rows={2}
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
              />

              <textarea
                placeholder="Enter your message"
                className="w-full border p-2 mb-3 rounded-md"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoggedinLayout>
  );
};

export default Whatsapp;
