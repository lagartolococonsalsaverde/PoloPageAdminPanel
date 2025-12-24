import { axiosInstance } from "./dashboard.api";

export async function deleteService(questionId) {
  const response = await axiosInstance.deleteMethod(
    `questions/${questionId.toString()}`
  );
  return response.data;
}

export async function deleteServices(id) {
  const response = await axiosInstance.deleteMethod(`listings/${id}`);
  return response.data;
}

export async function fetchServices(page, perPage, category) {
  const params = {
    page: page.toString(),
    perPage: perPage.toString(),
  };
  if (category) {
    params.category = category;
  }
  const queryParams = new URLSearchParams(params);

  const response = await axiosInstance.get(
    `listings?${queryParams.toString()}`
  );
  return response.data;
}

export async function fetchServiceById(serviceId) {
  const response = await axiosInstance.get(`listings/${serviceId}`);
  return response.data;
}

export async function updateService(serviceId, data) {
  const response = await axiosInstance.put(`listings/${serviceId}`, data);
  return response.data;
}

export async function createService(data) {
  const response = await axiosInstance.post(`listings`, data);
  return response.data;
}

export async function fetchComments(listingId) {
  const response = await axiosInstance.get(`listings/${listingId}/comments`);
  return response.data;
}

export async function addComment(listingId, data) {
  const response = await axiosInstance.post(
    `listings/${listingId}/comments`,
    data
  );
  return response.data;
}

export async function deleteComment(listingId, commentId) {
  const response = await axiosInstance.deleteMethod(
    `listings/${listingId}/comments/${commentId}`
  );
  return response.data;
}
