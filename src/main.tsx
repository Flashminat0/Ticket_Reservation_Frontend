import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from "axios";


axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}`;

axios.interceptors.request.use(
    config => {
        config.headers['Accept'] = '*/*';
        config.headers['Content-Type'] = 'application/json';
        return config;
    });

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)
