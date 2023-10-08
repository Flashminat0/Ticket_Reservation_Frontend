import React, {useEffect} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {setItem, setTitle} from "../features/pageSlice.ts";

const Settings = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle('Settings'));
        dispatch(setItem(-1));

    }, []);

    return (
        <div>
            settings
        </div>
    );
};

export default Settings;