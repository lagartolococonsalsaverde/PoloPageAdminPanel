import { axiosInstance } from "./dashboard.api";

export async function fetchUserProfile() {
  try {
    const response = await axiosInstance.get(`/admin`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export const fetchReplies = async (page = 1, limit = 10) => {
  try {
    const { data } = await axiosInstance.get(`/whatsapp/replies?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
};

export const sendMessage = async (payload) => {
  try {
    const { data } = await axiosInstance.post(`/whatsapp/send`, payload);
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const deleteReply = async (id) => {
  try {
    const { data } = await axiosInstance.deleteMethod(`/whatsapp/replies/${id}`);
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
