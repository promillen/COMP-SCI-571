import React, { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogin() {
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        if (!username || !password) {
            alert("You must provide both a username and password!");
            return;
        }

        fetch('https://cs571.org/api/f23/hw6/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CS571-ID": CS571.getBadgerId()
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        })
        .then(res => {
            if (res.status !== 200) {
                throw new Error("Incorrect username or password!");
            }
            return res.json();
        })
        .then(data => {
            alert("Login was successful!");
            sessionStorage.setItem('loggedUsername', username); // Store the username in session storage
            setLoginStatus(true);
            navigate('/');
        })
        .catch(error => {
            alert(error.message);
        });
    };

    return (
        <>
            <h1>Login</h1>
            <div>
                <label htmlFor="username">
                    Username:
                    <input type="text" id="username" ref={usernameRef} />
                </label>
            </div>
            <div>
                <label htmlFor="password">
                    Password:
                    <input type="password" id="password" ref={passwordRef} />
                </label>
            </div>
            <button onClick={handleSubmit}>Login</button>
        </>
    );
}
