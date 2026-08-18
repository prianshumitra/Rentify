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
    const response = await apiClient.post<LoginResponse>(
        "/users/login",
        {
            email,
            password,
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

export async function getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/users/me");

    return response.data;
}