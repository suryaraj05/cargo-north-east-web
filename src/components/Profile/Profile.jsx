import React, { useState, useEffect } from 'react';
import './Profile.css';

const BASE_URL = 'http://77.37.121.137:3000';

const Profile = () => {
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
                } else if (data.profile) {
                    setUserProfile({
                        name: data.profile.name || '',
                        email: data.profile.email || '',
                        contact_no: data.profile.contact_no || '',
                        role: data.profile.role || '',
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
                method: 'PUT',
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

    return (
        <div className="user-profile-container">
            <h2>Profile</h2>

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
                {userProfile.role && (
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
                )}
                {!isEditing ? (
                    <button onClick={handleEdit}>Edit</button>
                ) : (
                    <>
                        <button onClick={handleProfileUpdate}>Save</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                )}
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

export default Profile;

