import React, { useState, useEffect } from 'react';
import './Quotes.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://77.37.121.137:3000';

const Quotes = () => {
    const [tab, setTab] = useState('pending');
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quoteForm, setQuoteForm] = useState({ quoteId: '', orderId: '', amount: '', message: '', currency: 'USD' });
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

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
            setLoading(true);
            const response = await axiosWithAuth.get('/api/admin/quotes');
            if (response.data && response.data.quotes) {
                setQuotes(response.data.quotes);
            }
        } catch (error) {
            setError('Failed to load quotes');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (newTab) => {
        setTab(newTab);
    };

    const handleQuoteFormChange = (e) => {
        const { name, value } = e.target;
        setQuoteForm({ ...quoteForm, [name]: value });
    };

    const handleResendQuote = async (quote) => {
        if (!quoteForm.amount || !quoteForm.message) {
            alert('Please enter amount and message.');
            return;
        }
        try {
            await axiosWithAuth.post('/api/admin/quotes', {
                order_id: quote.order_id,
                quote_amount: quoteForm.amount,
                currency: quoteForm.currency,
                message: quoteForm.message
            });
            setSuccessMsg('Quote resent successfully!');
            setQuoteForm({ quoteId: '', orderId: '', amount: '', message: '', currency: 'USD' });
            fetchQuotes();
        } catch (error) {
            alert('Failed to resend quote.');
        }
    };

    const handleViewQuoteMessages = (orderId) => {
        navigate('/admin/messages', { state: { orderId } });
    };

    const getFilteredQuotes = (status) => quotes.filter(q => q.status === status);

    const renderListView = () => {
        let filteredQuotes = [];
        let tabLabel = '';
        if (tab === 'pending') {
            filteredQuotes = getFilteredQuotes('pending');
            tabLabel = 'Pending Quotes';
        } else if (tab === 'accepted') {
            filteredQuotes = getFilteredQuotes('accepted');
            tabLabel = 'Accepted Quotes';
        } else if (tab === 'declined') {
            filteredQuotes = getFilteredQuotes('declined');
            tabLabel = 'Declined Quotes';
        }
        return (
            <table className="quotes-table">
                <thead>
                    <tr>
                        <th>Quote ID</th>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Sent At</th>
                        <th>Responded At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQuotes.map((quote) => (
                        <tr key={quote.id}>
                            <td>{quote.id}</td>
                            <td>{quote.order_id}</td>
                            <td>{quote.quote_amount}</td>
                            <td>{quote.currency}</td>
                            <td>{quote.message}</td>
                            <td>{quote.status}</td>
                            <td>{quote.sent_at ? new Date(quote.sent_at).toLocaleString() : '-'}</td>
                            <td>{quote.responded_at ? new Date(quote.responded_at).toLocaleString() : '-'}</td>
                            <td>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Quote Amount"
                                    value={quoteForm.quoteId === quote.id ? quoteForm.amount : ''}
                                    onChange={e => setQuoteForm({ ...quoteForm, quoteId: quote.id, orderId: quote.order_id, amount: e.target.value })}
                                    style={{ width: '100px', marginRight: '5px' }}
                                />
                                <input
                                    type="text"
                                    name="message"
                                    placeholder="Message"
                                    value={quoteForm.quoteId === quote.id ? quoteForm.message : ''}
                                    onChange={e => setQuoteForm({ ...quoteForm, quoteId: quote.id, orderId: quote.order_id, message: e.target.value })}
                                    style={{ width: '150px', marginRight: '5px' }}
                                />
                                <button onClick={() => handleResendQuote(quote)}>Resend Quote</button>
                                <button onClick={() => handleViewQuoteMessages(quote.order_id)} style={{ marginLeft: '5px' }}>View Quote Messages</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="quotes-container">
            <div className="tab-menu">
                <button className={tab === 'pending' ? 'active' : ''} onClick={() => handleTabChange('pending')}>
                    Pending Quotes
                </button>
                <button className={tab === 'accepted' ? 'active' : ''} onClick={() => handleTabChange('accepted')}>
                    Accepted Quotes
                </button>
                <button className={tab === 'declined' ? 'active' : ''} onClick={() => handleTabChange('declined')}>
                    Declined Quotes
                </button>
            </div>

            {successMsg && <div className="quotes-success">{successMsg}</div>}
            {error && <div className="quotes-error">{error}</div>}

            <div className="tab-content">
                {loading ? <div>Loading quotes...</div> : renderListView()}
            </div>
        </div>
    );
};

export default Quotes;
