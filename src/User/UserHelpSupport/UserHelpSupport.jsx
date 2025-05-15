import React, { useState } from 'react';
import './UserHelpSupport.css';

const UserHelpSupport = () => {
    const [ticket, setTicket] = useState({ subject: '', message: '', attachment: null });

    const faqs = [
        { question: 'How to submit a request?', answer: 'Go to the "Requests" tab and click on "Create Request". Fill out the form and submit it.' },
        { question: 'How to track a shipment?', answer: 'Once the shipment is dispatched, you will receive an update with tracking details in the "In Progress" section.' },
        { question: 'How do I upload documents?', answer: 'In the "Book New Request" section, you can upload documents as part of the request form.' },
    ];

    const guides = [
        { title: 'Request Creation', description: 'Step-by-step guide on how to create a request.' },
        { title: 'Shipment Tracking', description: 'Tutorial on how to track your shipments.' },
        { title: 'Managing Invoices', description: 'Learn how to manage your invoices effectively.' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTicket({ ...ticket, [name]: value });
    };

    const handleFileChange = (e) => {
        setTicket({ ...ticket, attachment: e.target.files[0] });
    };

    const submitTicket = () => {
        if (ticket.subject && ticket.message) {
            alert('Support ticket submitted successfully! We will get back to you shortly.');
            setTicket({ subject: '', message: '', attachment: null });
        } else {
            alert('Please provide both a subject and a message.');
        }
    };

    return (
        <div className="user-help-support-container">
            <h2>Help & Support</h2>

            {/* FAQs Section */}
            <div className="faqs-section">
                <h3>Frequently Asked Questions</h3>
                <ul>
                    {faqs.map((faq, index) => (
                        <li key={index} className="faq-item">
                            <strong>{faq.question}</strong>
                            <p>{faq.answer}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Contact Support Section */}
            <div className="contact-support">
                <h3>Contact Support</h3>
                <div className="form-group">
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={ticket.subject}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={ticket.message}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="attachment">Attachment (optional):</label>
                    <input
                        type="file"
                        id="attachment"
                        onChange={handleFileChange}
                    />
                </div>
                <button onClick={submitTicket}>Submit Ticket</button>
            </div>

            {/* Guides Section */}
            <div className="guides-section">
                <h3>Guides</h3>
                <ul>
                    {guides.map((guide, index) => (
                        <li key={index} className="guide-item">
                            <strong>{guide.title}</strong>
                            <p>{guide.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserHelpSupport;
