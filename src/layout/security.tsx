import React, {useEffect} from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import {checkLoggedInWithResistance, checkNIC, removeNIC, storeNIC} from "../services/tokenStorageService.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {login, logout, UserRoles, UserState} from "../features/userSlice.ts";
import axios from "axios";
import {toast} from "react-toastify";

const Security = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const user: UserState = useAppSelector(state => state.user)

    const loginWithoutPassword = async (nic: string) => {
        axios.post('/api/auth/token-login', {
            nic: nic,
        })
            .then(async (response) => {
                const userNIC = response.data.data.nic
                const isAdmin = response.data.data.isAdmin
                const isActive = response.data.data.isActive

                if (!isActive) {
                    toast.warning('Your account was deactivated. Please contact the admin', {
                        position: "bottom-center",
                    })

                    removeNIC()
                    dispatch(logout())
                    navigate('/login')

                    return
                }

                const reduxData: UserState = {
                    nic: userNIC,
                    isAdmin: isAdmin,
                    userRoles: ['UNREGISTERED'],
                    loggedIn: false
                }

                dispatch(login(reduxData))

                let userRoles: UserRoles[]
                axios.get(`/api/user/${userNIC}`)
                    .then((userResponse) => {
                        const basicUserRole = userResponse.data.data.userType

                        if (basicUserRole === 'Customer') {
                            userRoles = ['CUSTOMER']
                        }

                        if (basicUserRole === 'Travel Agent') {
                            userRoles = ['TRAVEL_AGENT']
                        }

                        if (basicUserRole === 'Backoffice') {
                            userRoles = ['BACKOFFICE']
                        }

                        if (isAdmin) {
                            userRoles = [...userRoles, 'ADMIN']
                        }

                        reduxData.userRoles = userRoles
                        reduxData.loggedIn = true

                        dispatch(login(reduxData))

                        toast.success(response.data.message, {
                            position: "bottom-center",
                        })

                        navigate('/', {replace: true})
                    })

            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                })

                navigate('/login', {replace: true})
            })
    }

    useEffect(() => {
        if (checkLoggedInWithResistance()) {
            console.log('Logged in //TODO')

            if (user.loggedIn) {
                return
            }

            checkNIC()
                .then((dataOK) => {
                    if (dataOK) {
                        const nic = localStorage.getItem('nic')!

                        //     TODO LOGIN WITHOUT
                        loginWithoutPassword(nic)
                            .then(async (response) => {

                            })
                            .catch((error) => {
                                removeNIC()
                                dispatch(logout())
                                navigate('/login')
                            })

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
    }, []);

    return (
        <div>
            <Outlet/>
        </div>
    );
};

export default Security;