import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import axios from "axios";
import DistrictSelector from "../components/trains/DistrictSelector.tsx";
import Train from "./train.tsx";

const EditTrain = () => {
    const location = useLocation();

    const id = location.pathname.split('/')[2];
    const [train, setTrain] = useState<Train | null>(null);

    useEffect(() => {
        if (id) {
            getSingleTrain(id);
        }

    }, [id]);

    const getSingleTrain = (id: string) => {
        axios.get(`/api/train/${id}`)
            .then((response) => {
                setTrain(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleDistrictChange = (district: string) => {
        console.log(district)
    }




    return (
        <div>
            {train && <>
                <DistrictSelector
                    description="Select Starting District"
                    currentDistrict={train.startStation}
                    handleDistrictSelect={handleDistrictChange}/>
                <DistrictSelector
                    description="Select Ending District"
                    currentDistrict={train.endStation}
                    handleDistrictSelect={handleDistrictChange}/>
            </>}
        </div>
    );
};

export default EditTrain;