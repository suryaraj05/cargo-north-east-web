import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './UserMessages.css';

const BASE_URL = 'http://77.37.121.137:3000';

const UserMessages = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
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

    // Fetch all orderIds from quotes and messages, and build conversation windows for each
    useEffect(() => {
        const fetchAllConversationsAndOrders = async () => {
            setLoading(true);
            try {
                // 1. Fetch all orderIds from quotes
                const quotesRes = await axiosWithAuth.get('/api/user/quotes');
                let quoteOrderIds = [];
                if (quotesRes.data && quotesRes.data.quotes) {
                    quoteOrderIds = quotesRes.data.quotes.map(q => q.order_id);
                }

                // 2. Fetch all orderIds from messages
                const msgRes = await axiosWithAuth.get('/api/message');
                let messageOrderIds = [];
                if (msgRes.data && msgRes.data.messages) {
                    messageOrderIds = msgRes.data.messages.map(m => m.order_id);
                }

                // 3. Merge and dedupe orderIds
                const allOrderIds = Array.from(new Set([...quoteOrderIds, ...messageOrderIds]));

                // 4. For each orderId, fetch messages (if any)
                const conversationsData = await Promise.all(
                    allOrderIds.map(async (orderId) => {
                        try {
                            const orderResponse = await axiosWithAuth.get(`/api/message/${orderId}`);
                            if (orderResponse.data && orderResponse.data.messages && orderResponse.data.messages.length > 0) {
                                return {
                                    id: `REQ${orderId}`,
                                    order_id: orderId,
                                    messages: orderResponse.data.messages.map(message => ({
                                        id: message.id,
                                        text: message.text,
                                        fromUser: message.sender === 'user',
                                        sender: message.sender === 'user' ? 'User' : 'Admin',
                                        timestamp: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                        image_path: message.image_path,
                                        created_at: message.created_at,
                                        unread: message.unread
                                    })).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                                };
                            } else {
                                // No messages yet, create empty window
                                return {
                                    id: `REQ${orderId}`,
                                    order_id: orderId,
                                    messages: []
                                };
                            }
                        } catch (error) {
                            // If 404 or no messages, create empty window
                            return {
                                id: `REQ${orderId}`,
                                order_id: orderId,
                                messages: []
                            };
                        }
                    })
                );
                setConversations(conversationsData);
            } catch (error) {
                setError('Failed to load messages');
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAllConversationsAndOrders();
        const interval = setInterval(fetchAllConversationsAndOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    // Select conversation for orderId from navigation state after conversations are loaded
    useEffect(() => {
        const { orderId, selectedRequestId } = location.state || {};
        const navOrderId = orderId || selectedRequestId;
        if (navOrderId && conversations.length > 0) {
            const conv = conversations.find(c => c.order_id === navOrderId);
            if (conv) {
                setSelectedConversation(conv);
            } else {
                // If conversation doesn't exist yet, create it and select
                const newConv = {
                    id: `REQ${navOrderId}`,
                    order_id: navOrderId,
                    messages: []
                };
                setConversations(prev => [...prev, newConv]);
                setSelectedConversation(newConv);
            }
        }
    }, [location.state, conversations]);

    // Mark messages as read when selecting a conversation
    useEffect(() => {
        if (selectedConversation) {
            const hasUnreadMessages = selectedConversation.messages.some(msg => !msg.fromUser && msg.unread);
            if (hasUnreadMessages) {
                setConversations(prev => prev.map(conv => 
                    conv.order_id === selectedConversation.order_id
                        ? { ...conv, messages: conv.messages.map(msg => ({ ...msg, unread: false })) }
                        : conv
                ));
            }
        }
    }, [selectedConversation]);

    const handleSendMessage = async (orderId, text) => {
        try {
            const response = await axiosWithAuth.post('/api/message', {
                order_id: orderId,
                text: text
            });

            if (response.data && response.data.message === "Message has been sent") {
                setNewMessage('');
                // Fetch updated messages for this specific order
                const orderResponse = await axiosWithAuth.get(`/api/message/${orderId}`);
                if (orderResponse.data && orderResponse.data.messages) {
                    const updatedMessages = orderResponse.data.messages.map(message => ({
                        id: message.id,
                        text: message.text,
                        fromUser: message.sender === 'user',
                        sender: message.sender === 'user' ? 'User' : 'Admin',
                        timestamp: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        image_path: message.image_path,
                        created_at: message.created_at,
                        unread: message.unread
                    })).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                    setSelectedConversation(prev => ({
                        ...prev,
                        messages: updatedMessages
                    }));
                    setConversations(prev => prev.map(conv => 
                        conv.order_id === orderId 
                            ? { ...conv, messages: updatedMessages }
                            : conv
                    ));
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const sendMessage = () => {
        if (!selectedConversation || (!newMessage && !file)) {
            alert('Please select a conversation and enter a message or upload a file.');
            return;
        }
        handleSendMessage(selectedConversation.order_id, newMessage);
    };

    const renderConversationList = () => (
        <div className="conversation-list">
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    className={`conversation-item ${selectedConversation?.id === conv.id ? 'selected' : ''}`}
                    onClick={() => setSelectedConversation(conv)}
                >
                    <div className="conversation-header">
                        <strong>Request ID: {conv.id}</strong>
                        {conv.messages.some(msg => !msg.fromUser && msg.unread) && 
                            <span className="unread-dot"></span>}
                    </div>
                    <div className="conversation-preview">
                        {conv.messages.length > 0
                            ? conv.messages[conv.messages.length - 1]?.text.substring(0, 30) + '...'
                            : <span className="no-messages">No messages yet</span>}
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
                    <h3>Request ID: {selectedConversation.id}</h3>
                    <button className="back-btn" onClick={() => navigate('/user/quotes')}>
                        Back to Quotes
                    </button>
                </div>
                <div className="chat-messages">
                    {selectedConversation.messages.length === 0 && (
                        <div className="no-messages">No messages yet. Start the conversation!</div>
                    )}
                    {selectedConversation.messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.fromUser ? 'user-sent' : 'admin-received'}`}>
                            <div className="message-content">
                                <span className="message-sender">{msg.sender}</span>
                                <p>{msg.text}</p>
                                {msg.image_path && (
                                    <img src={msg.image_path} alt="Attached" className="message-image" />
                                )}
                                <span className="message-timestamp">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input">
                    <textarea
                        value={newMessage}
                        onChange={handleMessageChange}
                        placeholder="Type your message..."
                    />
                    <div className="chat-actions">
                        <input
                            type="file"
                            id="fileUpload"
                            onChange={handleFileChange}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading && conversations.length === 0) {
        return <div className="messages-loading">Loading messages...</div>;
    }

    if (error) {
        return <div className="messages-error">{error}</div>;
    }

    return (
        <div className="user-messages-container">
            {renderConversationList()}
            {renderChatWindow()}
        </div>
    );
};

export default UserMessages;