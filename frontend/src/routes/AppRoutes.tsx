import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import Loom from "../pages/loom/Loom";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import UserHome from "../pages/user/UserHome";
import Explore from "../pages/user/Explore";
import ProductDetails from "../pages/user/ProductDetails";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ═══════════════════════════════
                    PUBLIC ROUTES
                ═══════════════════════════════ */}

                <Route
                    path="/"
                    element={<Loom />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* ═══════════════════════════════
                    AUTHENTICATED ROUTES
                ═══════════════════════════════ */}

                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>

                        {/* USER */}

                        <Route
                            element={
                                <RoleRoute
                                    allowedRoles={["user"]}
                                />
                            }
                        >
                            <Route
                                path="/app"
                                element={<UserHome />}
                            />

                            <Route
                                path="/app/explore"
                                element={<Explore />}
                            />

                            <Route
                                path="/app/products/:id"
                                element={
                                    <ProductDetails />
                                }
                            />
                        </Route>

                        {/* VENDOR */}

                        <Route
                            element={
                                <RoleRoute
                                    allowedRoles={["vendor"]}
                                />
                            }
                        >
                            {/* Vendor routes coming next */}
                        </Route>

                        {/* ADMIN */}

                        <Route
                            element={
                                <RoleRoute
                                    allowedRoles={["admin"]}
                                />
                            }
                        >
                            {/* Admin routes coming next */}
                        </Route>

                    </Route>
                </Route>

                {/* ═══════════════════════════════
                    FALLBACK
                ═══════════════════════════════ */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;