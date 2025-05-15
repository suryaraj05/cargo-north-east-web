import React, { useState, useEffect, useRef } from 'react';
import './Messages.css';
import axios from 'axios';

const BASE_URL = 'http://77.37.121.137:3000';

const Messages = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Get token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    // Create axios instance with auth header
    const axiosWithAuth = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    useEffect(() => {
        fetchAllConversations();
        const interval = setInterval(fetchAllConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllConversations = async () => {
        try {
            setLoading(true);
            const response = await axiosWithAuth.get('/api/message');
            if (response.data && response.data.messages) {
                // Get unique order IDs
                const orderIds = [...new Set(response.data.messages.map(msg => msg.order_id))];
                // Fetch messages for each order ID
                const conversationsData = await Promise.all(
                    orderIds.map(async (orderId) => {
                        try {
                            const orderResponse = await axiosWithAuth.get(`/api/message/${orderId}`);
                            if (orderResponse.data && orderResponse.data.messages) {
                                // Admin's messages: fromUser = sender === 'admin'
                                return {
                                    requestId: `REQ${orderId}`,
                                    users: orderResponse.data.messages
                                        .map(m => m.sender)
                                        .filter((v, i, a) => v !== 'admin' && a.indexOf(v) === i),
                                    messages: orderResponse.data.messages.map(message => ({
                                        text: message.text,
                                        fromUser: message.sender === 'admin',
                                        unread: message.unread,
                                        sender: message.sender,
                                        timestamp: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    }))
                                };
                            }
                            return null;
                        } catch (error) {
                            return null;
                        }
                    })
                );
                setConversations(conversationsData.filter(Boolean));
            }
        } catch (error) {
            setError('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedConversation || !message) {
            alert('Please select a conversation and enter a message.');
            return;
        }
        try {
            const orderId = selectedConversation.requestId.replace('REQ', '');
            await axiosWithAuth.post('/api/message', {
                order_id: orderId,
                text: message
            });
            // Locally update the selected conversation's messages
            const newMsg = {
                text: message,
                fromUser: true,
                unread: false,
                sender: 'admin',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setConversations(prev => prev.map(conv =>
                conv.requestId === selectedConversation.requestId
                    ? { ...conv, messages: [...conv.messages, newMsg] }
                    : conv
            ));
            setSelectedConversation(prev => ({
                ...prev,
                messages: [...prev.messages, newMsg]
            }));
            setMessage('');
            setFile(null);
        } catch (error) {
            alert('Failed to send message.');
        }
    };

    // Mark messages as read when selecting a conversation
    useEffect(() => {
        if (selectedConversation) {
            setConversations(prev => prev.map(conv =>
                conv.requestId === selectedConversation.requestId
                    ? { ...conv, messages: conv.messages.map(msg => ({ ...msg, unread: false })) }
                    : conv
            ));
        }
    }, [selectedConversation]);

    const renderConversationList = () => (
        <div className="conversation-list">
            {conversations.map((conv) => (
                <div
                    key={conv.requestId}
                    className={`conversation-item ${selectedConversation?.requestId === conv.requestId ? 'selected' : ''}`}
                    onClick={() => setSelectedConversation(conv)}
                >
                    <div className="conversation-header">
                        <strong>Request ID: {conv.requestId}</strong>
                        {conv.messages.some((msg) => msg.unread && !msg.fromUser) && <span className="unread-dot"></span>}
                    </div>
                    <div className="conversation-users">Users: {conv.users.join(', ')}</div>
                    <div className="conversation-preview">
                        {conv.messages.length > 0 ? conv.messages[conv.messages.length - 1]?.text.substring(0, 30) + '...' : <span className="no-messages">No messages yet</span>}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderChatWindow = () => {
        if (!selectedConversation) {
            return <div className="no-chat-selected">Select a conversation to start chatting</div>;
        }
        return (
            <div className="chat-window">
                <div className="chat-header">
                    <h3>Request ID: {selectedConversation.requestId}</h3>
                    <span>Users: {selectedConversation.users.join(', ')}</span>
                </div>
                <div className="chat-messages">
                    {selectedConversation.messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.fromUser ? 'admin-sent' : 'user-received'}`}>
                            <div className="message-content">
                                <span className="message-sender">{msg.sender}</span>
                                <p>{msg.text}</p>
                                <span className="message-timestamp">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <div className="chat-actions">
                        <input
                            type="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="messages-loading">Loading messages...</div>;
    }
    if (error) {
        return <div className="messages-error">{error}</div>;
    }

    return (
        <div className="messages-container">
            {renderConversationList()}
            {renderChatWindow()}
        </div>
    );
};

export default Messages;