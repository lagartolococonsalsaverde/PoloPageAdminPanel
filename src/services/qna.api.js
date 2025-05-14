import { BASE_URL } from "../environments/development.environment";
import { createHttpService } from "../services/httpService";
import { axiosInstance } from "./dashboard.api";


export async function deleteQuestion(questionId) {
    const response = await axiosInstance.deleteMethod(`api/questions/${questionId.toString()}`);
    return response.data;
}

export async function deleteAnswer(questionId, answerCreatedTime) {

    const response = await axiosInstance.deleteMethod(`api/questions/${questionId.toString()}/answers?createdAt=${answerCreatedTime}`);
    return response.data;
}
