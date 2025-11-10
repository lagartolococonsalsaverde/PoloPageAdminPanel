import { axiosInstance } from "./dashboard.api";

export async function deleteContacts(id) {
  try {
    const response = await axiosInstance.deleteMethod(`contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}

export async function fetchContacts(page = 1, perPage = 50) {
  try {
    const params = {
      page: page.toString(),
      perPage: perPage.toString(),
    };

    const queryParams = new URLSearchParams(params);
    const response = await axiosInstance.get(`contacts?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
}

export async function fetchContactById(contactId) {
  try {
    const response = await axiosInstance.get(`contacts/${contactId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contact with ID ${contactId}:`, error);
    throw error;
  }
}

export async function updateContact(contactId, data) {
  try {
    const response = await axiosInstance.put(`contacts/${contactId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating contact with ID ${contactId}:`, error);
    throw error;
  }
}

export async function createContact(data) {
  try {
    const response = await axiosInstance.post(`contacts`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
}
