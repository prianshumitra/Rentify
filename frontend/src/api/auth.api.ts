import apiClient from "./client";
import type { LoginResponse, User } from "../types/auth";

export interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export async function login(
    email: string,
    password: string,
): Promise<LoginResponse> {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await apiClient.post<LoginResponse>(
        "/users/login",
        formData,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        },
    );

    return response.data;
}

export async function register(
    data: RegisterData,
): Promise<User> {
    const response = await apiClient.post<User>(
        "/users/register",
        data,
    );

    return response.data;
}