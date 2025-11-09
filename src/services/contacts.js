import { axiosInstance } from "./dashboard.api";


export async function deleteContacts(id) {
  const response = await axiosInstance.deleteMethod(`contacts/${id}`);
  return response.data;
}

export async function fetchContacts(page=1, perPage=50) {
  const params = {
    page: page.toString(),
    perPage: perPage.toString(),
  };

  const queryParams = new URLSearchParams(params);

  const response = await axiosInstance.get(
    `contacts?${queryParams.toString()}`
  );
  return response.data;
}

export async function fetchContactById(contactId) {
  const response = await axiosInstance.get(`contacts/${contactId}`);
  return response.data;
}

export async function updateContact(contactId, data) {
  const response = await axiosInstance.put(`contacts/${contactId}`, data);
  return response.data;
} 

export async function createContact(data) {
  const response = await axiosInstance.post(`contacts`, data);
  return response.data;
}
