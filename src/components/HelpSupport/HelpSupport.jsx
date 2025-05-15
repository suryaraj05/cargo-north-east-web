import React, { useState } from 'react';
import './HelpSupport.css';

const HelpSupport = () => {
    const [ticket, setTicket] = useState({ subject: '', message: '' });

    const faqs = [
        { question: 'How do I manage requests?', answer: 'Navigate to the Requests tab to view and manage all requests.' },
        { question: 'How can I send an invoice?', answer: 'Go to the Invoices tab, fill out the required fields, and upload the invoice.' },
        { question: 'What should I do if I encounter an error?', answer: 'Please contact support or raise a ticket using the form below.' },
    ];

    const guides = [
        { title: 'Sending Quotes', description: 'Step-by-step guide to sending quotes to users.' },
        { title: 'Managing Invoices', description: 'Learn how to upload and manage invoices effectively.' },
        { title: 'User Account Management', description: 'Tutorial on activating or deactivating user accounts.' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTicket({ ...ticket, [name]: value });
    };

    const submitTicket = () => {
        if (ticket.subject && ticket.message) {
            alert('Support ticket submitted successfully. Our team will contact you shortly.');
            setTicket({ subject: '', message: '' });
        } else {
            alert('Please fill in all fields before submitting.');
        }
    };

    return (
        <div className="help-support-container">
            <h2>Help & Support</h2>

            <div className="faqs">
                <h3>Frequently Asked Questions</h3>
                <ul>
                    {faqs.map((faq, index) => (
                        <li key={index}>
                            <strong>{faq.question}</strong>
                            <p>{faq.answer}</p>
                        </li>
                    ))}
                </ul>
            </div>

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
                    ></textarea>
                </div>
                <button onClick={submitTicket}>Submit Ticket</button>
            </div>

            <div className="guides">
                <h3>Guides</h3>
                <ul>
                    {guides.map((guide, index) => (
                        <li key={index}>
                            <strong>{guide.title}</strong>
                            <p>{guide.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HelpSupport;
