import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';

const BASE_URL = 'http://77.37.121.137:3000';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const getAuthToken = () => localStorage.getItem('token');
    const axiosWithAuth = axios.create({
        baseURL: BASE_URL,
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosWithAuth.get('/api/get_user');
            if (response.data && response.data.users) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axiosWithAuth.post('/api/create_user', newUser);
            setNewUser({ name: '', email: '', password: '' });
            setShowAddForm(false);
            fetchUsers();
        } catch (error) {
            alert('Failed to add user');
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            // Update user with all required fields
            await axiosWithAuth.put(`/api/update_user/${editingUser.id}`, {
                name: editingUser.name,
                email: editingUser.email,
                contact_no: editingUser.contact_no,
                status: editingUser.status
            });

            setShowEditForm(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            // Find the user to get all their details
            const userToUpdate = users.find(user => user.id === userId);
            
            if (!userToUpdate) {
                alert('User not found');
                return;
            }

            await axiosWithAuth.put(`/api/update_user/${userId}`, {
                name: userToUpdate.name,
                email: userToUpdate.email,
                contact_no: userToUpdate.contact_no,
                status: newStatus
            });
            
            fetchUsers();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axiosWithAuth.delete(`/api/delete_user/${userId}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    if (loading) return <div className="loading">Loading users...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="users-container">
            <h2>Users</h2>
            <button 
                className="add-user-btn" 
                onClick={() => setShowAddForm(true)}
                style={{ marginBottom: '20px' }}
            >
                Add New User
            </button>

            {showAddForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New User</h3>
                        <form onSubmit={handleAddUser}>
                            <input
                                type="text"
                                placeholder="User Name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            />
                            <div className="form-buttons">
                                <button type="submit">Add User</button>
                                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditForm && editingUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit User</h3>
                        <form onSubmit={handleEditUser}>
                            <input
                                type="text"
                                placeholder="User Name"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Contact Number"
                                value={editingUser.contact_no || ''}
                                onChange={(e) => setEditingUser({...editingUser, contact_no: e.target.value})}
                            />
                            <select
                                value={editingUser.status}
                                onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <div className="form-buttons">
                                <button type="submit">Save Changes</button>
                                <button type="button" onClick={() => {
                                    setShowEditForm(false);
                                    setEditingUser(null);
                                }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="list-view">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.contact_no || '-'}</td>
                                <td>{user.status}</td>
                                <td>{user.created_by || '-'}</td>
                                <td>
                                    <button 
                                        style={{ marginRight: '10px' }}
                                        onClick={() => handleStatusChange(user.id, user.status)}
                                    >
                                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button 
                                        style={{ marginRight: '10px' }}
                                        onClick={() => {
                                            setEditingUser(user);
                                            setShowEditForm(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        style={{ backgroundColor: '#ff4444' }}
                                    >
                                        Delete
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

export default Users;
