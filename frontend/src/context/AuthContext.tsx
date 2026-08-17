import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { login as loginApi } from "../api/auth.api";
import type { LoginResponse, User } from "../types/auth";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("access_token"),
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser) as User);
            } catch {
                localStorage.removeItem("user");
            }
        }

        setIsLoading(false);
    }, []);

    async function login(email: string, password: string): Promise<User> {
        const response: LoginResponse = await loginApi(email, password);

        localStorage.setItem("access_token", response.access_token);

        setToken(response.access_token);

        /*
         * The backend's login response only gives us the token.
         * The current-user endpoint will be connected next so we
         * can populate the actual User object and determine role.
         */
        throw new Error(
            "Authentication token stored. Current-user endpoint must be connected next.",
        );
    }

    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: Boolean(token),
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}