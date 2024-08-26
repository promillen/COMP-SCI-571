import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false);
    const [chatrooms, setChatrooms] = useState([]);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw9/chatrooms', {
            method: 'GET',
            headers: {
                'X-CS571-ID': 'bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3',
            }
        })
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                return await Promise.reject(data);
            }
            return response.json();
        })
        .then(data => {
            // Handle successful fetch
            setChatrooms(data);
            console.log(data);
        })
        .catch(error => {
            // Handle different types of errors based on the response
            Alert.alert("Error", error.msg || "An unexpected error occurred.");
        });
    }, []);

    function handleLogin(username, password) {
        fetch('https://cs571.org/api/f23/hw9/login', {
            method: 'POST',
            headers: {
                'X-CS571-ID': 'bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                return await Promise.reject(data);
            }
            return response.json();
        })
        .then(data => {
            // Handle successful login
            SecureStore.setItemAsync('userToken', data.token);
            console.log("token: ", data.token);
            setIsLoggedIn(true); // Update state on successful login
        })
        .catch(error => {
            // Handle different types of errors based on the response
            Alert.alert("Login Failed", error.msg || "An unexpected error occurred.");
        });
    }

    function handleSignup(username, password) {
        fetch('https://cs571.org/api/f23/hw9/register', {
            method: 'POST',
            headers: {
                'X-CS571-ID': 'bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                return await Promise.reject(data);
            }
            return response.json();
        })
        .then(data => {
            // Handle successful registration
            Alert.alert("Success", "Successfully authenticated.");
            SecureStore.setItemAsync('userToken', data.token);
            console.log("token: ", data.token);
            setIsLoggedIn(true); // Update state on successful registration
        })
        .catch(error => {
            // Handle different types of errors based on the response
            Alert.alert("Registration Failed", error.msg || "An unexpected error occurred.");
        });
    }

    function handleLogout() {
        if (isGuest) {
            setIsRegistering(true); // Prompt guest users to register
            setIsGuest(false); // Reset guest status
        } else {
            SecureStore.deleteItemAsync('userToken');
            setIsLoggedIn(false);
        }
    }

    if (isLoggedIn) {
        return (
        <NavigationContainer>
            <ChatDrawer.Navigator>
                <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
                {
                    chatrooms.map(chatroom => {
                    return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                        {(props) => <BadgerChatroomScreen name={chatroom} isGuest={isGuest} />}
                        </ChatDrawer.Screen>
                        })
                    }
                    <ChatDrawer.Screen 
                        name="Logout" 
                        children={() => <BadgerLogoutScreen handleLogout={handleLogout} />} 
                    />
                </ChatDrawer.Navigator>
            </NavigationContainer>
        );
    } else if (isRegistering) {
        return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
    } else {
        return <BadgerLoginScreen 
                    handleLogin={handleLogin} 
                    setIsRegistering={setIsRegistering}
                    setAsGuest={setIsGuest}
                    setIsLoggedIn={setIsLoggedIn}
               />
    }
}