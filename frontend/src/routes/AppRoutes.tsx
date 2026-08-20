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
import RentalRequest from "../pages/user/RentalRequest";
import MyRentals from "../pages/user/MyRentals";
import RentalDetails from "../pages/user/RentalDetails";
import MyProfile from "../pages/user/MyProfile";
import Activity from "../pages/user/Activity";

import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorProducts from "../pages/vendor/Products";
import VendorInventory from "../pages/vendor/Inventory";
import VendorRentals from "../pages/vendor/Rentals";
import VendorProfile from "../pages/vendor/VendorProfile";
import AddProduct from "../pages/vendor/AddProduct";



import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/Users";
import AdminProducts from "../pages/admin/Products";
import AdminRentals from "../pages/admin/Rentals";
import AdminPayments from "../pages/admin/Payments";
import AdminInventory from "../pages/admin/Inventory";

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

                            <Route
                                path="/app/products/:productId/rent"
                                element={
                                    <RentalRequest />
                                }
                            />

                            <Route
                                path="/app/rentals"
                                element={
                                    <MyRentals />
                                }
                            />

                            <Route
                                path="/app/rentals/:rentalId"
                                element={
                                    <RentalDetails />
                                }
                            />

                            <Route
                                path="/app/activity"
                                element={
                                    <Activity />
                                }
                            />

                            <Route
                                path="/app/profile"
                                element={
                                    <MyProfile />
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
                            <Route path="/vendor" element={<VendorDashboard />} />
                            <Route path="/vendor/products" element={<VendorProducts />} />
                            <Route path="/vendor/products/new" element={<AddProduct />} />
                            <Route path="/vendor/inventory" element={<VendorInventory />} />
                            <Route path="/vendor/rentals" element={<VendorRentals />} />
                            <Route path="/vendor/profile" element={<VendorProfile />} />
                        </Route>



                        {/* ADMIN */}

                        <Route
                            element={
                                <RoleRoute
                                    allowedRoles={["admin"]}
                                />
                            }
                        >
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/products" element={<AdminProducts />} />
                            <Route path="/admin/rentals" element={<AdminRentals />} />
                            <Route path="/admin/payments" element={<AdminPayments />} />
                            <Route path="/admin/inventory" element={<AdminInventory />} />
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