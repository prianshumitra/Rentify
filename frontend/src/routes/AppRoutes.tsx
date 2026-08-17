import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loom from "../pages/loom/Loom";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Loom />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;