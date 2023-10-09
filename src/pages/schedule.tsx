import React, {useEffect} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {setItem, setTitle} from "../features/pageSlice.ts";

const Schedule = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle('Schedule Train'));
        dispatch(setItem(3));


    }, []);

    return (
        <div>
            
        </div>
    );
};

export default Schedule;