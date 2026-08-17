export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    is_vendor: boolean;
    is_active: boolean;
}