import React, { useEffect, useState } from "react";
import { confirmResponse, fetchFormResponses } from "../../services/dashboard.api";
import { useNavigate, useParams } from "react-router-dom";
import LoggedinLayout from "../../components/LoggedinLayout";
import ReactPaginate from "react-paginate";
import ViewFileButton from "./components/ViewFileButton";

const FormResponses = () => {
  const { id, title } = useParams();
  const navigate = useNavigate();
  const [formResponses, setFormResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isConfirmLoading, setIsConfirmLoading] = useState(-1);
  const [isRefreshRecords, setIsRefreshRecords] = useState(false);
  const itemsPerPage = 20; // Adjust as needed

  useEffect(() => {
    if (!id) return;

    const fetchResponses = async () => {
      try {
        const response = await fetchFormResponses(id, selectedStatus, currentPage, itemsPerPage);
        // console.log(response)
        setFormResponses(response?.response);
        setTotalRecords(response?.total)

      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [id, currentPage, selectedStatus, isRefreshRecords]);


  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const handleConfirmClick = async (responseId) => {
    try {
      setIsConfirmLoading(responseId);
      const response = await confirmResponse(responseId);
      if (response) {
        setIsRefreshRecords(!isRefreshRecords);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setIsConfirmLoading(-1);
      setLoading(false);
    }
  }

  return (
    <LoggedinLayout>
      <h2 className="text-3xl font-bold text-white mb-6 text-center mt-10">
        📝 Responses for Form {title}
      </h2>

      <div>
        <select value={selectedStatus} onChange={(e) => {
          setCurrentPage(1);
          setSelectedStatus(e.target.value)
        }}
          className="p-2 outline-0 bg-white rounded-lg cursor-pointer">
          <option value="">Select Status</option>
          <option value="new-lead">New Lead</option>
          <option value="sent">Sent</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg py-10 flex justify-center">
        <table className="w-9/10 border border-gray-200 divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100 text-center uppercase tracking-wide">
              <th className="px-4 py-3 border-b border-gray-300">Form ID</th>
              <th className="px-4 py-3 border-b border-gray-300">Pet Name</th>
              <th className="px-4 py-3 border-b border-gray-300">Owner Name</th>
              <th className="px-4 py-3 border-b border-gray-300">Phone</th>
              <th className="px-4 py-3 border-b border-gray-300">Status</th>
              <th className="px-4 py-3 border-b border-gray-300">Created</th>
              <th className="px-4 py-3 border-b border-gray-300">File</th>
              <th className="px-4 py-3 border-b border-gray-300">Confirmation</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="bg-white transition-all duration-300">
                <td colSpan={8} className="py-10 text-center">Loading Responses...</td>
              </tr>
            )}

            {!loading && formResponses?.length > 0 &&
              formResponses?.map((formResponse, index) => (
                <tr
                  key={formResponse.responseId}
                  onClick={() => navigate(`/form-response/${formResponse.responseId}`)}
                  className="odd:bg-gray-50 even:bg-white hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                >
                  <td className="px-4 py-3 border-b border-gray-300 text-center">{formResponse.formId}</td>
                  <td className="px-4 py-3 border-b border-gray-300 text-center font-medium">{formResponse.petName || "-"}</td>
                  <td className="px-4 py-3 border-b border-gray-300 text-center">{formResponse.name}</td>
                  <td className="px-4 py-3 border-b border-gray-300 text-center">{formResponse.phone || "N/A"}</td>
                  <td className="px-4 py-3 border-b border-gray-300 text-center">
                    {formResponse?.status || "--"}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300 text-center">
                    {new Date(formResponse.created).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300 text-center" onClick={(e) => e.stopPropagation()} >
                    <ViewFileButton fileUrl={formResponse?.fileUrl} />
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300 text-center" onClick={(e) => e.stopPropagation()} >
                    <button onClick={() => handleConfirmClick(formResponse?.responseId)}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white px-4 py-1 rounded-md transition-all duration-300 text-sm font-semibold"
                      disabled={formResponse?.status?.toLowerCase() !== 'new-lead'}>
                      {isConfirmLoading === formResponse?.responseId ? "Confirming..." : "Confirm"}</button>
                  </td>
                </tr>
              ))
            }

            {!loading && formResponses.length === 0 && (
              <tr className="odd:bg-gray-50 even:bg-white hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                <td colSpan={7} className="py-4 text-center">No Responses Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {(totalRecords / itemsPerPage) > 1 && (
        <div className="flex justify-center mt-6">
          <ReactPaginate
            previousLabel={"← Prev"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={totalRecords / itemsPerPage}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={"flex space-x-2 bg-gray-100 p-2 rounded-lg"}
            pageClassName={"px-3 py-2 bg-white border rounded-lg cursor-pointer"}
            pageLinkClassName={"text-gray-700"}
            previousClassName={"px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"}
            nextClassName={"px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"}
            activeClassName={"!bg-blue-500 border-none"}
            activeLinkClassName="text-white"
          />
        </div>
      )}
    </LoggedinLayout>
  );
};

export default FormResponses;
