import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import axios from "axios";
import DistrictSelector from "../components/trains/DistrictSelector.tsx";
import {Train} from "./train.tsx";
import DatePicker from "../components/trains/DatePicker.tsx";
import {UserState} from "../features/userSlice.ts";
import {useAppSelector} from "../hooks.ts";
import {toast} from "react-toastify";

const EditTrain = () => {
    const location = useLocation();

    const user: UserState = useAppSelector(state => state.user)

    const id = location.pathname.split('/')[2];
    const [train, setTrain] = useState<Train | null>(null);
    const [fallbackTrain, setFallbackTrain] = useState<Train | null>(null);

    useEffect(() => {
        if (id) {
            getSingleTrain(id);
        }

    }, [id]);

    const getSingleTrain = (id: string) => {
        axios.get(`/api/train/${id}`)
            .then((response) => {
                setTrain(response.data.data);
                setFallbackTrain(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const [editState, setEditState] = useState<boolean>(false);

    const saveChanges = async () => {
        if (train) {
            const startTimeISO = new Date(train.startTime).toISOString();
            const endTimeISO = new Date(train.endTime).toISOString();

            console.log(startTimeISO)

            const sendingTrain: Train = {
                ...train,
                startTime: startTimeISO,
                endTime: endTimeISO
            }


            axios.put(`/api/train/${id}`, {
                ...sendingTrain,
                editingNic: user.nic
            })
                .then((response) => {
                    toast.success(response.data.message, {
                        position: "bottom-center",
                    })
                }).catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                })
            })

        }
    }


    return (
        <div>
            {train && <>
                <div className="pt-10 ">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            saveChanges()
                        }}
                        className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl ">
                        <div className="px-4 py-6 sm:p-8">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="train_name"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Train name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            disabled={!editState}
                                            value={train.trainName}
                                            onChange={(e) => {
                                                setTrain({
                                                    ...train,
                                                    trainName: e.target.value
                                                })
                                            }}
                                            type="text"
                                            name="train_name"
                                            id="train_name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="train_type"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Train Type
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            disabled={!editState}
                                            value={train.trainType}
                                            onChange={(e) => {
                                                setTrain({
                                                    ...train,
                                                    trainType: e.target.value
                                                })
                                            }}
                                            id="train_type"
                                            name="train_type"
                                            autoComplete="train_type-name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option>Express</option>
                                            <option>Interseats</option>
                                            <option>Night Mail</option>
                                            <option>Local</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-1">
                                    <label htmlFor="isActive"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Active Status
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            disabled={!editState}
                                            value={train.isActive ? 'Active' : 'Inactive'}
                                            onChange={(e) => {
                                                setTrain({
                                                    ...train,
                                                    isActive: e.target.value === 'Active'
                                                })
                                            }}
                                            id="isActive"
                                            name="isActive"
                                            autoComplete="isActive-name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-6 grid lg:grid-cols-2 gap-10">
                                    <DistrictSelector
                                        disabled={!editState}
                                        description="Select Starting District"
                                        currentDistrict={train.startStation}
                                        handleDistrictSelect={(value) => {
                                            setTrain({
                                                ...train,
                                                startStation: value
                                            })
                                        }}/>
                                    <DistrictSelector
                                        disabled={!editState}
                                        description="Select Ending District"
                                        currentDistrict={train.endStation}
                                        handleDistrictSelect={(value) => {
                                            setTrain({
                                                ...train,
                                                endStation: value
                                            })
                                        }}/>
                                </div>


                                <div className="col-span-full grid sm:grid-cols-2 gap-10">
                                    <div>
                                        <label htmlFor="street-address"
                                               className="block text-sm font-medium leading-6 text-gray-900">
                                            Start Time
                                        </label>
                                        <div className="mt-2 ">
                                            <DatePicker
                                                disabled={!editState}
                                                currentDateTime={new Date(train.startTime)}
                                                handleDateTimeChange={(value) => {
                                                    setTrain({
                                                        ...train,
                                                        startTime: value.toUTCString()
                                                    })
                                                }}/>

                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="street-address"
                                               className="block text-sm font-medium leading-6 text-gray-900">
                                            End Time
                                        </label>
                                        <div className="mt-2 ">
                                            <DatePicker
                                                disabled={!editState}
                                                currentDateTime={new Date(train.endTime)}
                                                handleDateTimeChange={(value) => {
                                                    setTrain({
                                                        ...train,
                                                        endTime: value.toUTCString()
                                                    })
                                                }}/>

                                        </div>
                                    </div>

                                </div>

                                <div className="sm:col-span-2 sm:col-start-1">
                                    <label htmlFor="seats"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Seats
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            disabled={!editState}
                                            value={train.seats}
                                            onChange={(e) => {
                                                setTrain({
                                                    ...train,
                                                    seats: parseInt(e.target.value)
                                                })
                                            }}
                                            type="number"
                                            min={0}
                                            name="seats"
                                            id="seats"
                                            autoComplete="seats"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="price"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Price
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            disabled={!editState}
                                            value={train.price}
                                            onChange={(e) => {
                                                setTrain({
                                                    ...train,
                                                    price: parseInt(e.target.value)
                                                })
                                            }}
                                            min={0}
                                            type="text"
                                            name="price"
                                            id="price"
                                            autoComplete="price"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                            {editState ? <div className={`flex justify-end space-x-3`}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTrain(fallbackTrain)
                                        setEditState(false)
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
                                    onClick={() => setEditState(true)}
                                    className="inline-flex justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Edit Details
                                </button>
                            </>}
                        </div>

                    </form>
                </div>
            </>}
        </div>
    );
};

export default EditTrain;