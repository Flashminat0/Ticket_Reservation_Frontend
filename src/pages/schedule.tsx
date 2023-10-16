import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {setItem, setTitle} from "../features/pageSlice.ts";
import {ITrain} from "./train/listTrain.tsx";
import axios from "axios";
import {toast} from "react-toastify";

import ScheduleCard from "../components/schedule/scheduleCard.tsx";


interface IReservation {
    id: string,
    trainId: string,
    userNic: string,
    seats: number
}

interface ISchedule {
    train: ITrain,
    reservations: IReservation[]
}

const Schedule = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle('Schedules'));
        dispatch(setItem(3));


    }, []);

    const [trains, setTrains] = useState<ITrain[]>([])
    const [schedules, setSchedules] = useState<ISchedule[]>([])

    const getTrainList = () => {
        axios.get('/api/train')
            .then((response) => {
                toast.success(response.data.message, {
                    position: "bottom-center",
                })

                const trainList: ITrain[] = response.data.data

                setTrains(trainList)
            })
    }

    const getReservationForTrain = async (trainId: string): Promise<IReservation[]> => {
        return await axios.get(`/api/Reservation/train/${trainId}`)
            .then((response) => {
                toast.success(response.data.message, {
                    position: "bottom-center",
                })

                const reservationList: IReservation[] = response.data.data

                return reservationList
            })
    }

    const fillSchedule = async (train: ITrain) => {
        const reservation = await getReservationForTrain(train.id)

        const schedule: ISchedule = {
            train: train,
            reservations: reservation
        }

        setSchedules(prevState => [...prevState, schedule])
    }


    useEffect(() => {
        setSchedules([])
        getTrainList()
    }, []);

    useEffect(() => {
        if (trains.length > 0) {
            for (const train of trains) {
                fillSchedule(train)
            }
        } else {
            setSchedules([])
        }
    }, [trains]);

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5`}>
            {schedules.map((schedule, index) => {
                return (
                    <ScheduleCard
                        key={index}
                        reservations={schedule.reservations} train={schedule.train}/>
                )
            })}

        </div>
    );
};

export default Schedule;