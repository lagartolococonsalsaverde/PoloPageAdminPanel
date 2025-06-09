import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { fetchPlayers, deletePlayer } from "../../services/dashboard.api";
import LoggedinLayout from "../../components/LoggedinLayout";
import { Link, useNavigate } from "react-router-dom";

const PER_PAGE = 10;

const Players = () => {

  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetchPlayers(currentPage + 1, PER_PAGE);
      if (response) {
        setPlayers(response.data || []);
        setTotal(response.total);
      } else {
        setError("Failed to fetch players");
      }
    } catch (err) {
      setError("Error fetching players");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlayers();
  }, [currentPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDeleteClick = (playerId) => {
    setSelectedPlayerId(playerId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deletePlayer(selectedPlayerId);
      setShowConfirmModal(false);
      setSelectedPlayerId(null);
      getPlayers(); // Refresh list
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

        <h2 className="text-2xl font-semibold text-green-900 mb-6">Players</h2>

        <Link to={'/create-player'} className="block w-fit mx-auto bg-green-50 hover:bg-green-100 rounded-md text-green-900 px-4 py-2 mb-4">
          Create Player</Link>

        {loading && <p className="text-green-900">Loading players...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">Name</th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">Gender</th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">Age</th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">Handicap</th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">Rank</th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">Birth Date</th>
                    <th className="px-6 py-3 text-xs text-center font-bold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {players.map((player) => (
                    <tr key={player._id} className="hover:bg-gray-50 transition" onClick={() => navigate(`/update-player/${player._id}`)}>
                      <td className="px-6 py-4 text-sm text-gray-900">{player.name || "--"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">{player.gender || "--"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{player.age || "--"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{player.handicap ?? "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">{player.rank || "--"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">{player.category || "--"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(player.birthDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-center z-10">
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDeleteClick(player._id)
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
              containerClassName={"flex space-x-2 bg-white p-3 justify-center rounded-lg shadow-md mt-6"}
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
              <p className="text-gray-700 mb-6">Are you sure you want to delete this player?</p>
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

export default Players;
