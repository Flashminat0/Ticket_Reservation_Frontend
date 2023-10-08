import React, {useEffect} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {setItem, setTitle} from "../features/pageSlice.ts";

const Home = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle('Home'));
        dispatch(setItem(0));

    }, []);

    return (
        <div>
            Home
        </div>
    );
};

export default Home;