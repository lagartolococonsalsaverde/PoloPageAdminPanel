import { axiosInstance } from "./dashboard.api";

export async function fetchUserProfile() {
    const response = await axiosInstance.get(`/admin`);
    return response.data;
}

export const fetchReplies = async (page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/whatsapp/replies?page=${page}&limit=${limit}`);
  return data;
};

export const sendMessage = async (numbers, bodyText) => {
  const { data } = await axiosInstance.post(`/whatsapp/send`, {
    numbers,
    bodyText, 
  });
  return data;
};