import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserInProgressRequest.css';

const BASE_URL = 'http://77.37.121.137:3000';

const UserInProgressRequest = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

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
        // Set up polling for order updates every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axiosWithAuth.get('/api/user/order');
            if (response.data && response.data.orders) {
                const inProgressOrders = response.data.orders.filter(order => order.status === 'inprogress');
                setOrders(inProgressOrders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
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
        <div className="user-in-progress-request-container">
            <h2>In Progress Orders</h2>

            <div className="user-list-view">
                <table className="user-orders-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Service Type</th>
                            <th>Current Status</th>
                            <th>Last Update</th>
                            <th>Quote Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.service_type}</td>
                                <td>{order.action}</td>
                                <td>{new Date(order.updated_at).toLocaleDateString()}</td>
                                <td>${order.quote_amount}</td>
                                <td>
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

export default UserInProgressRequest;
