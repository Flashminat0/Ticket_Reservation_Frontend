import React, {useEffect} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {setItem, setTitle} from "../features/pageSlice.ts";
import AccountSettings from "../components/setrings/AccountSettings.tsx";

const Settings = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle('Settings'));
        dispatch(setItem(-1));

    }, []);

    return (
        <div>
           <AccountSettings/>
        </div>
    );
};

export default Settings;