import { BASE_URL } from "../environments/development.environment";
import { createHttpService } from "../services/httpService";

export function isResponseStatusFailed(statusCode) {
  const successStatusCodes = [200, 201, 202, 203, 204, 205];
  return !successStatusCodes.includes(statusCode);
}

export const axiosInstance = createHttpService(BASE_URL);

export async function fetchForms() {
  const response = await axiosInstance.get("/dashboard/forms");
  return response.data;
}

export async function fetchFormResponses(formId, status, page, perPage) {

  const params = {
    page: page.toString(),
    perPage: perPage.toString(),
  };

  if (status) {
    params.status = status
  }

  const queryParams = new URLSearchParams(params)

  const response = await axiosInstance.get(`/dashboard/forms/${formId}/responses?${queryParams.toString()}`);
  return response.data;
}


export async function fetchFormResponse(responseId) {
  const response = await axiosInstance.get(`/dashboard/forms/responses/${responseId}`);
  return response.data;
}
export async function fetchFormResponseImage(url) {
  const response = await axiosInstance.post(`dashboard/forms/responses/fetch-image`, { url });
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
