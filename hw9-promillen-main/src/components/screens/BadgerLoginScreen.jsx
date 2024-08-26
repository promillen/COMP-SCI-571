import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onLoginPress = () => {
        if (!username || !password) {
            Alert.alert("Missing Credentials", "Please enter your username and password.");
            return;
        }
        props.handleLogin(username, password);
    };

    const handleContinueAsGuest = () => {
        props.setAsGuest(true);  // Update the state to reflect the guest user
        props.setIsLoggedIn(true); // Update the state to let the user in as a guest
    };

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
        />
        <View style={styles.buttonContainer}>
            <Button color="crimson" title="Login" onPress={onLoginPress} />
            <View style={styles.buttonSpacerV} />
            <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        </View>
        <View style={styles.buttonSpacerH} />
        <Button title="Continue As Guest" onPress={handleContinueAsGuest} />
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: "80%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        width: '80%',
    },
    buttonSpacerV: {
        width: 10,
    },
    buttonSpacerH: {
        marginTop: 10,
    }
});

export default BadgerLoginScreen;