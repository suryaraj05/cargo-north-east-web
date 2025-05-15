import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserOrderDetails.css';

const BASE_URL = 'http://77.37.121.137:3000';

const UserOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
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
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosWithAuth.get(`/api/order/${orderId}`);
            if (response.data) {
                setOrderDetails(response.data);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Failed to load order details');
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Placeholder function for downloading invoice
    const downloadInvoice = async (orderId) => {
        try {
            // TODO: Implement actual invoice download functionality
            console.log(`Downloading invoice for order: ${orderId}`);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    if (loading) {
        return <div className="order-details-loading">Loading order details...</div>;
    }

    if (error) {
        return <div className="order-details-error">{error}</div>;
    }

    if (!orderDetails || !orderDetails.order) {
        return <div className="order-details-not-found">Order details not found.</div>;
    }

    const { order, custom, attachments } = orderDetails;

    return (
        <div className="order-details-container">
            <div className="order-details-header">
                <h2>Order Details</h2>
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            </div>
            <div className="order-details-content">
                {/* Basic Order Info */}
                <table className="order-details-table">
                    <tbody>
                        <tr><th>Request ID</th><td>{order.id}</td></tr>
                        <tr><th>Status</th><td>{order.status}</td></tr>
                        <tr><th>Action</th><td>{order.action}</td></tr>
                        <tr><th>Service Type</th><td>{order.service_type}</td></tr>
                        <tr><th>Transport Mode</th><td>{order.transport_mode || '-'}</td></tr>
                        <tr><th>Quote Amount</th><td>{order.quote_amount ? `$${order.quote_amount}` : '-'}</td></tr>
                        <tr><th>Invoice Value</th><td>{order.invoice_value ? `$${order.invoice_value}` : '-'}</td></tr>
                        <tr><th>Payment Incoterms</th><td>{order.payment_incoterms || '-'}</td></tr>
                        <tr><th>Created At</th><td>{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</td></tr>
                        <tr><th>Last Updated</th><td>{order.updated_at ? new Date(order.updated_at).toLocaleString() : '-'}</td></tr>
                    </tbody>
                </table>

                {/* Product & Shipment Details */}
                <h3>Product & Shipment Details</h3>
                <table className="order-details-table">
                    <tbody>
                        <tr><th>Commodity Code</th><td>{order.product_commodity_code || '-'}</td></tr>
                        <tr><th>Description</th><td>{order.good_description || '-'}</td></tr>
                        <tr><th>Is Food Product</th><td>{order.is_food_product ? 'Yes' : 'No'}</td></tr>
                        <tr><th>Is Hazardous</th><td>{order.is_hazardous_goods ? 'Yes' : 'No'}</td></tr>
                        <tr><th>Is Temperature Controlled</th><td>{order.is_temperature_controlled_goods ? 'Yes' : 'No'}</td></tr>
                    </tbody>
                </table>

                {/* Parties Involved */}
                <h3>Parties Involved</h3>
                <table className="order-details-table">
                    <tbody>
                        <tr><th>Receiver Company Name</th><td>{custom?.receiver_company_name || '-'}</td></tr>
                        <tr><th>Receiver Company Address</th><td>{custom?.receiver_company_address || '-'}</td></tr>
                        <tr><th>Receiver EORI No</th><td>{custom?.receiver_eori_no || '-'}</td></tr>
                        <tr><th>Receiver VAT No</th><td>{custom?.receiver_vat_no || '-'}</td></tr>
                        <tr><th>Receiver Contact Email</th><td>{custom?.receiver_contact_email || '-'}</td></tr>
                        <tr><th>Receiver Contact No</th><td>{custom?.receiver_contact_no || '-'}</td></tr>
                        <tr><th>Sender Company Name</th><td>{custom?.sender_company_name || '-'}</td></tr>
                        <tr><th>Sender Company Address</th><td>{custom?.sender_company_address || '-'}</td></tr>
                        <tr><th>Sender EORI No</th><td>{custom?.sender_eori_no || '-'}</td></tr>
                        <tr><th>Sender VAT No</th><td>{custom?.sender_vat_no || '-'}</td></tr>
                        <tr><th>Sender Contact Email</th><td>{custom?.sender_contact_email || '-'}</td></tr>
                        <tr><th>Sender Contact Number</th><td>{custom?.sender_contact_number || '-'}</td></tr>
                        <tr><th>Buyer Company Name</th><td>{custom?.buyer_company_name || '-'}</td></tr>
                        <tr><th>Buyer Company Address</th><td>{custom?.buyer_company_address || '-'}</td></tr>
                        <tr><th>Buyer EORI No</th><td>{custom?.buyer_eori_no || '-'}</td></tr>
                        <tr><th>Buyer VAT No</th><td>{custom?.buyer_vat_no || '-'}</td></tr>
                        <tr><th>Buyer Contact Email</th><td>{custom?.buyer_contact_email || '-'}</td></tr>
                        <tr><th>Buyer Contact Number</th><td>{custom?.buyer_contact_number || '-'}</td></tr>
                        <tr><th>Seller Company Name</th><td>{custom?.seller_company_name || '-'}</td></tr>
                        <tr><th>Seller Company Address</th><td>{custom?.seller_company_address || '-'}</td></tr>
                        <tr><th>Seller EORI No</th><td>{custom?.seller_eori_no || '-'}</td></tr>
                        <tr><th>Seller VAT No</th><td>{custom?.seller_vat_no || '-'}</td></tr>
                        <tr><th>Seller Contact Email</th><td>{custom?.seller_contact_email || '-'}</td></tr>
                        <tr><th>Seller Contact Number</th><td>{custom?.seller_contact_number || '-'}</td></tr>
                    </tbody>
                </table>

                {/* Attachments */}
                <h3>Attachments</h3>
                {attachments && attachments.image_path ? (
                    <div className="order-attachments">
                        <img src={attachments.image_path} alt="Attachment" className="order-attachment-image" />
                        <div><a href={attachments.image_path} target="_blank" rel="noopener noreferrer">View Full Image</a></div>
                    </div>
                ) : (
                    <div>No attachments available.</div>
                )}

                {/* Download Invoice for completed orders */}
                {order.status === 'completed' && (
                    <div className="order-details-section">
                        <button className="download-invoice-button" onClick={() => downloadInvoice(order.id)}>
                            Download Invoice
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrderDetails; 