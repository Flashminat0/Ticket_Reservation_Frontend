import React, {Fragment, useEffect, useState} from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import {checkLoggedInWithResistance, checkNIC, removeNIC, storeNIC} from "../services/tokenStorageService.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {login, logout, UserRoles, UserState} from "../features/userSlice.ts";
import axios from "axios";
import {toast} from "react-toastify";
import {Dialog, Menu, Transition} from '@headlessui/react'
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import {PageState} from "../features/pageSlice.ts";

type HeroIcon = React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
    title?: string;
    titleId?: string
} & React.RefAttributes<SVGSVGElement>>;

interface Navigation {
    current: boolean;
    name: string;
    icon: HeroIcon;
    href: string
}


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}


const Security = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const user: UserState = useAppSelector(state => state.user)
    const page: PageState = useAppSelector(state => state.page)

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
                    name: '',
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
                        const userName = userResponse.data.data.name

                        if (basicUserRole === 'Customer') {
                            userRoles = ['CUSTOMER']
                        }

                        if (basicUserRole === 'Travel Agent') {
                            userRoles = ['TRAVEL AGENT']
                        }

                        if (basicUserRole === 'Backoffice') {
                            userRoles = ['BACKOFFICE']
                        }

                        if (isAdmin) {
                            userRoles = [...userRoles, 'ADMIN']
                        }

                        reduxData.userRoles = userRoles
                        reduxData.loggedIn = true
                        reduxData.name = userName

                        dispatch(login(reduxData))

                        toast.success(response.data.message, {
                            position: "bottom-center",
                        })

                    })

            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                })

                removeNIC()
                navigate('/login', {replace: true})
            })
    }

    useEffect(() => {
        if (checkLoggedInWithResistance()) {

            if (user.loggedIn) {
                return
            }

            checkNIC()
                .then((dataOK) => {
                    if (dataOK) {
                        const nic = localStorage.getItem('nic')!

                        //     TODO LOGIN WITHOUT
                        loginWithoutPassword(nic)
                            .catch(() => {
                                removeNIC()
                                dispatch(logout())
                                navigate('/login')
                            })

                    } else {
                        toast.error('sus behaviour', {
                            position: "bottom-center",
                        })

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

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigation: Navigation[] = [
        {name: 'Dashboard', href: '/', icon: HomeIcon, current: false},
        {name: 'Team', href: '/user-management', icon: UsersIcon, current: false},
        {name: 'Schedule', href: '/schedule', icon: CalendarIcon, current: false},
        {name: 'Projects', href: '#', icon: FolderIcon, current: false},
        {name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false},
        {name: 'Reports', href: '#', icon: ChartPieIcon, current: false},
    ]

    const userNavigation = [
        {name: 'Your profile', href: '/settings'},
        {name: 'Sign out', href: '/logout'},
    ]


    const [navigationLinks, setNavigationLinks] = useState<Navigation[]>(navigation)

    useEffect(() => {
        if (page.item !== -1) {
            const newNavigationLinks: Navigation[] = navigation.map((item, index) => {
                item.current = index === page.item;

                return item
            })

            setNavigationLinks(newNavigationLinks)


        } else {
            setNavigationLinks(navigation)
        }
    }, [page])

    return (
        <div className={`h-full bg-white`}>
            <div className={`h-full`}>
                <div>
                    <Transition.Root show={sidebarOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-900/80"/>
                            </Transition.Child>

                            <div className="fixed inset-0 flex">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition ease-in-out duration-300 transform"
                                    enterFrom="-translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transition ease-in-out duration-300 transform"
                                    leaveFrom="translate-x-0"
                                    leaveTo="-translate-x-full"
                                >
                                    <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-in-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in-out duration-300"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                                <button type="button" className="-m-2.5 p-2.5"
                                                        onClick={() => setSidebarOpen(false)}>
                                                    <span className="sr-only">Close sidebar</span>
                                                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                                                </button>
                                            </div>
                                        </Transition.Child>

                                        <div
                                            className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                                            <div className="flex h-16 shrink-0 items-center">
                                                <img
                                                    className="h-8 w-auto scale-[2.2] relative top-2 left-4"
                                                    src="/images/logo.png"
                                                    alt="Your Company"
                                                />
                                            </div>
                                            <nav className="flex flex-1 flex-col">
                                                <ul role="list" className="-mx-2 flex-1 space-y-1">
                                                    {navigationLinks.map((item) => (
                                                        <li key={item.name}>
                                                            <span
                                                                onClick={() => {
                                                                    navigate(item.href)
                                                                }}
                                                                className={classNames(
                                                                    item.current
                                                                        ? 'bg-gray-800 text-white'
                                                                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer'
                                                                )}
                                                            >
                                                                <item.icon className="h-6 w-6 shrink-0"
                                                                           aria-hidden="true"/>
                                                                {item.name}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </nav>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition.Root>

                    {/* Static sidebar for desktop */}
                    <div
                        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
                        <div className="flex h-16 shrink-0 items-center justify-center">
                            <img
                                className="h-8 w-auto scale-150"
                                src="/images/logo.png"
                                alt="Your Company"
                            />
                        </div>
                        <nav className="mt-1">
                            <ul role="list" className="flex flex-col items-center space-y-1">
                                {navigationLinks.map((item) => (
                                    <li key={item.name}>
                                        <span
                                            onClick={() => {
                                                navigate(item.href)
                                            }}
                                            className={classNames(
                                                item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold cursor-pointer'
                                            )}
                                        >
                                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true"/>
                                            <span className="sr-only">{item.name}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="lg:pl-20">
                        <div
                            className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                                    onClick={() => setSidebarOpen(true)}>
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                            </button>

                            {/* Separator */}
                            <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"/>

                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                                <div className="relative flex flex-1 items-center">
                                    <h1 className={`text-2xl grid place-items-center font-semibold`}>
                                        {page.title}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-x-4 lg:gap-x-6">
                                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true"/>
                                    </button>

                                    {/* Separator */}
                                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                                         aria-hidden="true"/>

                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative">
                                        <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                            <span className="sr-only">Open user menu</span>
                                            <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400 lg:hidden"/>
                                            <span className="hidden lg:flex lg:items-center">
                                                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                                                      aria-hidden="true">
                                                    {user.name}
                                                </span>
                                                <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400"
                                                                 aria-hidden="true"/>
                                            </span>
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
                                                className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                                {userNavigation.map((item) => (
                                                    <Menu.Item key={item.name}>
                                                        {({active}) => (
                                                            <span
                                                                onClick={() => {
                                                                    navigate(item.href)
                                                                }}
                                                                className={classNames(
                                                                    active ? 'bg-gray-50' : '',
                                                                    'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                                                                )}
                                                            >
                                                                {item.name}
                                                            </span>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        {/*<main className="xl:pl-96">*/}
                        <main className="">
                            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                                <Outlet/>
                            </div>
                        </main>
                    </div>

                    {/*<aside*/}
                    {/*    className="fixed bottom-0 left-20 top-16 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">*/}
                    {/*    /!* Secondary column (hidden on smaller screens) *!/*/}
                    {/*</aside>*/}
                </div>
            </div>
        </div>
    );
};

export default Security;