import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {setItem, setTitle} from "../features/pageSlice.ts";
import {UserRoles, UserState} from "../features/userSlice.ts";
import {toast} from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";

interface TravelAgent {
    id: string,
    name: string,
    age: number,
    nic: string,
    userType: string,
    userGender: string
}

const UserManagement = () => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const user: UserState = useAppSelector(state => state.user)


    useEffect(() => {
        dispatch(setTitle('User Management'));
        dispatch(setItem(1));

    }, []);

    useEffect(() => {
        if (user.userRoles.includes('BACKOFFICE' as UserRoles) || user.userRoles.includes('TRAVEL AGENT' as UserRoles)) {
            if (user.userRoles.includes('BACKOFFICE' as UserRoles)) {
                getTravelAgents();
            }
            if (user.userRoles.includes('TRAVEL AGENT' as UserRoles)) {
                toast.error('You are not allowed to access this page', {
                    position: "top-right",
                })

                navigate('/dashboard');
            }
        }
    }, [user]);

    const [travelAgents, setTravelAgents] = React.useState<TravelAgent[]>([]);

    const getTravelAgents = async () => {
        axios.get('/api/User/type/travel agent')
            .then((response) => {
                toast.success(response.data.message, {
                    position: "bottom-center",
                })

                const travel_agents: TravelAgent[] = response.data.data;

                setTravelAgents(travel_agents)
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                })
            })
    }

    return (
        <div>
            {JSON.stringify(travelAgents)}

        </div>
    );
};

export default UserManagement;