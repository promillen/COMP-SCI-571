import React, { useEffect, useState, useContext } from "react";
import BadgerMessage from './BadgerMessage';
import { Row, Col, Container, Pagination, Form, Button } from 'react-bootstrap';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerChatroom(props) {
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postTitle, setPostTitle] = useState('');     // For controlled input
    const [postContent, setPostContent] = useState(''); // For controlled input

    const [loginStatus] = useContext(BadgerLoginStatusContext);

    const loadMessages = (page) => {
        fetch(`https://cs571.org/api/f23/hw6/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages);
        })
    };

    const handlePostCreation = () => {
        if (!postTitle.trim() || !postContent.trim()) {
            alert("You must provide both a title and content!");
            return;
        }
    
        // Make the API call to create a post
        fetch(`https://cs571.org/api/f23/hw6/messages?chatroom=${props.name}`, {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: postTitle,
                content: postContent
            }),
            credentials: 'include'
        })
        .then(res => {
            switch (res.status) {
                case 200:
                    alert("Post was successfully created!");
                    break;
                case 404:
                    alert("Chatroom does not exist!");
                    break;
                case 413:
                    alert("Post is to long");
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
            loadMessages(currentPage);
            setPostTitle('');
            setPostContent('');
        });
    };

    const handlePostDeletion = (id) => {
        fetch(`https://cs571.org/api/f23/hw6/messages?id=${id}`, {
            method: 'DELETE',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: 'include'
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully deleted the post!");
            } else {
                alert("Something went wrong. Please try again.");
            }
            return res.json()
        })

        .then(json => {
            loadMessages(currentPage);
        });
    };

    useEffect(() => {
        loadMessages(currentPage);
    }, [props, currentPage]);

    return (
        <Container>
            <h1>{props.name} Chatroom</h1>
            
            {loginStatus ? (
                <>
                    <Form onSubmit={(e) => { e.preventDefault(); handlePostCreation(); }}>
                        <Form.Group controlId="postTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={postTitle} 
                                onChange={(e) => setPostTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="postContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                value={postContent} 
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                        </Form.Group>
                        <Button type="submit">Create Post</Button>
                    </Form>
                </>
            ) : (
                <p>You must be logged in to post!</p>
            )}
            <hr/>
            {
                messages.length > 0 ?
                    <Row>
                        {messages.map(message => (
                            <Col key={message.id} xs={12} md={6} lg={4}>
                                <BadgerMessage
                                    key={message.id}
                                    title={message.title}
                                    poster={message.poster}
                                    content={message.content}
                                    created={message.created}
                                    onDelete={() => handlePostDeletion(message.id)}
                                />
                            </Col>
                        ))}
                    </Row>
                :
                    <p>There are no messages on this page yet!</p>
            }
            <Pagination>
                {[1, 2, 3, 4].map(page => (
                    <Pagination.Item 
                        key={page} 
                        active={page === currentPage} 
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
}
