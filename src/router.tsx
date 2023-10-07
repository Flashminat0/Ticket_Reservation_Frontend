import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Security from "./layout/security.tsx";

import Home from "./pages/home.tsx";
import Login from "./pages/login.tsx";
import Activate from "./pages/activate.tsx";
import Register from "./pages/register.tsx";


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Security/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/activate" element={<Activate/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;