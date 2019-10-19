import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import APIRequest from '../../api/APIRequest';

export default function UIMainMenuPlayersCounter() {
    const [onlinePlayersCount, setOnlinePlayersCount] = useState(0);
    const timeout = useRef(null);

    const fetchOnlinePlayersCount = () => {
        APIRequest.get('/players').then(response => {
            if (response.data.success) {
                setOnlinePlayersCount(response.data.players);
                scheduleFetchOnlinePlayersCount();
            }
        });
    };

    const scheduleFetchOnlinePlayersCount = () => {
        timeout.current = setTimeout(() => {
            fetchOnlinePlayersCount();
        }, 5000);
    };

    useEffect(() => {
        fetchOnlinePlayersCount();

        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, []);

    if (onlinePlayersCount === 0) {
        return <React.Fragment></React.Fragment>;
    }

    return (
        <div className="main-menu-players-counter">
            {onlinePlayersCount} players online
        </div>
    )
}