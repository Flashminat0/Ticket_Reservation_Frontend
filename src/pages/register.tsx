import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import {useAppDispatch} from "../hooks.ts";
import {login, UserState} from "../features/userSlice.ts";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    const [nic, setNic] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitLogin = async () => {
        axios.post('/api/auth/register', {
            nic: nic,
            password: password
        }).then(() => {
            toast.success('Successfully registered.', {
                position: "bottom-center",
            })

            toast.info('Please activate your account.', {
                position: "bottom-center",
                delay: 2000
            })

            const reduxData: UserState = {
                name: '',
                nic: nic,
                isAdmin: false,
                userRoles: ['UNREGISTERED'],
                loggedIn: false
            }

            dispatch(login(reduxData))

            navigate('/activate')

        })
            .catch((error) => {
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
                            Create your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault()
                            await onSubmitLogin()
                        }}>
                            <div>
                                <label htmlFor="nic" className="block text-sm font-medium leading-6 text-gray-900">
                                    NIC
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => setNic(e.target.value)}
                                        id="nic"
                                        name="nic"
                                        type="nic"
                                        autoComplete="nic"
                                        required
                                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>

                                </div>
                                <div className="mt-2">
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Register
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Already a member?{' '}
                            <Link
                                to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;