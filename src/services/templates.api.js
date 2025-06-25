import { axiosInstance } from "./dashboard.api";

export async function fetchSmsTemplates() {
    const response = await axiosInstance.get(`/template/sms`);
    return response.data;
}

export async function updateSmsTemplates(templateId, body) {
    const response = await axiosInstance.patch(`/template/sms/${templateId}`, { body });
    return response.data;
}

export async function fetchProductTemplates(page, perPage) {

    const params = {
        page: page.toString(),
        perPage: "3"
    }

    const queryParams = new URLSearchParams(params)

    const response = await axiosInstance.get(`/template/product/printify?${queryParams.toString()}`);
    return response.data; 
}

export async function updateDefaultProductTemplate(productId) {
    const response = await axiosInstance.patch(`/template/product/${productId}`);
    return response.data;
}

export async function fetchProductMonthTemplates() {
    const response = await axiosInstance.get(`/template/product/month`);
    return response.data;
}