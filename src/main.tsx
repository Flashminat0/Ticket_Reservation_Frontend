import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import axios from "axios";
import {store} from "./features/store.ts";
import {Provider} from 'react-redux'
import Router from "./router.tsx";

axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}`;

axios.interceptors.request.use(
    config => {
        config.headers['Accept'] = '*/*';
        config.headers['Content-Type'] = 'application/json';
        return config;
    });


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <React.StrictMode>
            <Router/>
        </React.StrictMode>
    </Provider>,
)
