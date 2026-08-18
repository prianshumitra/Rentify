export type UserRole = "user" | "vendor" | "admin";

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;

    is_admin: boolean;
    is_vendor: boolean;
    is_active: boolean;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export function getUserRole(user: User): UserRole {
    if (user.is_admin) {
        return "admin";
    }

    if (user.is_vendor) {
        return "vendor";
    }

    return "user";
}