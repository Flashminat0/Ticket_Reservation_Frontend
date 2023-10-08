import React, {useEffect} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {setTitle} from "../features/pageSlice.ts";

const Home = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle('Home'));
    }, []);

    return (
        <div>
            Home
        </div>
    );
};

export default Home;