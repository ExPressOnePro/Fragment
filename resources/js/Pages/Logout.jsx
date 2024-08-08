// src/pages/Logout.js

import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from '@/Interceptors/axios.jsx';
import { getToken } from '../utils/auth';

export default function Logout() {
    const history = useHistory();

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            localStorage.removeItem('token');
            history.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    React.useEffect(() => {
        handleLogout();
    }, []);

    return <div>Logging out...</div>;
};
