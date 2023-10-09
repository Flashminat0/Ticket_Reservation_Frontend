import React, {useEffect, useState} from 'react';
import axios from "axios";

interface IDistrictSelector {
    description?: string,
    currentDistrict?: string,
    handleDistrictSelect: (district: string) => void
}

const DistrictSelector: React.FC<IDistrictSelector> = ({
                                                           description,
                                                           currentDistrict,
                                                           handleDistrictSelect
                                                       }) => {

    const [districts, setDistricts] = useState<string[]>([])
    const [selectedDistrict, setSelectedDistrict] = useState<string>('')


    const getDistrictList = () => {
        axios.get('/api/train/districts')
            .then((response) => {
                setDistricts(response.data.data)
            })
    }

    useEffect(() => {
        getDistrictList()
    }, []);

    useEffect(() => {
        if (currentDistrict) {
            setSelectedDistrict(currentDistrict)
        }
    }, [districts, currentDistrict]);

    useEffect(() => {
        if (selectedDistrict) {
            handleDistrictSelect(selectedDistrict)
        }
    }, [selectedDistrict]);

    return (
        <div>
            <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                    {description}
                </legend>
                <div className="mt-6 space-y-6">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 p-2">
                        {districts.map((district) => {
                            return (
                                <div
                                    key={district}
                                    className="flex items-center gap-x-3">
                                    <input
                                        id={district}
                                        checked={selectedDistrict === district}
                                        onChange={() => setSelectedDistrict(district)}
                                        name="district-selector"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor={district}
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        {district}
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </fieldset>
        </div>
    );
};

export default DistrictSelector;