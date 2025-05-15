import React, { useState, useEffect } from 'react';
import './UserInvoices.css';
import axios from 'axios';

const BASE_URL = 'http://77.37.121.137:3000';

const UserInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axiosWithAuth.get('/api/user/invoice');
            if (response.data && response.data.invoices) {
                setInvoices(response.data.invoices);
            }
        } catch (error) {
            setError('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = (invoicePath) => {
        window.open(invoicePath, '_blank');
    };

    if (loading) {
        return <div className="user-invoices-loading">Loading invoices...</div>;
    }
    if (error) {
        return <div className="user-invoices-error">{error}</div>;
    }

    return (
        <div className="user-invoices-container">
            <h2>Invoices</h2>
            <div className="invoices-list">
                <h3>Invoices List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Request ID</th>
                            <th>Quote Amount</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>{invoice.id}</td>
                                <td>{invoice.order_id}</td>
                                <td>${invoice.quote_amount}</td>
                                <td>{invoice.created_at ? new Date(invoice.created_at).toLocaleString() : '-'}</td>
                                <td>
                                    <button onClick={() => downloadInvoice(invoice.invoice_path)}>
                                        Download Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserInvoices;
