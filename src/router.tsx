import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Security from "./layout/security.tsx";

import Home from "./pages/home.tsx";

import Login from "./pages/auth/login.tsx";
import Activate from "./pages/auth/activate.tsx";
import Register from "./pages/auth/register.tsx";
import Logout from "./pages/auth/logout.tsx";

import Settings from "./pages/settings.tsx";
import UserManagement from "./pages/userManagement.tsx";


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Security/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/user-management" element={<UserManagement/>}/>
                    <Route path="/settings" element={<Settings/>}/>

                </Route>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/activate" element={<Activate/>}/>
                <Route path="/logout" element={<Logout/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;