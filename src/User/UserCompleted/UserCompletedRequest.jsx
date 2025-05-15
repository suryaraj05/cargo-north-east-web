import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserCompletedRequest.css';

const BASE_URL = 'http://77.37.121.137:3000';

const UserCompletedRequest = () => {
    const navigate = useNavigate();
    const [completedOrders, setCompletedOrders] = useState([]);

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
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axiosWithAuth.get('/api/user/order');
            if (response.data && response.data.orders) {
                const completed = response.data.orders.filter(order => order.status === 'completed');
                setCompletedOrders(completed);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response && error.response.status === 401) {
                // Handle unauthorized access - redirect to login
                navigate('/login');
            }
        }
    };

    const downloadInvoice = async (orderId) => {
        try {
            // Implement invoice download logic
            console.log(`Downloading invoice for order: ${orderId}`);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            if (error.response && error.response.status === 401) {
                // Handle unauthorized access - redirect to login
                navigate('/login');
            }
        }
    };

    const viewOrderDetails = (orderId) => {
        navigate(`/user/order/${orderId}`);
    };

    return (
        <div className="user-completed-request-container">
            <h2>Completed Orders</h2>

            <div className="user-list-view">
                <table className="user-completed-orders-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Service Type</th>
                            <th>Completion Date</th>
                            <th>Quote Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.service_type}</td>
                                <td>{new Date(order.updated_at).toLocaleDateString()}</td>
                                <td>${order.quote_amount}</td>
                                <td>
                                    <button onClick={() => downloadInvoice(order.id)}>Download Invoice</button>
                                    <button className="user-view-details-button" onClick={() => viewOrderDetails(order.id)}>
                                        View Details
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

export default UserCompletedRequest;
