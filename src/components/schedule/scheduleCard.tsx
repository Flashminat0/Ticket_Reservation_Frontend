import React from 'react';
import {ITrain} from "../../pages/train/listTrain.tsx";
import {CalendarDaysIcon, CreditCardIcon, UserCircleIcon} from "@heroicons/react/20/solid";

interface IReservation {
    id: string,
    trainId: string,
    userNic: string,
    seats: number
}

interface IScheduleCard {
    train: ITrain,
    reservations: IReservation[]
}

const ScheduleCard: React.FC<IScheduleCard> = ({train, reservations}) => {

    // return in format 2023-10-10T13:40:16.592Z -> January 31, 2023
    const dateStringFormat = (dateString: string): string => {

        const date = new Date(dateString)

        return date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})
    }

    return (
        <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
            <dl className="flex flex-wrap">
                <div className="flex-auto pl-6 pt-6">
                    <dt className="text-sm font-semibold leading-6 text-gray-900">{train.trainName}</dt>
                    <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">LKR {train.price}
                        <span className={`font-normal pl-2 text-sm`}>Per Seat</span>
                    </dd>
                </div>
                <div className="flex-none self-end px-6 pt-4">
                    <dt className="sr-only">Status</dt>
                    {train.isActive ? <>
                        <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                        </dd>
                    </> : <>
                        <dd className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                            Inactive
                        </dd>
                    </>}
                </div>
                <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                    <dt className="flex-none">
                        <span className="sr-only">Client</span>
                        <UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true"/>
                    </dt>
                    <dd className="text-sm font-medium leading-6 text-gray-900">{reservations.length} Reservations</dd>
                </div>
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                        <span className="sr-only">Due date</span>
                        <CalendarDaysIcon className="h-6 w-5 text-gray-400" aria-hidden="true"/>
                    </dt>
                    <dd className="text-sm leading-6 text-gray-500">
                        <time dateTime="2023-01-31">{dateStringFormat(train.startTime)}</time>
                    </dd>
                </div>
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                        <span className="sr-only">Status</span>
                        <CreditCardIcon className="h-6 w-5 text-gray-400" aria-hidden="true"/>
                    </dt>
                    <dd className="text-sm leading-6 text-gray-500">{train.seats} Seat{train.seats > 1 && 's'} Available</dd>
                </div>
            </dl>
            <div className="mt-6 border-t border-gray-900/5 px-6 py-6">

            </div>
        </div>
    );
};

export default ScheduleCard;