import { axiosInstance } from "./dashboard.api";

export async function fetchUserProfile() {
    const response = await axiosInstance.get(`/admin`);
    return response.data;
}

export async function updateUserProfile(userData) {
    const response = await axiosInstance.patch(`/admin/`, { ...userData });
    return response.data;
}

export async function updateUserPassword(oldPaasword, newPassword) {
    const response = await axiosInstance.patch(`/admin/password`, { oldPaasword, newPassword });
    return response.data;
}
