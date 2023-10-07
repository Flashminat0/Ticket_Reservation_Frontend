import React, {useEffect} from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import {checkLoggedInWithResistance, checkNIC, removeNIC, storeNIC} from "../services/tokenStorageService.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {logout, UserState} from "../features/userSlice.ts";

const Security = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const user: UserState = useAppSelector(state => state.user)

    useEffect(() => {
        if (checkLoggedInWithResistance()) {
            console.log('Logged in')

            checkNIC().then((dataOK) => {
                if (dataOK) {
                    //     TODO LOGIN WITHOUT PASSWORD

                } else {
                    removeNIC()
                    dispatch(logout())
                    navigate('/login')
                }
            })

        } else {
            console.log('Not logged in')

            if (user.loggedIn) {
                storeNIC(user.nic)
            }
        }
    }, [user]);

    return (
        <div>
            <Outlet/>
        </div>
    );
};

export default Security;