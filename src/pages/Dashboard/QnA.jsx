import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LoggedinLayout from "../../components/LoggedinLayout";
import ReactPaginate from "react-paginate";
import { formatDistanceToNow } from "date-fns";
import { fetchQnA } from "../../services/dashboard.api";
import { deleteAnswer, deleteQuestion } from "../../services/qna.api";

const QnA = () => {
  const [questionNAnswers, setQuestionNAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null); // { questionId, answerCreated }
  const [deleteQuestionTarget, setDeleteQuestionTarget] = useState(null); // questionId
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchQnAs = async () => {
      setLoading(true);
      try {
        const response = await fetchQnA(currentPage + 1, itemsPerPage);
        setQuestionNAnswers(response.data || []);
        setTotalRecords(response.total || 0);
      } catch (error) {
        console.error("Error fetching QnA:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQnAs();
  }, [currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDeleteAnswer = async (questionId, answerCreatedTime) => {
    try {
      await deleteAnswer(questionId, answerCreatedTime);

      setQuestionNAnswers(prev =>
        prev.map(q =>
          q._id === questionId
            ? {
              ...q,
              answers: q.answers.filter(a => a.createdAt !== answerCreatedTime),
            }
            : q
        )
      );
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting answer:", err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      setQuestionNAnswers(prev => prev.filter(q => q._id !== questionId));
      setDeleteQuestionTarget(null);
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  return (
    <LoggedinLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-green-900 mb-10 text-center">❓ Q&A Overview</h2>

        {loading ? (
          <p className="text-center text-green-900 text-lg">Loading Q&As...</p>
        ) : (
          <div className="grid gap-6">
            {questionNAnswers?.length > 0 ? (
              questionNAnswers.map((qa) => (
                <div key={qa._id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col items-start">
                      <h3 className="text-xl font-semibold text-gray-800">{qa.title}</h3>
                      <p className="text-gray-600 mt-1 whitespace-pre-line">{qa.content}</p>
                      <button
                        onClick={() => setDeleteQuestionTarget(qa._id)}
                        className="mt-3 text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        Delete Question
                      </button>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-bold text-blue-600">{qa.votes} Votes</div>
                      <div className="text-sm text-gray-400 mt-1">
                        Posted {formatDistanceToNow(new Date(qa.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Answers:</h4>
                    {qa.answers.length > 0 ? (
                      <ul className="space-y-3">
                        {qa.answers.map((ans, idx) => (
                          <li key={idx} className="bg-gray-100 p-4 rounded-lg">
                            <div className="flex justify-between">
                              <div className="text-gray-800">{ans.text}</div>
                              <div className="flex flex-col items-end">
                                <button
                                  onClick={() =>
                                    setDeleteTarget({ questionId: qa._id, answerCreated: ans.createdAt })
                                  }
                                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                >
                                  Delete
                                </button>
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDistanceToNow(new Date(ans.createdAt), { addSuffix: true })}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No answers yet.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white text-md italic">No Q&A data available.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(totalRecords / itemsPerPage) > 1 && (
          <div className="flex justify-center mt-10">
            <ReactPaginate
              previousLabel={"← Prev"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={Math.ceil(totalRecords / itemsPerPage)}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageChange}
              forcePage={currentPage}
              containerClassName={"flex space-x-2 bg-white p-3 justify-center rounded-lg shadow-md"}
              pageClassName={"px-3 py-2 bg-gray-100 rounded-md cursor-pointer"}
              pageLinkClassName={"text-gray-700"}
              previousClassName={"px-4 py-2 bg-blue-500 text-white rounded-md"}
              nextClassName={"px-4 py-2 bg-blue-500 text-white rounded-md"}
              activeClassName={"!bg-blue-500 text-white"}
              activeLinkClassName="text-white"
            />
          </div>
        )}

        {/* Delete Answer Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-[#00000055] flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p>Are you sure you want to delete this answer?</p>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                  {
                    debugger
                    handleDeleteAnswer(deleteTarget.questionId, deleteTarget.answerCreated)
                  }
                  }
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Question Modal */}
        {deleteQuestionTarget && (
          <div className="fixed inset-0 bg-[#00000055] flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Delete Question</h3>
              <p>Are you sure you want to delete this question and all its answers?</p>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setDeleteQuestionTarget(null)}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteQuestion(deleteQuestionTarget)}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Delete Question
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoggedinLayout>
  );
};

export default QnA;
