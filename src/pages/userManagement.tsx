import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {setItem, setTitle} from "../features/pageSlice.ts";
import {UserRoles, UserState} from "../features/userSlice.ts";
import {toast} from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {EllipsisVerticalIcon} from '@heroicons/react/20/solid'

const statuses: Record<string, string> = {
    Complete: 'text-green-700 bg-green-50 ring-green-600/20',
    'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Archived: 'text-red-800 bg-red-50 ring-red-600/20',
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface OtherUser {
    id: string,
    name: string,
    age: number,
    nic: string,
    userType: string,
    userGender: string,
    isActive: boolean,
    lastLogin: string
}

const UserManagement = () => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const user: UserState = useAppSelector(state => state.user)


    useEffect(() => {
        dispatch(setTitle('User Management'));
        dispatch(setItem(1));

    }, []);

    useEffect(() => {
        if (user.userRoles.includes('BACKOFFICE' as UserRoles) || user.userRoles.includes('TRAVEL AGENT' as UserRoles)) {
            if (user.userRoles.includes('BACKOFFICE' as UserRoles)) {
                getTravelAgents();
                getCustomers();
            }
            if (!user.userRoles.includes('BACKOFFICE' as UserRoles)) {
                toast.error('You are not allowed to access this page', {
                    position: "top-right",
                })

                navigate('/');
            }
        }
    }, [user]);

    const [travelAgents, setTravelAgents] = React.useState<OtherUser[]>([]);

    const getTravelAgents = async () => {
        axios.get('/api/User/type/travel agent')
            .then((response) => {
                toast.success(response.data.message, {
                    position: "bottom-center",
                })

                const travel_agents: OtherUser[] = response.data.data;

                setTravelAgents(travel_agents)
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                })
            })
    }

    const [customers, setCustomers] = React.useState<OtherUser[]>([]);

    const getCustomers = async () => {
        axios.get('/api/User/type/customer')
            .then((response) => {
                toast.success(response.data.message, {
                    position: "bottom-center",
                })

                const customerList: OtherUser[] = response.data.data;

                setCustomers(customerList)
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                })
            })
    }

    // 2023-10-08T14:03:21.712Z -> 4 days ago
    const dateStringToTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();

        const diff = now.getTime() - date.getTime();

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor(diff / (1000 * 60 * 60)) - (days * 24);
        const remainingMinutes = Math.floor(diff / (1000 * 60)) - (days * 24 * 60) - (remainingHours * 60);
        const remainingSeconds = Math.floor(diff / (1000)) - (days * 24 * 60 * 60) - (remainingHours * 60 * 60) - (remainingMinutes * 60);

        if (days === 0 && remainingHours === 0 && remainingMinutes === 0) return `${remainingSeconds} seconds ago`
        if (days === 0 && remainingHours === 0) return `${remainingMinutes} minutes ${remainingSeconds} seconds ago`
        if (days === 0) return `${remainingHours} hours ${remainingMinutes} minutes ${remainingSeconds} seconds ago`
        return `${days} days ${remainingHours} hours ${remainingMinutes} minutes ${remainingSeconds} seconds ago`
    }

    const disableUser = async (userNIC: string, userType: string, isActive: boolean) => {
        axios.post('/api/auth/activate', {
            requestingNic: user.nic,
            nic: userNIC,
            isActive: isActive,
            isAdmin: false
        }).then((response) => {
            toast.success(response.data.message, {
                position: "bottom-center",
            })
        }).catch((error) => {
            toast.error(error.response.data.message, {
                position: "bottom-center",
            })
        })


        if (userType == 'Travel Agent') {
            const newTravelAgents = travelAgents.map((travelAgent) => {
                if (travelAgent.nic === userNIC) {
                    return {
                        ...travelAgent,
                        isActive: !travelAgent.isActive
                    } as OtherUser
                }
                return travelAgent as OtherUser;
            })

            setTravelAgents(newTravelAgents);
        }

        if (userType == 'Customer') {
            const newCustomers = customers.map((customer) => {
                if (customer.nic === userNIC) {
                    return {
                        ...customer,
                        isActive: !customer.isActive
                    } as OtherUser
                }
                return customer as OtherUser;
            })

            setCustomers(newCustomers);
        }
    }

    const deleteUser = async (userNIC: string, userType: string) => {
        axios.delete(`/api/user/${userNIC}`).then((response) => {
            toast.success(response.data.message, {
                position: "bottom-center",
            })
        }).catch((error) => {
            toast.error(error.response.data.message, {
                position: "bottom-center",
            })
        })

        if (userType == 'Travel Agent') {
            const newTravelAgents = travelAgents.filter((travelAgent) => {
                if (travelAgent.nic === userNIC) {
                    return false;
                }
                return true;
            })

            setTravelAgents(newTravelAgents);
        }

        if (userType == 'Customer') {
            const newCustomers = customers.filter((customer) => {
                if (customer.nic === userNIC) {
                    return false;
                }
                return true;
            })

            setCustomers(newCustomers);
        }
    }

    const stringToOtherUser = (user: string): OtherUser[] => {
        if (user === 'CUSTOMER') {
            return customers;
        }
        return travelAgents;

    }

    return (
        <div>
            {Array.of('CUSTOMER', 'TRAVEL AGENT').map((role) => {
                return (
                    <div key={role}>
                        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                {role === 'TRAVEL AGENT' ? 'Travel Agents' : 'Customers'}
                            </h3>
                        </div>
                        <ul role="list" className="divide-y divide-gray-100">
                            {stringToOtherUser(role).map((singleTravelAgent) => (
                                <li key={singleTravelAgent.id}
                                    className="flex items-center justify-between gap-x-6 py-5 pl-8">
                                    <div className="min-w-0">
                                        <div className="flex items-start gap-x-3">
                                            <p className="text-sm font-semibold leading-6 text-gray-900">{singleTravelAgent.name}</p>
                                            <p
                                                className={classNames(
                                                    statuses[singleTravelAgent.isActive ? 'Complete' : 'Archived'],
                                                    'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                                                )}
                                            >
                                                {singleTravelAgent.isActive ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                            <p className="whitespace-nowrap">
                                                Last logged <time
                                                dateTime={singleTravelAgent.lastLogin}>{dateStringToTimeAgo(singleTravelAgent.lastLogin)}</time>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-none items-center gap-x-4">
                                        <Menu as="div" className="relative flex-none">
                                            <Menu.Button
                                                className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                                <span className="sr-only">Open options</span>
                                                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true"/>
                                            </Menu.Button>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items
                                                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({active}) => (
                                                            <span
                                                                onClick={() => disableUser(singleTravelAgent.nic, singleTravelAgent.userType, !singleTravelAgent.isActive)}
                                                                className={classNames(
                                                                    active ? 'bg-gray-50' : '',
                                                                    'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                                                                )}
                                                            >
                                                    {singleTravelAgent.isActive ? 'Deactivate' : 'Activate'}
                                                                <span
                                                                    className="sr-only">, {singleTravelAgent.name}</span>
                                                </span>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({active}) => (
                                                            <span
                                                                onClick={() => {
                                                                    if (singleTravelAgent.isActive) {
                                                                        toast.error('Please deactivate the user before deleting', {
                                                                            position: "bottom-center",
                                                                        })
                                                                        return;
                                                                    }

                                                                    deleteUser(singleTravelAgent.nic, singleTravelAgent.userType)
                                                                }}
                                                                className={classNames(
                                                                    active ? 'bg-gray-50' : '',
                                                                    'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                                                                )}
                                                            >
                                                    Delete User<span
                                                                className="sr-only">, {singleTravelAgent.name}</span>
                                                </span>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}
        </div>
    );
};

export default UserManagement;