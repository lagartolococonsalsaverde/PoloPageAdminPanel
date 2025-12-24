import React, { useEffect, useState } from "react";
import { fetchPlayers, deletePlayer } from "../../services/dashboard.api";
import LoggedinLayout from "../../components/LoggedinLayout";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchHandicaps } from "../../services/handicap";

const Players = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage")) || 10;

  const [isLoading, setIsLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  const [previewfilters, setPreviewFilters] = useState({
    name: "",
    age: "",
    handicap: "",
    gender: "",
    type: "",
    rank: "",
    category: "",
  });

  const [filters, setFilters] = useState({
    name: "",
    age: "",
    handicap: "",
    gender: "",
    rank: "",
    category: "",
    type: "",
  });

  const [handicapOptions, setHandicapOptions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadPlayers = async () => {
      setIsLoading(true);
      setError("");

      const params = {
        page: currentPage,
        perPage: itemsPerPage,
      };

      if (filters.name) params.name = filters.name;
      if (filters.age) params.age = filters.age;
      if (filters.handicap) params.handicap = filters.handicap;
      if (filters.rank) params.rank = filters.rank;
      if (filters.category) params.category = filters.category;
      if (filters.gender) params.gender = filters.gender;
      if (filters.type) params.type = filters.type;

      try {
        const response = await fetchPlayers(params);
        setAllPlayers(response.data || []);
        // Assuming response structure has totalPages or we calculate it from total
        // The original code had response.total. Let's assume response.total is available.
        // If the API changed to return { data: [], totalPages: N }, I should check.
        // Looking at dashboard.api.js: `return response.data;` where response is axios response.
        // Usually it returns { data, total, ... }.
        // Let's use total to calculate totalPages if totalPages isn't directly there.
        const total = response.total || 0;
        const calculatedTotalPages = Math.ceil(total / itemsPerPage) || 1;
        setTotalPages(response.totalPages || calculatedTotalPages);
      } catch (err) {
        console.error("Failed to fetch players", err);
        setError("Failed to fetch players");
      } finally {
        setIsLoading(false);
      }
    };

    const loadHandicaps = async () => {
      try {
        // Fetching all handicaps for dropdown, might need pagination logic if many
        // Just fetching first page with large number for now as existing code implies
        const response = await fetchHandicaps(1, 100);
        setHandicapOptions(response.data || []);
      } catch (err) {
        console.error("Failed to fetch handicaps", err);
      }
    };

    loadHandicaps();
    loadPlayers();
  }, [currentPage, itemsPerPage, filters]);

  const handleChange = (e) => {
    setPreviewFilters({ ...previewfilters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setPreviewFilters({
      name: "",
      age: "",
      handicap: "",
      gender: "",
      rank: "",
      category: "",
      type: "",
    });

    setFilters({
      name: "",
      age: "",
      handicap: "",
      gender: "",
      rank: "",
      category: "",
      type: "",
    });

    const params = new URLSearchParams({
      page: "1",
      itemsPerPage: String(itemsPerPage),
    });

    navigate(`/players?${params.toString()}`);
  };

  const applyFilters = () => {
    setFilters({ ...previewfilters });

    const params = new URLSearchParams({
      page: "1",
      itemsPerPage: String(itemsPerPage),
    });

    navigate(`/players?${params.toString()}`);
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
      // Trigger re-fetch by toggling filters or just calling effect?
      // Actually simpler to just manually call fetchPlayers or force update.
      // But since we are using useEffect dependency on filters/page, we can just reload.
      // A simple way is to reload window or just re-trigger the effect logic.
      // Let's just re-set filters to same to trigger? No, that won't work if shallow compare.
      // I'll effectively just reload the current page state.
      // Actually, let's extract fetch logic or just navigate to same page?
      navigate(0); // Reloads page
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <LoggedinLayout>
      <div className="max-w-7xl mx-auto p-4 pt-5 sm:pt-8 md:pt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-800">
          Search Players
        </h2>

        <Link
          to={"/create-player"}
          className="block w-fit mx-auto bg-blue-50 hover:bg-blue-100 rounded-md text-blue-900 px-4 py-2 mb-4"
        >
          Create Player
        </Link>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Search by Name"
            value={previewfilters.name}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg shadow-sm bg-white focus:ring-green-500 focus:border-green-500"
          />
          <input
            type="text"
            name="age"
            placeholder="Search by Age"
            value={previewfilters.age}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg shadow-sm bg-white focus:ring-green-500 focus:border-green-500"
          />
          <input
            type="text"
            name="handicap"
            placeholder="Search by Handicap"
            value={previewfilters.handicap}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg shadow-sm bg-white focus:ring-green-500 focus:border-green-500"
          />
          <select
            name="gender"
            value={previewfilters.gender}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg shadow-sm bg-white focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            name="type"
            value={previewfilters.type}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg shadow-sm bg-white focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Handicap Types</option>
            {handicapOptions.map((handicap) => (
              <option key={handicap._id} value={handicap._id}>
                {handicap.type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mb-6 mx-auto justify-center">
          <button
            onClick={applyFilters}
            className="bg-[#007A33] hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg shadow"
          >
            Clear Filters
          </button>
        </div>

        <div className="ml-auto mb-4 focus:ring-[#007A33] w-fit">
          Records Per Page
          <select
            className="px-3 py-1.5 bg-white rounded-lg ml-2"
            value={itemsPerPage}
            onChange={(e) => {
              const newItemsPerPage = Number(e.target.value);
              const params = new URLSearchParams({
                page: "1",
                itemsPerPage: String(newItemsPerPage),
              });
              // Preserve filters in URL? No, snippet resets to page 1 but doesn't explicitly keep filters in URLSearchParams because they are in state. 
              // Wait, if I navigate, `filters` state is NOT reset, so it persists. 
              // `useEffect` depends on `itemsPerPage` so it will re-fetch with *current* `filters` state. Correct.
              navigate(`/players?${params.toString()}`);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600">Loading Players...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Age</th>
                  <th className="text-left px-4 py-3">Handicap</th>
                  <th className="text-left px-4 py-3">Gender</th>
                  <th className="text-left px-4 py-3">Birth Date</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allPlayers.map((player, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                      }`}
                    onClick={() => navigate(`/update-player/${player._id}`)}
                  >
                    <td className="px-4 py-3 border-t border-gray-100">
                      {player.name}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-100">
                      {player.age ?? "N/A"}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-100">
                      {player.handicaps && player.handicaps.length > 0
                        ? player.handicaps.map((h, idx) => (
                          <div key={idx}>
                            {h.type?.type ?? "Unknown"}: {h.number}
                          </div>
                        ))
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-100 capitalize">
                      {player.gender ?? "N/A"}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-100">
                      {new Date(player.birthDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-100 text-center z-10">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteClick(player._id);
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {allPlayers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No Players Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6 bg-white rounded-xl w-fit p-2 mx-auto">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                const params = new URLSearchParams({
                  page: Number(currentPage) - 1,
                  itemsPerPage: String(itemsPerPage),
                });
                navigate(`/dashboard/players?${params.toString()}`);
              }}
              className="px-4 py-1.5 bg-[#007A33] hover:bg-green-700 text-white rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page{" "}
              <input
                type="number"
                value={currentPage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1 && val <= totalPages) {
                    const params = new URLSearchParams({
                      page: val,
                      itemsPerPage: String(itemsPerPage),
                    });
                    navigate(`/dashboard/players?${params.toString()}`);
                  }
                }}
                className="px-3 py-1.5 w-16 rounded-lg border border-gray-300 focus:ring-[#007A33] mx-1.5"
              />{" "}
              of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                const params = new URLSearchParams({
                  page: Number(currentPage) + 1,
                  itemsPerPage: String(itemsPerPage),
                });
                navigate(`/dashboard/players?${params.toString()}`);
              }}
              className="px-4 py-1.5 bg-[#007A33] hover:bg-green-700 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 bg-[#00000055] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-96 text-center">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this player?
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

export default Players;
