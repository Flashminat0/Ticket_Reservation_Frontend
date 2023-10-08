import React, {useEffect} from 'react';
import {useAppDispatch} from "../../hooks.ts";
import {useNavigate} from "react-router-dom";
import {logout} from "../../features/userSlice.ts";
import {removeNIC} from "../../services/tokenStorageService.ts";

const Logout = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();


    useEffect(() => {
        removeNIC()
        dispatch(logout())
        navigate('/login')
    }, []);


    return (
        <div>
            Logging out...
        </div>
    );
};

export default Logout;