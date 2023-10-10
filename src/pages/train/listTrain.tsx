import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import {setItem, setTitle} from "../../features/pageSlice.ts";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {UserState} from "../../features/userSlice.ts";

export interface ITrain {
    id: string,
    trainName: string,
    trainType: string,
    startStation: string,
    endStation: string,
    startTime: string,
    endTime: string,
    price: number,
    districts: string[],
    seats: number,
    ownerNic: string,
    isActive: boolean
}

const ListTrain = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user: UserState = useAppSelector(state => state.user)


    useEffect(() => {
        dispatch(setTitle('Train Management'));
        dispatch(setItem(2));


    }, []);


    const [trains, setTrains] = React.useState<ITrain[]>([])
    const getTrains = () => {
        const URL = user.isAdmin ? '/api/train' : `/api/train/owner/${user.nic}`

        axios.get(URL)
            .then((response) => {
                toast.success(response.data.message, {
                    position: "bottom-center",
                })

                setTrains(response.data.data)
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                })
            })
    }

    useEffect(() => {
        getTrains()
    }, []);


    const deleteTrain = (id: string) => {
        axios.delete(`/api/train/${id}/${user.nic}`)
            .then((response) => {
                toast.success(response.data.message, {
                    position: "bottom-center",
                })

                getTrains()
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                })
            })
    }

    return (
        <div>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            Train Management
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the trains in the system.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={() => navigate('/trains/create')}
                            type="button"
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add Train
                        </button>
                    </div>
                </div>
                <div className="-mx-4 mt-8 sm:-mx-0">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                        <tr>
                            <th scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                Name
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                            >
                                Type
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                                Active Status
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Owner
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {trains.map((train) => (
                            <tr key={train.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                    {train.trainName}
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                    {train.trainType}
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                    {train.isActive ? 'Active' : 'Inactive'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{train.ownerNic}</td>
                                <td className="whitespace-nowrap py-4 pl-0 pr-4 text-right text-sm font-medium sm:pr-0">
                                    <span
                                        onClick={() => navigate(`/trains/${train.id}`)}
                                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                        Edit<span className="sr-only">, {train.trainName}</span>
                                    </span>

                                    <span
                                        onClick={() => deleteTrain(train.id)}
                                        className="text-indigo-600 hover:text-indigo-900 ml-2 cursor-pointer">
                                        Delete<span className="sr-only">, {train.trainName}</span>
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListTrain;