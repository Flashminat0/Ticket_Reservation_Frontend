import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {login, UserRoles, UserState} from "../../features/userSlice.ts";

const Activate = () => {
    const dispatch = useAppDispatch()

    const navigate = useNavigate();
    const user: UserState = useAppSelector(state => state.user)

    const currentUserTypes: UserRoles[] = [
        'BACKOFFICE', 'TRAVEL AGENT'
    ]

    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState('Male')
    const [userType, setUserType] = useState<UserRoles>('TRAVEL AGENT')

    useEffect(() => {
        if (user && user.nic === '') {
            toast.warning('You need to login first', {
                position: "bottom-center",
            })
            navigate('/login')
        }

        if (user && user.loggedIn) {
            toast.warning('You are already logged in', {
                position: "bottom-center",
            })
            navigate('/')
        }
    }, []);

    const onSubmitLogin = async () => {
        axios.post('/api/user', {
            name: name,
            age: age,
            nic: user.nic,
            userType: userType,
            userGender: gender
        }).then((response) => {
            toast.success(response.data.message, {
                position: "bottom-center",
            })


            const reduxData: UserState = {
                name: name,
                nic: user.nic,
                isAdmin: userType === 'BACKOFFICE',
                userRoles: [userType],
                loggedIn: true
            }

            dispatch(login(reduxData))

            navigate('/')
        }).catch((error) => {
            toast.error(error.response.data.message, {
                position: "bottom-center",
            })
        })
    }

    return (
        <div className={`h-full bg-white`}>
            <div className={`h-full`}>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-16 w-auto scale-[2.2]"
                            src="/images/login-logo.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Activate your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault()
                            await onSubmitLogin()
                        }}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => setName(e.target.value)}
                                        id="name"
                                        name="name"
                                        type="name"
                                        autoComplete="name"
                                        required
                                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900">
                                    Age
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => setAge(e.target.value)}
                                        id="age"
                                        name="age"
                                        type="number"
                                        min={1}
                                        autoComplete="age"
                                        required
                                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                    Gender
                                </label>
                                <select
                                    onChange={(e) => setGender(e.target.value)}
                                    id="gender"
                                    name="gender"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue="Male"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option disabled>That's all lol</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="user_type"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    User Type
                                </label>
                                <select
                                    onChange={(e) => {
                                        const rawUserType = e.target.value

                                        const selectedUserType = currentUserTypes.find((userType) => {
                                            return userType === rawUserType
                                        })

                                        if (selectedUserType) {
                                            setUserType(selectedUserType)
                                        }
                                    }}
                                    id="user_type"
                                    name="user_type"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue="Travel Agent"
                                >
                                    <option value={'TRAVEL AGENT'}>Travel Agent</option>
                                    <option value={'BACKOFFICE'}>Backoffice</option>
                                </select>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Activate Account
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activate;