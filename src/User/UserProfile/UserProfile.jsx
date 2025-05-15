import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const BASE_URL = 'http://77.37.121.137:3000';
console.log(BASE_URL);
const UserProfile = () => {
    // User's own profile
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        contact_no: '',
        role: '',
    });
    const [profileMsg, setProfileMsg] = useState('');
    const [profileError, setProfileError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editProfile, setEditProfile] = useState({ name: '', email: '', contact_no: '' });

    // Password change state
    const [passwordFields, setPasswordFields] = useState({
        current_password: '',
        password: '',
        confirm_password: ''
    });
    const [passwordMsg, setPasswordMsg] = useState('');
    const [passwordError, setPasswordError] = useState('');
    
    // Managed accounts
    const [managedAccounts, setManagedAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for adding a new account
    const [newAccount, setNewAccount] = useState({ 
        name: '', 
        email: '', 
        password: '' 
    });

    // State for editing an existing account
    const [editingAccount, setEditingAccount] = useState(null);

    // Get token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    // Fetch profile details
    const fetchProfile = () => {
        const token = getAuthToken();
        fetch(`${BASE_URL}/api/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUserProfile({
                        name: data.user.name || '',
                        email: data.user.email || '',
                        contact_no: data.user.contact_no || '',
                        role: data.user.role || '',
                    });
                } else {
                    setProfileError('No user data in response.');
                }
            })
            .catch((err) => {
                setProfileError('Failed to load profile.');
                console.error('Fetch error:', err);
            });
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Handle changes to edit profile fields
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfile({ ...editProfile, [name]: value });
    };

    // Start editing
    const handleEdit = () => {
        setEditProfile({
            name: userProfile.name,
            email: userProfile.email,
            contact_no: userProfile.contact_no,
        });
        setIsEditing(true);
        setProfileMsg('');
        setProfileError('');
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setIsEditing(false);
        setProfileMsg('');
        setProfileError('');
    };

    // Save profile changes
    const handleProfileUpdate = async () => {
        setProfileMsg('');
        setProfileError('');
        const token = getAuthToken();
        try {
            const res = await fetch(`${BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editProfile.name,
                    email: editProfile.email,
                    contact_no: editProfile.contact_no,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setProfileMsg(data.message || 'Profile updated successfully!');
                setIsEditing(false);
                fetchProfile();
            } else {
                setProfileError(data.message || 'Failed to update profile.');
            }
        } catch (err) {
            setProfileError('Failed to update profile.');
        }
    };

    // Password change handlers
    const handlePasswordFieldChange = (e) => {
        const { name, value } = e.target;
        setPasswordFields({ ...passwordFields, [name]: value });
    };
    const handlePasswordChange = async () => {
        setPasswordMsg('');
        setPasswordError('');
        if (passwordFields.password !== passwordFields.confirm_password) {
            setPasswordError('New password and confirm password do not match.');
            return;
        }
        const token = getAuthToken();
        try {
            const res = await fetch(`${BASE_URL}/api/change_password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(passwordFields),
            });
            const data = await res.json();
            if (res.ok) {
                setPasswordMsg(data.message || 'Password updated successfully!');
                setPasswordFields({ current_password: '', password: '', confirm_password: '' });
            } else {
                setPasswordError(data.message || 'Failed to update password.');
            }
        } catch (err) {
            setPasswordError('Failed to update password.');
        }
    };

    // Handle changes to new account form
    const handleNewAccountChange = (e) => {
        const { name, value } = e.target;
        setNewAccount({ ...newAccount, [name]: value });
    };

    // Add this function to fetch managed accounts
    const fetchManagedAccounts = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/api/get_user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            
            if (data && data.users) {
                // Filter users created by the current user
                const currentUser = userProfile.name;
                const filteredUsers = data.users.filter(user => user.created_by === currentUser);
                setManagedAccounts(filteredUsers);
            }
        } catch (error) {
            console.error('Error fetching managed accounts:', error);
            setError('Failed to load managed accounts');
        } finally {
            setLoading(false);
        }
    };

    // Add this useEffect to fetch managed accounts when profile is loaded
    useEffect(() => {
        if (userProfile.name) {
            fetchManagedAccounts();
        }
    }, [userProfile.name]);

    // Update handleAddAccount to refresh the list after adding
    const handleAddAccount = async () => {
        if (!newAccount.name || !newAccount.email || !newAccount.password) {
            alert('Please fill in all fields to add a new account.');
            return;
        }

        const token = getAuthToken();
        try {
            const response = await fetch(`${BASE_URL}/api/create_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newAccount),
            });

            const data = await response.json();
            if (response.ok) {
                alert('New account created successfully!');
                setNewAccount({ name: '', email: '', password: '' });
                fetchManagedAccounts(); // Refresh the list
            } else {
                alert(data.message || 'Failed to create account.');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            alert('Failed to create account. Please try again.');
        }
    };

    // Start editing an account
    const handleEditStart = (account) => {
        setEditingAccount({ ...account });
    };

    // Handle changes to the editing account
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingAccount({ ...editingAccount, [name]: value });
    };

    // Update handleEditSave to refresh the list after editing
    const handleEditSave = async () => {
        if (!editingAccount) return;

        const token = getAuthToken();
        try {
            const response = await fetch(`${BASE_URL}/api/update_user/${editingAccount.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editingAccount.name,
                    email: editingAccount.email,
                    contact_no: editingAccount.contact_no,
                    status: editingAccount.status || 'active'
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Account updated successfully!');
                setEditingAccount(null);
                fetchManagedAccounts(); // Refresh the list
            } else {
                alert(data.message || 'Failed to update account.');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            alert('Failed to update account. Please try again.');
        }
    };

    // Cancel editing
    const handleEditCancel = () => {
        setEditingAccount(null);
    };

    // Update handleDeleteAccount to refresh the list after deleting
    const handleDeleteAccount = async (id) => {
        if (!window.confirm('Are you sure you want to delete this account?')) {
            return;
        }

        const token = getAuthToken();
        try {
            const response = await fetch(`${BASE_URL}/api/delete_user/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                alert('Account deleted successfully!');
                fetchManagedAccounts(); // Refresh the list
            } else {
                alert(data.message || 'Failed to delete account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again.');
        }
    };

    return (
        <div className="user-profile-container">
            <h2>User Profile</h2>

            {/* Edit Profile Section */}
            <div className="edit-profile">
                <h3>Your Profile</h3>
                {profileMsg && <div className="success-msg">{profileMsg}</div>}
                {profileError && <div className="error-msg">{profileError}</div>}
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={isEditing ? editProfile.name : userProfile.name}
                        onChange={isEditing ? handleEditInputChange : undefined}
                        readOnly={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={isEditing ? editProfile.email : userProfile.email}
                        onChange={isEditing ? handleEditInputChange : undefined}
                        readOnly={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contact_no">Contact Number:</label>
                    <input
                        type="text"
                        id="contact_no"
                        name="contact_no"
                        value={isEditing ? editProfile.contact_no : userProfile.contact_no}
                        onChange={isEditing ? handleEditInputChange : undefined}
                        readOnly={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={userProfile.role}
                        readOnly
                    />
                </div>
                {!isEditing ? (
                    <button onClick={handleEdit}>Edit</button>
                ) : (
                    <>
                        <button onClick={handleProfileUpdate}>Save</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                )}
            </div>

            {/* Manage Accounts Section */}
            <div className="manage-accounts">
                <h3>Manage Accounts</h3>
                {loading ? (
                    <p>Loading managed accounts...</p>
                ) : error ? (
                    <p className="error-msg">{error}</p>
                ) : managedAccounts.length > 0 ? (
                    <table className="accounts-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {managedAccounts.map((account) => (
                                <tr key={account.id}>
                                    <td>{account.name}</td>
                                    <td>{account.email}</td>
                                    <td>{account.contact_no || '-'}</td>
                                    <td>{account.status}</td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditStart(account)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteAccount(account.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No managed accounts yet.</p>
                )}

                {/* Add New Account Form */}
                <div className="add-account-form">
                    <h4>Add New Account</h4>
                    <div className="form-group">
                        <label htmlFor="newAccountName">Name:</label>
                        <input
                            type="text"
                            id="newAccountName"
                            name="name"
                            value={newAccount.name}
                            onChange={handleNewAccountChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newAccountEmail">Email:</label>
                        <input
                            type="email"
                            id="newAccountEmail"
                            name="email"
                            value={newAccount.email}
                            onChange={handleNewAccountChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newAccountPassword">Password:</label>
                        <input
                            type="password"
                            id="newAccountPassword"
                            name="password"
                            value={newAccount.password}
                            onChange={handleNewAccountChange}
                        />
                    </div>
                    <button onClick={handleAddAccount}>Add Account</button>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="change-password">
                <h3>Change Password</h3>
                {passwordMsg && <div className="success-msg">{passwordMsg}</div>}
                {passwordError && <div className="error-msg">{passwordError}</div>}
                <div className="form-group">
                    <label htmlFor="current_password">Current Password:</label>
                    <input
                        type="password"
                        id="current_password"
                        name="current_password"
                        value={passwordFields.current_password}
                        onChange={handlePasswordFieldChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={passwordFields.password}
                        onChange={handlePasswordFieldChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm_password">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={passwordFields.confirm_password}
                        onChange={handlePasswordFieldChange}
                    />
                </div>
                <button onClick={handlePasswordChange}>Change Password</button>
            </div>
        </div>
    );
};

export default UserProfile;