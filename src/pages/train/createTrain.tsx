import React, {useEffect} from 'react';
import {useAppDispatch} from "../../hooks.ts";
import {setItem, setTitle} from "../../features/pageSlice.ts";

const CreateTrain = () => {

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setTitle('Create ListTrain'));
        dispatch(setItem(2));


    }, []);

    return (
        <div>

        </div>
    );
};

export default CreateTrain;