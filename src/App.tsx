import React, {useEffect} from 'react';
import axios from "axios";

const App = () => {
    useEffect(() => {
        axios.get('/api/user')
            .then(response => {
                console.log(response)

                // setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    return (
        <h1 className="text-3xl font-bold underline">
            Hello world!
        </h1>
    );
}
export default App
