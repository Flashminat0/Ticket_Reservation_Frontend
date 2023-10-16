import React, {useEffect, useState} from 'react';
import {login, logout, UserRoles, UserState} from "../../features/userSlice.ts";
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import Activation from "./Activation.tsx";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {removeNIC} from "../../services/tokenStorageService.ts";

interface User {
    id: string,
    name: string,
    age: number,
    nic: string,
    userType: UserRoles,
    userGender: string
}

const AccountSettings = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const user: UserState = useAppSelector(state => state.user)


    const [showActivation, setShowActivation] = useState<boolean>(false);

    useEffect(() => {
        //TODO ship somewhere else
        if (user.userRoles.includes('BACKOFFICE' as UserRoles)) {
            setShowActivation(true)
        }

        if (user.nic) {
            getMyData(user.nic)
        }
    }, [user]);

    const dummyUser: User = {
        id: "6522b62f792ba016c3966c61",
        name: "Yasas Lowe",
        age: 11,
        nic: "993240184v2",
        userType: "CUSTOMER" as UserRoles,
        userGender: 'Male'
    }
    const [me, setMe] = useState<User>(dummyUser)
    const [fallbackMe, setFallbackMe] = useState<User>(dummyUser)
    const [editMode, setEditMode] = useState<boolean>(false)


    const getMyData = async (userNIC: string) => {
        axios.get(`/api/user/${userNIC}`)
            .then((response) => {
                const data = response.data.data
                setMe(data)
                setFallbackMe(data)
            })
    }

    const onSubmitEditData = async () => {
        axios.put(`/api/user/${user.nic}`, {
            name: me.name,
            age: me.age,
            userType: me.userType,
            userGender: me.userGender
        }).then((response) => {
            toast.success(response.data.message, {
                position: "bottom-center",
            })

            getMyData(user.nic)

            const reduxData: UserState = {
                name: me.name,
                nic: user.nic,
                loggedIn: user.loggedIn,
                isAdmin: user.isAdmin,
                userRoles: user.userRoles
            }

            dispatch(login(reduxData))

        }).catch((error) => {
            toast.error(error.response.data.message, {
                position: "bottom-center",
            })
        })
    }

    const onDeleteAccount = async () => {
    //    ask for confirmation using browser's native alert
        if (window.confirm('Are you sure you want to delete your account?')) {
            axios.delete(`/api/user/${user.nic}`)
                .then((response) => {
                    toast.success(response.data.message, {
                        position: "bottom-center",
                    })

                    dispatch(logout())
                    removeNIC()
                    navigate('/login')


                }).catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                })
            })
        } else {
            // Do nothing!
        }
    }


    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                onSubmitEditData()
            }}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
                        <div>
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Personal Information</h3>
                            <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can recieve
                                mail.</p>
                        </div>

                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="name"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    First name
                                </label>
                                <input
                                    value={me.name}
                                    onChange={(e) => {
                                        setMe((prev) => {
                                            return {...prev, name: e.target.value}
                                        })
                                    }}
                                    disabled={!editMode}
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="given-name"
                                    className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>


                            <div className="col-span-3 sm:col-span-2">
                                <label htmlFor="age"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Age
                                </label>
                                <input
                                    value={me.age}
                                    onChange={(e) => {
                                        setMe((prev) => {
                                            return {...prev, age: parseInt(e.target.value)}
                                        })
                                    }}
                                    disabled={!editMode}
                                    type="number"
                                    min={1}
                                    name="age"
                                    id="age"
                                    autoComplete="age"
                                    className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div className="col-span-3 sm:col-span-2">
                                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                    Gender
                                </label>
                                <select
                                    onChange={(e) => {
                                        setMe((prev) => {
                                            return {...prev, userGender: e.target.value}
                                        })
                                    }}
                                    id="gender"
                                    name="gender"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={me.userGender}
                                    disabled={!editMode}
                                >
                                    <option value={'Male'}>Male</option>
                                    <option value={'Female'}>Female</option>
                                    <option disabled>That's all lol</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        {editMode ? <div className={`flex justify-end space-x-3`}>
                            <button
                                type="button"
                                onClick={() => {
                                    setMe(fallbackMe)
                                    setEditMode(false)
                                }}
                                className="inline-flex justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Reset Changes
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save Changes
                            </button>
                        </div> : <>
                            <button
                                type="button"
                                onClick={() => setEditMode(true)}
                                className="inline-flex justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Edit Details
                            </button>
                        </>}
                    </div>
                </div>
            </form>

            <div className="bg-white shadow sm:rounded-lg mt-5">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Delete Account</h3>
                    <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                        <div className="max-w-xl text-sm text-gray-500">
                            <p>
                                This action will delete your account and all the data associated with it.
                            </p>
                        </div>
                        <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center mr-1">
                            <button
                                onClick={onDeleteAccount}
                                type="button"
                                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*{showActivation && <Activation/>}*/}
        </div>
    );
};

export default AccountSettings;