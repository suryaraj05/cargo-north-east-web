import React, { useState, useEffect } from 'react';
import './UserQuotes.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://77.37.121.137:3000';

const UserQuotes = () => {
    const navigate = useNavigate();
    const [pendingQuotes, setPendingQuotes] = useState([]);
    const [acceptedQuotes, setAcceptedQuotes] = useState([]);
    const [declinedQuotes, setDeclinedQuotes] = useState([]);

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

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const response = await axiosWithAuth.get('/api/user/quotes');
            if (response.data && response.data.quotes) {
                const quotes = response.data.quotes;
                
                // Categorize quotes based on status
                const pending = quotes.filter(quote => quote.status === 'pending');
                const accepted = quotes.filter(quote => quote.status === 'accepted');
                const declined = quotes.filter(quote => quote.status === 'declined');
                
                setPendingQuotes(pending);
                setAcceptedQuotes(accepted);
                setDeclinedQuotes(declined);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
            if (error.response && error.response.status === 401) {
                // Handle unauthorized access - redirect to login
                navigate('/login');
            }
        }
    };

    const updateQuoteStatus = async (quoteId, status) => {
        try {
            await axiosWithAuth.put(`/api/user/quotes/${quoteId}/status`, {
                status: status
            });
            fetchQuotes(); // Refresh quotes after status update
        } catch (error) {
            console.error('Error updating quote status:', error);
            if (error.response && error.response.status === 401) {
                // Handle unauthorized access - redirect to login
                navigate('/login');
            }
        }
    };

    const acceptQuote = async (quoteId) => {
        await updateQuoteStatus(quoteId, 'accepted');
    };

    const declineQuote = async (quoteId) => {
        await updateQuoteStatus(quoteId, 'declined');
    };

    const negotiateQuote = (orderId) => {
        navigate('/user/messages', { state: { selectedRequestId: orderId } });
    };

    return (
        <div className="user-quotes-container">
            <h2>Manage Quotes</h2>

            {/* Pending Quotes Section */}
            <div className="quotes-section">
                <h3>Pending Quotes</h3>
                <table className="user-quotes-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Quote Amount</th>
                            <th>Currency</th>
                            <th>Message</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingQuotes.map((quote) => (
                            <tr key={quote.id}>
                                <td>{quote.order_id}</td>
                                <td>{quote.quote_amount}</td>
                                <td>{quote.currency}</td>
                                <td>{quote.message}</td>
                                <td>
                                    <button onClick={() => acceptQuote(quote.id)}>Accept Quote</button>
                                    <button className="decline-btn" onClick={() => declineQuote(quote.id)}>Decline Quote</button>
                                    <button className="negotiate-btn" onClick={() => negotiateQuote(quote.order_id)}>Negotiate Quote</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Accepted Quotes Section */}
            <div className="quotes-section">
                <h3>Accepted Quotes</h3>
                <table className="user-quotes-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Quote Amount</th>
                            <th>Currency</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {acceptedQuotes.map((quote) => (
                            <tr key={quote.id}>
                                <td>{quote.order_id}</td>
                                <td>{quote.quote_amount}</td>
                                <td>{quote.currency}</td>
                                <td>{quote.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Declined Quotes Section */}
            <div className="quotes-section">
                <h3>Declined Quotes</h3>
                <table className="user-quotes-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Quote Amount</th>
                            <th>Currency</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {declinedQuotes.map((quote) => (
                            <tr key={quote.id}>
                                <td>{quote.order_id}</td>
                                <td>{quote.quote_amount}</td>
                                <td>{quote.currency}</td>
                                <td>{quote.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserQuotes;