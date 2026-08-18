import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    getCurrentUser,
    login as loginApi,
} from "../api/auth.api";

import {
    getUserRole,
    type User,
    type UserRole,
} from "../types/auth";

interface AuthContextType {
    user: User | null;
    token: string | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("access_token"),
    );

    const [role, setRole] = useState<UserRole | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            const storedToken =
                localStorage.getItem("access_token");

            if (!storedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                const currentRole = getUserRole(currentUser);

                setToken(storedToken);
                setUser(currentUser);
                setRole(currentRole);

                localStorage.setItem(
                    "user",
                    JSON.stringify(currentUser),
                );
            } catch (error) {
                console.error(
                    "Failed to restore authentication session:",
                    error,
                );

                localStorage.removeItem("access_token");
                localStorage.removeItem("user");

                setToken(null);
                setUser(null);
                setRole(null);
            } finally {
                setIsLoading(false);
            }
        }

        restoreSession();
    }, []);

    async function login(
        email: string,
        password: string,
    ): Promise<User> {
        const response = await loginApi(
            email,
            password,
        );

        localStorage.setItem(
            "access_token",
            response.access_token,
        );

        setToken(response.access_token);

        const currentUser = await getCurrentUser();

        const currentRole = getUserRole(currentUser);

        setUser(currentUser);
        setRole(currentRole);

        localStorage.setItem(
            "user",
            JSON.stringify(currentUser),
        );

        return currentUser;
    }

    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                role,
                isAuthenticated: Boolean(token && user),
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
        throw new Error(
            "useAuth must be used within an AuthProvider",
        );
    }

    return context;
}