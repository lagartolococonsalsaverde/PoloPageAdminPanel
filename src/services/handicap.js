import { BASE_URL } from "../environments/development.environment";
import { createHttpService } from "./httpService";
import { axiosInstance } from "./dashboard.api";

export async function deleteQuestion(questionId) {
  const response = await axiosInstance.deleteMethod(
    `api/questions/${questionId.toString()}`
  );
  return response.data;
}

export async function deleteHandicaps(id) {
  const response = await axiosInstance.deleteMethod(`handicaps/${id}`);
  return response.data;
}

export async function fetchHandicaps(page, perPage) {
  const params = {
    page: page.toString(),
    perPage: perPage.toString(),
  };

  const queryParams = new URLSearchParams(params);

  const response = await axiosInstance.get(
    `handicaps?${queryParams.toString()}`
  );
  return response.data;
}

export async function fetchHandicapById(handicapId) {
  const response = await axiosInstance.get(`handicaps/${handicapId}`);
  return response.data;
}

export async function updateHandicap(handicapId, data) {
  const response = await axiosInstance.put(`handicaps/${handicapId}`, data);
  return response.data;
} 

export async function createHandicap(data) {
  const response = await axiosInstance.post(`handicaps`, data);
  return response.data;
}
