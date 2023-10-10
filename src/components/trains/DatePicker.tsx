import {useEffect, useState} from 'react';
import DateTimePicker from 'react-datetime-picker';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import './customDatepicker.css'

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface IDatePicker {
    disabled?: boolean,
    currentDateTime?: Date,
    handleDateTimeChange: (value: Date) => void,
}

const DatePicker = ({
                        disabled,
                        currentDateTime,
                        handleDateTimeChange
                    }: IDatePicker) => {
    const [value, onChange] = useState<Value>(currentDateTime ? currentDateTime : new Date());

    useEffect(() => {
        if (value) {
            const newDate = new Date(new Date(value.toString()).toUTCString())

            handleDateTimeChange(newDate)
        } else {
            handleDateTimeChange(new Date(new Date().toUTCString()))
        }
    }, [value])

    return (
        <div>
            <DateTimePicker
                disabled={disabled}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={onChange} value={value}/>
        </div>
    );
};

export default DatePicker;