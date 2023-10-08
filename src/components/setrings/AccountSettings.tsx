import React, {useEffect, useState} from 'react';
import {UserRoles, UserState} from "../../features/userSlice.ts";
import {useAppSelector} from "../../hooks.ts";
import Activation from "./Activation.tsx";
import axios from "axios";

// {
//     "id": "6522b62f792ba016c3966c61",
//     "name": "Yasas Lowe",
//     "age": 11,
//     "nic": "993240184v2",
//     "userType": "Customer",
//     "userGender": "Male"
// }

interface User {
    id: string,
    name: string,
    age: number,
    nic: string,
    userType: UserRoles,
    userGender: string
}

const AccountSettings = () => {
    const user: UserState = useAppSelector(state => state.user)

    const [nic, setNic] = useState<string>('')
    const [showActivation, setShowActivation] = useState<boolean>(false);

    useEffect(() => {
        if (user.userRoles.includes('BACKOFFICE' as UserRoles)) {
            setShowActivation(true)
        }

        if (user.nic) {
            setNic(user.nic)
            getMyData(user.nic)
        }
    }, [user]);


    const [me, setMe] = useState<User | null>(null)


    const getMyData = async (userNIC: string) => {
        axios.get(`/api/user/${userNIC}`)
            .then((response) => {
                const data = response.data.data
                setMe(data)
            })
    }

    return (
        <div>
            {JSON.stringify(me)}

            {showActivation && <Activation/>}
        </div>
    );
};

export default AccountSettings;