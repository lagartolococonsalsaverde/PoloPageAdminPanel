import { axiosInstance } from "./dashboard.api";

export async function fetchUserProfile() {
    const response = await axiosInstance.get(`/auth/me`);
    return response.data;
}

export async function updateUserProfile(userData) {
    const response = await axiosInstance.patch(`/auth/me`, { ...userData });
    return response.data;
}

export async function updateUserPassword(oldPassword, newPassword) {
    const response = await axiosInstance.put(`/auth/change-password`, { oldPassword, newPassword });
    return response.data;
}
