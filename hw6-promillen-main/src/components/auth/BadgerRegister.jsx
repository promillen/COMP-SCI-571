import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerRegister() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const handleSubmit = (err) => {
        if(!username || !password || !passwordConfirm) {
            alert('Please fill out all fields.')
            return
        }

        if(password !== passwordConfirm) {
            alert('Passwords do not match.')
            return
        }

        //Perform API call
        fetch('https://cs571.org/api/f23/hw6/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CS571-ID": CS571.getBadgerId()
            },
            body: JSON.stringify({username, password}),
            credentials: 'include'
        })
        .then(res => {
            switch (res.status) {
                case 200:
                    alert("Registration was successful!");
                    setLoginStatus(true);
                    navigate('/');
                    break;
                case 409:
                    alert("That username has already been taken!");
                    break;
                case 413:
                    alert("Username or password is too long!");
                    break;
                case 400:
                    alert("Something went wrong. Please try again.");
                    break;
                default:
                    alert("Something went wrong. Please try again.");
                    break;
            }
            res.json();
        })
        .then(json => {
            console.log(json)
        })
        .catch(err => {
            console.error(err)
            alert('Something went wrong. Please try again.')
        })
    }
    

    return <>
        <h1>Register</h1>
        <div>
            <label htmlFor='username'>
                Username:
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
        </div>
        <div>
            <label htmlFor='password'>
                Password:
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
        </div>
        <div>
            <label htmlFor='confirmPassword'>
                Confirm Password:
                <input type="password" id="confirmPassword" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
            </label>
        </div>
        <button onClick={handleSubmit}>Register</button>
    </>
}
