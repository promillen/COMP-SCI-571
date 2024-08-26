
import React, { useContext, useEffect } from 'react';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogout() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        })
        .then(res => {
            if (res.status == 200) {
                setLoginStatus(false);
                localStorage.setItem('loginStatus', JSON.stringify(false));
                sessionStorage.setItem('userStatus', JSON.stringify(false));
                sessionStorage.removeItem('loggedUsername');
            }
            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.");
            }
            return res.json();
        })
    }, [setLoginStatus]);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
