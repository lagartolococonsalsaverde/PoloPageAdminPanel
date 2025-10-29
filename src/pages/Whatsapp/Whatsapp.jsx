import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import LoggedinLayout from "../../components/LoggedinLayout";
import { fetchReplies, sendMessage } from "../../services/whatsapp.api";

const PER_PAGE = 10;

const WhatsApp = () => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [to, setTo] = useState("");

  const getReplies = async () => {
    setLoading(true);
    try {
      const res = await fetchReplies(page + 1, PER_PAGE);
      if (res?.data) {
        setReplies(res.data);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching replies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReplies();
  }, [page]);

const handleSend = async (e) => {
  e.preventDefault();
  setSending(true);
  try {
    // Backend expects numbers[], flowName, and bodyText
    const payload = {
      numbers: [to],              // array of one or more numbers
      flowName: "flow_test",      // or make this dynamic via input later
      bodyText: message || "Default Body",
    };

    await sendMessage(payload);
    alert("Message sent successfully!");
    setModalOpen(false);
    setMessage("");
    setTo("");
    getReplies();
  } catch (err) {
    console.error("❌ Send Error:", err);
    alert("Failed to send message");
  } finally {
    setSending(false);
  }
};

  const handlePageClick = ({ selected }) => setPage(selected);

  const parseMessage = (reply) => {
    if (reply.type === "text") return reply.raw?.text?.body || reply.content;
    if (reply.type === "interactive") {
      const nfm = reply.raw?.interactive?.nfm_reply;
      if (nfm) {
        try {
          const parsed = JSON.parse(nfm.response_json || "{}");
          return (
            <>
              <p className="font-semibold text-blue-800">{nfm.body || "Flow Reply"}</p>
              <div className="text-gray-700 text-sm mt-1 space-y-0.5">
                {Object.entries(parsed).map(([key, val]) => (
                  <p key={key}>
                    <span className="font-medium">{key}</span>: {val}
                  </p>
                ))}
              </div>
            </>
          );
        } catch {
          return nfm.body || reply.content;
        }
      }
    }
    return "--";
  };

  const formatDate = (timestamp) => {
    const ms = Number(timestamp) * 1000;
    if (isNaN(ms)) return "--";
    return new Date(ms).toLocaleString("en-US", { timeZone: "Asia/Beirut" });
  };

  return (
    <LoggedinLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 p-8 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">WhatsApp Replies</h2>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-green-200 text-green-900 font-medium px-6 py-2 rounded-lg shadow-md hover:bg-green-300 transition"
            >
              Send Message
            </button>
          </div>

          {loading ? (
            <p className="text-center text-white">Loading replies...</p>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div
                  key={reply._id}
                  className="bg-white text-gray-900 rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition duration-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-blue-700">
                      From: {reply.from || "--"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(reply.timestamp)}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3 text-gray-800">
                    {parseMessage(reply)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div className="flex justify-center mt-8">
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next ›"
                previousLabel="‹ Prev"
                onPageChange={handlePageClick}
                pageCount={totalPages}
                forcePage={page}
                containerClassName="flex items-center space-x-2 bg-white rounded-lg shadow-md px-4 py-2"
                pageClassName="px-3 py-1 text-blue-700 cursor-pointer rounded-md hover:bg-blue-100"
                activeClassName="bg-blue-600 text-white"
                previousClassName="text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100"
                nextClassName="text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100"
              />
            </div>
          )}
        </div>
      </div>

      {/* Send Message Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white text-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Send WhatsApp Message</h3>

            <form onSubmit={handleSend}>
              <label className="block text-sm font-medium mb-1">To (phone number)</label>
              <input
                type="text"
                placeholder="e.g. 923001234567"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-sm font-medium mb-1">Recipient Name</label>
              <textarea
                placeholder="Type the recipient's name here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end mt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LoggedinLayout>
  );
};

export default WhatsApp;
