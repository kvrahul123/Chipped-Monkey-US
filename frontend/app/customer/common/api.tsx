import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const verifyToken = async () => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) return null; // No token found

    try {
        const response = await axios.get(`${appUrl}auth/validate-token`, {
            headers: { Authorization: `Bearer ${storedToken}` },
        });

        const data = response.data;
        return data.data || null; // Return user_type or null
    } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        return null; // Return null on error
    }
};