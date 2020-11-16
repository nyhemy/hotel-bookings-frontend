import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './RoomTypes.module.css';
import Room from '../room/Room';

const RoomTypes = () => {

    const axios = require('axios').default;
    const history = useHistory();

    const [rooms, setRooms] = useState([]);

    useEffect (() => {
        if (!sessionStorage.getItem("token")) {
            history.push("/");
        }

        getRoomTypes();
    }, []);

    const getRoomTypes = () => {
        axios.get('http://localhost:8080/room-types', {
            headers: {
                'Content-Type': 'application/json',
                'mode': 'cors',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        .then(response => {
            const res = response.data;
            console.log(res);
            setRooms(res);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className={styles.center}>
            <h2>Rooms</h2>
            {/* <button onClick={DisplayReservations}>display_reservations_console</button> */}
            <div className={styles.row}>
                {rooms.map(
                    (data, index) => <div className={styles.column}><Room
                        id={data.id}
                        name={data.name}
                        description={data.description}
                        rate={data.rate}
                        isActive={data.active}
                        key={index}
                    /></div>
                )}
            </div>
        </div>
    );
}

export default RoomTypes;