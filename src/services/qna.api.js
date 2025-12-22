import { axiosInstance } from "./dashboard.api";


export async function deleteQuestion(questionId) {
    const response = await axiosInstance.deleteMethod(`questions/${questionId.toString()}`);
    return response.data;
}

export async function deleteAnswer(questionId, answerCreatedTime) {

    const response = await axiosInstance.deleteMethod(`questions/${questionId.toString()}/answers?createdAt=${answerCreatedTime}`);
    return response.data;
}
