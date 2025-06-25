import { BASE_URL } from "../environments/development.environment";
import { createHttpService } from "./httpService";
import { axiosInstance } from "./dashboard.api";

export async function deleteQuestion(questionId) {
  const response = await axiosInstance.deleteMethod(
    `api/questions/${questionId.toString()}`
  );
  return response.data;
}

export async function deletehandicaps(id) {
  const response = await axiosInstance.deleteMethod(
    `api/questions/${questionId.toString()}/handicaps/${id}`
  );
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
