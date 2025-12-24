import { BASE_URL } from "../environments/development.environment";
import { createHttpService } from "../services/httpService";

export function isResponseStatusFailed(statusCode) {
  const successStatusCodes = [200, 201, 202, 203, 204, 205];
  return !successStatusCodes.includes(statusCode);
}

export const axiosInstance = createHttpService(BASE_URL);

export async function fetchPlayers(params) {
  // If params is just page/perPage (legacy call), handle it?
  // But wait, the plan said "Update fetchPlayers to accept a params object".
  // The existing signature is (page, perPage).
  // The new signature will be (params).
  // I need to be careful about callers.
  // The only caller is Handicaps.jsx which I will fix if needed, but I checked earlier and it doesn't use it, wait:
  // Step 31 shows Handicaps.jsx imports `fetchPlayers` on line 3, but wait
  // Line 25 in Handicaps.jsx calls `fetchHandicaps`.
  // Line 3 imports `fetchPlayers` but it seems unused in `getHandicaps`.
  // Wait, let me double check Step 31 content carefully.
  // Line 3: import { fetchPlayers, deletePlayer } from "../../services/dashboard.api";
  // Line 25: const response = await fetchHandicaps(currentPage + 1, PER_PAGE);
  // It seems `fetchPlayers` is NOT used in `Handicaps.jsx`. It's imported but likely unused or I missed it.
  // Ah, wait, checking line 13: const [players, setPlayers] = useState([]);
  // checking line 99: {players.map((player) => (
  // It seems the state is named `players` but it holds handicaps?
  // Let's check `getHandicaps` function.
  // Yes, it calls `fetchHandicaps`.
  // So `fetchPlayers` import in `Handicaps.jsx` is likely a leftover copy-paste artifact.
  // I can safely change `fetchPlayers` signature.

  const queryParams = new URLSearchParams(params);

  const response = await axiosInstance.get(`players?${queryParams.toString()}`);
  return response.data;
}

export async function fetchPlayerById(playerId) {
  const response = await axiosInstance.get(`players/${playerId}`);
  return response.data;
}

export async function createPlayer(data) {
  const response = await axiosInstance.post(`players`, data);
  return response;
}

export async function updatePlayer(playerId, data) {
  const response = await axiosInstance.put(`players/${playerId}`, data);
  return response;
}

export async function deletePlayer(playerId) {
  const response = await axiosInstance.deleteMethod(`players/${playerId}`);
  return response.data;
}

export async function fetchQnA(page, perPage) {
  const params = {
    page: page.toString(),
    perPage: perPage.toString(),
  };

  const queryParams = new URLSearchParams(params)

  const response = await axiosInstance.get(`questions?${queryParams.toString()}`);
  return response.data;
}



export async function fetchFormResponse(responseId) {
  const response = await axiosInstance.get(`/dashboard/forms/responses/${responseId}`);
  return response.data;
}


export async function confirmResponse(responseId) {
  const response = await axiosInstance.patch(`/dashboard/forms/responses/${responseId}/confirm`);
  return response.data;
}

export async function uploadImageAndGenerateProductLink(responseId, title, file, calendarFile) {

  const formData = new FormData();

  formData.append("responseId", responseId.toString());
  formData.append("title", title.toString());
  formData.append("coverPhoto", file);
  formData.append("calenderPhoto", calendarFile);

  const response = await axiosInstance.post(`/product/duplicatePrintifyProduct`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function markAsInappropriate(responseId) {
  const response = await axiosInstance.patch(`dashboard/forms/responses/${responseId}/hide`);
  return response.data;
}

export async function sendProductLink(leadId, productLink, isImmediate, phoneNumber) {
  const response = await axiosInstance.post(`/product/sendProductLink`, { leadId, productLink, immediate: isImmediate, phoneNumber });
  return response.data;
}
