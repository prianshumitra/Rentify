import apiClient from "./client";
import type { LoginResponse, User } from "../types/auth";

export interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    is_vendor?: boolean;
    is_admin?: boolean;
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

export async function updateRole(is_vendor?: boolean, is_admin?: boolean): Promise<User> {
    const response = await apiClient.patch<User>("/users/me/role", {
        is_vendor,
        is_admin,
    });

    return response.data;
}