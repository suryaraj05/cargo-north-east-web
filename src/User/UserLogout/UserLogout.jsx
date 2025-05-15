import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after logging out

const UserLogOut = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // To navigate after logout

    const handleLogOut = () => {
        if (!window.confirm('Are you sure you want to log out?')) {
            return;
        }
        setLoading(true);

        // Clear user session (localStorage, cookies, or context)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();

        // Redirect to login or home page after logout
        navigate('/login');

        setLoading(false);
    };

    return (
        <div className="user-log-out-container">
            <h2>Log Out</h2>
            <button
                onClick={handleLogOut}
                disabled={loading}
                className="log-out-btn"
            >
                {loading ? 'Logging Out...' : 'Log Out'}
            </button>
        </div>
    );
};

export default UserLogOut;
