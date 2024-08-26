import { StyleSheet, ScrollView, View, Text, Button, Modal, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen({ name, isGuest }) {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const totalNumPages = 4;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, [name, page]);

    function fetchMessages() {
        fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${name}&page=${page}`, {
            method: 'GET',
            headers: {
                'X-CS571-ID': 'bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3',
            }
        }) 
        .then(response => response.json())
        .then(data => {
            setMessages(data.messages);
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
        });
    };

    const goToNextPage = () => {
        if (page < totalNumPages) setPage(page + 1);
    };

    const goToPreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            fetch('https://cs571.org/api/f23/hw9/whoami', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CS571-ID': 'bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.isLoggedIn) {
                    setCurrentUser(data.user);
                }
            })
            .catch(error => {
                console.error('Error fetching current user:', error);
            });
        };
    
        fetchCurrentUser();
    }, []);

    async function handleCreatePost() {
        const token = await SecureStore.getItemAsync('userToken');
        const url = `https://cs571.org/api/f23/hw9/messages?chatroom=${encodeURIComponent(name)}`;
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-CS571-ID': 'bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3'
            },
            body: JSON.stringify({
                title: postTitle,
                content: postBody
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data));
            }
            return response.json();
        })
        .then(data => {
            Alert.alert("Success", "Post created successfully");
            setPostTitle('');
            setPostBody('');
            setIsModalVisible(false);
            setPage(1);
            fetchMessages();
        })
        .catch(error => {
            Alert.alert("Error", "Failed to create post");
            console.error('Post creation error:', error);
        });
    }

    async function handleDeletePost(postId) {
        const token = await SecureStore.getItemAsync('userToken');
        fetch(`https://cs571.org/api/f23/hw9/messages/${postId}`, {
            method: 'DELETE',
            headers: {
                'X-CS571-ID': 'bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.log('Server response:', text); // Log the raw response
                    try {
                        const data = JSON.parse(text);
                        throw new Error(data.msg || 'Failed to delete the post');
                    } catch (error) {
                        throw new Error('Failed to delete the post');
                    }
                });
            }
            Alert.alert("Success", "Post deleted successfully");
            setPage(1); // Go back to the first page
            fetchMessages(); // Re-fetch messages to update the list
        })
        .catch(error => {
            Alert.alert("Error", error.toString());
            console.error('Post deletion error:', error);
        });
    } 

    return (
        <View style={styles.container}>
            <ScrollView style={styles.messageContainer}>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <BadgerChatMessage
                            key={index}
                            title={msg.title}
                            poster={msg.poster}
                            created={msg.created}
                            content={msg.content}
                            isOwner={currentUser && msg.poster === currentUser.username}
                            onDelete={() => handleDeletePost(msg.id)}
                        />
                    ))
                ) : (
                    <Text style={styles.noMessages}>There's nothing here!</Text>
                )}
            </ScrollView>
            <Text style={styles.pageInfo}>
                Page {page} of {totalNumPages}
            </Text>
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Button title="Previous" onPress={goToPreviousPage} disabled={page === 1} />
                </View>
                <View style={styles.button}>
                    <Button title="Next" onPress={goToNextPage} disabled={page === totalNumPages} />
                </View>
            </View>
            {!isGuest && (
                <Button title="Add Post" onPress={() => setIsModalVisible(true)} />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Title" 
                            value={postTitle}
                            onChangeText={setPostTitle}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Body" 
                            value={postBody}
                            onChangeText={setPostBody}
                            multiline
                        />
                        <Button 
                            title="Create Post" 
                            onPress={handleCreatePost} 
                            disabled={!postTitle || !postBody}
                        />
                        <View style={styles.buttonSpacer} />
                        <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pageInfo: {
        textAlign: 'center',
        margin: 10
    },
    messageContainer: {
        flex: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    button: {
        flex: 1, // Each button will take equal space
        marginHorizontal: 5, // Add some space between buttons
    },
    noMessages: {
        textAlign: 'center',
        marginTop: 20
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        marginTop: 22
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%' //
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%'
    },
    buttonSpacer: {
        margin: 2,
    }
});

export default BadgerChatroomScreen;