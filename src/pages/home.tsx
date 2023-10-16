import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {setItem, setTitle} from "../features/pageSlice.ts";
import axios from "axios";
import {toast} from "react-toastify";


interface IDashboard {
    customerCount: number,
    travelAgentCount: number,
    trainCount: number,
    reservationCount: number,
    seatsAvailable: number
}

const Home = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle('Home'));
        dispatch(setItem(0));

    }, []);

    function convertCamelCaseToTitle(str: string): string {
        // Insert space before capital letters and then replace the first letter with its uppercase
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, firstChar => firstChar.toUpperCase());
    }

    const [dashboardData, setDashboardData] = useState<IDashboard>({
        customerCount: 0,
        travelAgentCount: 0,
        trainCount: 0,
        reservationCount: 0,
        seatsAvailable: 0
    })


    const getDashboardData = () => {
        axios.get('/api/dashboard')
            .then((response) => {
                toast.success(response.data.message, {
                    position: "bottom-center",
                })

                setDashboardData(response.data.data as IDashboard)
            })
    }

    useEffect(() => {
        getDashboardData()
    }, []);

    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {Object.keys(dashboardData).map((key, index) => {
                    return (
                        <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">{convertCamelCaseToTitle(key)}</dt>
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/*@ts-ignore*/}
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{dashboardData[key].toString()}</dd>
                        </div>
                    )
                })}
            </dl>
        </div>
    );
};

export default Home;