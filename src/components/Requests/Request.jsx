import React, { useState, useEffect } from 'react';
import './Requests.css';
import axios from 'axios';

const BASE_URL = 'http://77.37.121.137:3000';

const Request = () => {
    const [tab, setTab] = useState('new');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [quoteForm, setQuoteForm] = useState({ amount: '', message: '', currency: 'USD' });
    const [invoiceFile, setInvoiceFile] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [uploadingOrderId, setUploadingOrderId] = useState(null);
    const [orderFiles, setOrderFiles] = useState({});

    // Get token from localStorage
    const getAuthToken = () => localStorage.getItem('token');

    // Axios instance
    const axiosWithAuth = axios.create({
        baseURL: BASE_URL,
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    // Add request interceptor for debugging
    axiosWithAuth.interceptors.request.use(request => {
        console.log('Request being sent:', {
            url: request.url,
            method: request.method,
            headers: request.headers,
            data: request.data instanceof FormData ? 'FormData' : request.data
        });
        return request;
    });

    useEffect(() => {
        fetchOrders();
        fetchInvoices();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosWithAuth.get('/api/admin/order');
            if (response.data && response.data.data) {
                setOrders(response.data.data);
            }
        } catch (error) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoices = async () => {
        try {
            const response = await axiosWithAuth.get('/api/admin/invoice');
            if (response.data && response.data.invoices) {
                setInvoices(response.data.invoices);
            }
        } catch (error) {
            // ignore
        }
    };

    const handleTabChange = (newTab) => {
        setTab(newTab);
        setSelectedOrder(null);
        setShowDetails(false);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosWithAuth.put(`/api/admin/orders/${orderId}/action`, { action: newStatus });
            setSuccessMsg('Order status updated!');
            fetchOrders();
        } catch (error) {
            alert('Failed to update status.');
        }
    };

    const handleSendQuote = async (orderId) => {
        if (!quoteForm.amount || !quoteForm.message) {
            alert('Please enter amount and message.');
            return;
        }
        try {
            await axiosWithAuth.post('/api/admin/quotes', {
                order_id: orderId,
                quote_amount: quoteForm.amount,
                currency: quoteForm.currency,
                message: quoteForm.message
            });
            setSuccessMsg('Quote sent successfully!');
            setQuoteForm({ amount: '', message: '', currency: 'USD' });
            fetchOrders();
        } catch (error) {
            alert('Failed to send quote.');
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            setLoading(true);
            const response = await axiosWithAuth.get(`/api/order/${orderId}`);
            if (response.data) {
                setSelectedOrder(response.data);
                setShowDetails(true);
            }
        } catch (error) {
            alert('Failed to fetch order details.');
        } finally {
            setLoading(false);
        }
    };

    const handleInvoiceFileChange = (e, orderId) => {
        const file = e.target.files[0];
        if (file) {
            setOrderFiles(prev => ({ ...prev, [orderId]: file }));
        }
    };

    const handleUploadInvoice = async (orderId) => {
        const file = orderFiles[orderId];
        
        if (!orderId) {
            alert('Order ID is missing.');
            return;
        }
        
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        try {
            setUploadingOrderId(orderId);
            const formData = new FormData();
            
            // Try different field names that might be expected by the server
            formData.append('order_id', String(orderId));
            formData.append('file', file);
            formData.append('invoice_file', file);

            console.log('Uploading invoice for order:', orderId);
            console.log('File details:', {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified
            });

            // Log FormData contents
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
            }

            const response = await axiosWithAuth.post('/api/admin/invoice', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                timeout: 30000,
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            });

            console.log('Upload response:', response);

            if (response.status === 200) {
                setSuccessMsg('Invoice uploaded successfully!');
                setOrderFiles(prev => {
                    const newFiles = { ...prev };
                    delete newFiles[orderId];
                    return newFiles;
                });
                
                // Reset the file input
                const fileInput = document.getElementById(`invoice-file-${orderId}`);
                if (fileInput) {
                    fileInput.value = '';
                }
                
                fetchInvoices();
            } else {
                throw new Error(response.data?.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });
            
            let errorMessage = 'Failed to upload invoice. ';
            if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else if (error.message) {
                errorMessage += error.message;
            }
            alert(errorMessage);
        } finally {
            setUploadingOrderId(null);
        }
    };

    const handleDownloadInvoice = (filename) => {
        window.open(`${BASE_URL}/api/download/${filename}`, '_blank');
    };

    const getInvoicesForOrder = (orderId) => invoices.filter(inv => inv.order_id === orderId);

    const getFilteredOrders = () => {
        if (tab === 'new') return orders.filter(o => o.status === 'new');
        if (tab === 'inprogress') return orders.filter(o => o.status === 'inprogress');
        if (tab === 'completed') return orders.filter(o => o.status === 'completed');
        return [];
    };

    return (
        <div className="requests-container">
            <div className="tab-menu">
                <button className={tab === 'new' ? 'active' : ''} onClick={() => handleTabChange('new')}>New Requests</button>
                <button className={tab === 'inprogress' ? 'active' : ''} onClick={() => handleTabChange('inprogress')}>In Progress</button>
                <button className={tab === 'completed' ? 'active' : ''} onClick={() => handleTabChange('completed')}>Completed</button>
            </div>
            {successMsg && <div className="requests-success">{successMsg}</div>}
            {error && <div className="requests-error">{error}</div>}
            <div className="tab-content">
                {!showDetails ? (
                    <table className="requests-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Service Type</th>
                                <th>Status</th>
                                <th>Action</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredOrders().map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.service_type}</td>
                                    <td>{order.status}</td>
                                    <td>{order.action}</td>
                                    <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <button onClick={() => handleViewDetails(order.id)}>View Details</button>
                                        {tab === 'new' && (
                                            <>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    placeholder="Quote Amount"
                                                    value={quoteForm.orderId === order.id ? quoteForm.amount : ''}
                                                    onChange={e => setQuoteForm({ ...quoteForm, orderId: order.id, amount: e.target.value })}
                                                    style={{ width: '100px', marginLeft: '5px' }}
                                                />
                                                <input
                                                    type="text"
                                                    name="message"
                                                    placeholder="Message"
                                                    value={quoteForm.orderId === order.id ? quoteForm.message : ''}
                                                    onChange={e => setQuoteForm({ ...quoteForm, orderId: order.id, message: e.target.value })}
                                                    style={{ width: '150px', marginLeft: '5px' }}
                                                />
                                                <button onClick={() => handleSendQuote(order.id)} style={{ marginLeft: '5px' }}>Send Quote</button>
                                            </>
                                        )}
                                        {tab === 'inprogress' && (
                                            <select
                                                value={order.action || ''}
                                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                                style={{ marginLeft: '5px' }}
                                            >
                                                <option value="">Change Status</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Dispatched">Dispatched</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        )}
                                        {tab === 'completed' && getInvoicesForOrder(order.id).map(inv => (
                                            <button key={inv.id} onClick={() => handleDownloadInvoice(inv.filename)} style={{ marginLeft: '5px' }}>Download Invoice</button>
                                        ))}
                                        {tab === 'completed' && (
                                            <>
                                                <input
                                                    type="file"
                                                    id={`invoice-file-${order.id}`}
                                                    onChange={(e) => handleInvoiceFileChange(e, order.id)}
                                                    style={{ marginLeft: '5px' }}
                                                />
                                                <button
                                                    onClick={() => handleUploadInvoice(order.id)}
                                                    disabled={uploadingOrderId === order.id}
                                                    style={{ marginLeft: '5px' }}
                                                >
                                                    {uploadingOrderId === order.id ? 'Uploading...' : 'Upload Invoice'}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="details-view">
                        <h2>Order Details</h2>
                        {selectedOrder && (
                            <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>
                        )}
                        <button onClick={() => setShowDetails(false)}>Back to List</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Request;
