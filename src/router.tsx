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
import Schedule from "./pages/schedule.tsx";
import ListTrain from "./pages/train/listTrain.tsx";
import EditTrain from "./pages/train/editTrain.tsx";
import CreateTrain from "./pages/train/createTrain.tsx";


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Security/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/user-management" element={<UserManagement/>}/>
                    <Route path="/trains" element={<ListTrain/>}/>
                    <Route path="/trains/create" element={<CreateTrain/>}/>
                    <Route path="/trains/:id" element={<EditTrain/>}/>
                    <Route path="/schedule" element={<Schedule/>}/>
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