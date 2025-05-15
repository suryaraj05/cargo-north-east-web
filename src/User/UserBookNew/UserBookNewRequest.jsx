import React, { useState } from 'react';
import './UserBookNewRequest.css';

const UserBookNewRequest = () => {
    const [requestDetails, setRequestDetails] = useState({
        serviceType: '',
        origin: '',
        destination: '',
        weight: '',
        dimensions: '',
        documents: [],
        specialNotes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestDetails({ ...requestDetails, [name]: value });
    };

    const handleFileChange = (e) => {
        setRequestDetails({ ...requestDetails, documents: e.target.files });
    };

    const submitRequest = () => {
        if (requestDetails.serviceType && requestDetails.origin && requestDetails.destination) {
            alert('Request submitted successfully.');
            // Reset form
            setRequestDetails({
                serviceType: '',
                origin: '',
                destination: '',
                weight: '',
                dimensions: '',
                documents: [],
                specialNotes: ''
            });
        } else {
            alert('Please fill all required fields.');
        }
    };

    return (
        <div className="user-book-new-request-container">
            <h2>Book New Request</h2>

            <div className="user-form-group">
                <label htmlFor="serviceType">Service Type:</label>
                <select
                    id="serviceType"
                    name="serviceType"
                    value={requestDetails.serviceType}
                    onChange={handleInputChange}
                >
                    <option value="">Select Service</option>
                    <option value="Shipment">Shipment</option>
                    <option value="Customs Clearance">Customs Clearance</option>
                    <option value="Both">Both</option>
                </select>
            </div>

            <div className="user-form-group">
                <label htmlFor="origin">Origin Postcode:</label>
                <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={requestDetails.origin}
                    onChange={handleInputChange}
                />
            </div>

            <div className="user-form-group">
                <label htmlFor="destination">Destination Postcode:</label>
                <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={requestDetails.destination}
                    onChange={handleInputChange}
                />
            </div>

            <div className="user-form-group">
                <label htmlFor="weight">Weight:</label>
                <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={requestDetails.weight}
                    onChange={handleInputChange}
                />
            </div>

            <div className="user-form-group">
                <label htmlFor="dimensions">Dimensions:</label>
                <input
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={requestDetails.dimensions}
                    onChange={handleInputChange}
                />
            </div>

            <div className="user-form-group">
                <label htmlFor="documents">Upload Required Documents:</label>
                <input
                    type="file"
                    id="documents"
                    name="documents"
                    multiple
                    onChange={handleFileChange}
                />
            </div>

            <div className="user-form-group">
                <label htmlFor="specialNotes">Special Notes (Optional):</label>
                <textarea
                    id="specialNotes"
                    name="specialNotes"
                    value={requestDetails.specialNotes}
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <button className="user-submit-request-button" onClick={submitRequest}>
                Submit Request
            </button>
        </div>
    );
};

export default UserBookNewRequest;
