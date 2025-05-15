import React, { useState, useEffect } from 'react';
import './Invoices.css';
import axios from 'axios';

const BASE_URL = 'http://77.37.121.137:3000';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [newInvoice, setNewInvoice] = useState({ requestId: '', file: null });
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
            const response = await axiosWithAuth.get('/api/admin/invoice');
            if (response.data && response.data.invoices) {
                setInvoices(response.data.invoices);
            }
        } catch (error) {
            setError('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setNewInvoice({ ...newInvoice, file: event.target.files[0] });
    };

    const handleInputChange = (event) => {
        setNewInvoice({ ...newInvoice, requestId: event.target.value });
    };

    const handleUploadInvoice = async () => {
        if (newInvoice.requestId && newInvoice.file) {
            try {
                const formData = new FormData();
                formData.append('order_id', newInvoice.requestId);
                formData.append('file', newInvoice.file);
                const response = await axiosWithAuth.post('/api/admin/invoice', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data && response.data.invoice) {
                    setInvoices(prev => [...prev, response.data.invoice]);
                    alert('Invoice uploaded and user notified.');
                    setNewInvoice({ requestId: '', file: null });
                }
            } catch (error) {
                alert('Failed to upload invoice.');
            }
        } else {
            alert('Please fill all fields.');
        }
    };

    const getDownloadUrl = (filename) => `${BASE_URL}/api/download/${filename}`;

    const viewInvoice = (filename) => {
        window.open(getDownloadUrl(filename), '_blank');
    };

    const downloadInvoice = (filename) => {
        // For download, open in new tab (browser will handle download if file type is not viewable)
        window.open(getDownloadUrl(filename), '_blank');
    };

    if (loading) {
        return <div className="invoices-loading">Loading invoices...</div>;
    }
    if (error) {
        return <div className="invoices-error">{error}</div>;
    }

    return (
        <div className="invoices-container">
            <h2>Invoices</h2>

            <div className="list-view">
                <table className="invoices-table">
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>User Name</th>
                            <th>Request ID</th>
                            <th>Upload Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>{invoice.id}</td>
                                <td>{invoice.name}</td>
                                <td>{invoice.order_id}</td>
                                <td>{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : '-'}</td>
                                <td>
                                    <button style={{ marginRight: '10px' }} onClick={() => viewInvoice(invoice.filename)}>View Invoice</button>
                                    <button onClick={() => downloadInvoice(invoice.filename)}>Download Invoice</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="send-invoice">
                <h3>Send Invoice</h3>
                <div className="form-group">
                    <label htmlFor="requestId">Request ID:</label>
                    <input
                        type="text"
                        id="requestId"
                        value={newInvoice.requestId}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="invoiceFile">Attach Invoice Picture:</label>
                    <input type="file" id="invoiceFile" onChange={handleFileChange} />
                </div>

                <button onClick={handleUploadInvoice}>Upload and Notify</button>
            </div>
        </div>
    );
};

export default Invoices;
