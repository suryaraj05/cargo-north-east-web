import React, { useState } from "react";
import { Row, Col, Button } from "antd";

const ReceiverSenderForm = () => {
  const [receiverDetails, setReceiverDetails] = useState({
    companyName: '',
    companyAddress: '',
    eoriNo: '',
    vatNo: '',
    contactEmail: '',
    contactNo: ''
  });

  const [senderDetails, setSenderDetails] = useState({
    companyName: '',
    companyAddress: '',
    eoriNo: '',
    vatNo: '',
    contactEmail: '',
    contactNo: ''
  });

  const [buyerDetails, setBuyerDetails] = useState({
    companyName: '',
    companyAddress: '',
    eoriNo: '',
    vatNo: '',
    contactEmail: '',
    contactNo: ''
  });

  const [sellerDetails, setSellerDetails] = useState({
    companyName: '',
    companyAddress: '',
    eoriNo: '',
    vatNo: '',
    contactEmail: '',
    contactNo: ''
  });

  const [showBuyer, setShowBuyer] = useState(false);
  const [showSeller, setShowSeller] = useState(false);

  const handleInputChange = (section, field, value) => {
    switch (section) {
      case "receiver":
        setReceiverDetails({ ...receiverDetails, [field]: value });
        break;
      case "sender":
        setSenderDetails({ ...senderDetails, [field]: value });
        break;
      case "buyer":
        setBuyerDetails({ ...buyerDetails, [field]: value });
        break;
      case "seller":
        setSellerDetails({ ...sellerDetails, [field]: value });
        break;
      default:
        break;
    }
  };

  return (
    <div className="section">
      <h3>Receiver and Sender Details</h3>

      {/* First Row with Receiver and Sender Details */}
      <Row gutter={16}>
        {/* Receiver Details */}
        <Col span={12}>
          <div className="details-block">
            <h4>Receiver Details</h4>
            <label>Company Name:</label>
            <input
              type="text"
              value={receiverDetails.companyName}
              onChange={(e) => handleInputChange("receiver", "companyName", e.target.value)}
            />
            <label>Company Address:</label>
            <input
              type="text"
              value={receiverDetails.companyAddress}
              onChange={(e) => handleInputChange("receiver", "companyAddress", e.target.value)}
            />
            <label>EORI No:</label>
            <input
              type="text"
              value={receiverDetails.eoriNo}
              onChange={(e) => handleInputChange("receiver", "eoriNo", e.target.value)}
            />
            <label>VAT No:</label>
            <input
              type="text"
              value={receiverDetails.vatNo}
              onChange={(e) => handleInputChange("receiver", "vatNo", e.target.value)}
            />
            <label>Contact Email:</label>
            <input
              type="email"
              value={receiverDetails.contactEmail}
              onChange={(e) => handleInputChange("receiver", "contactEmail", e.target.value)}
            />
            <label>Contact No:</label>
            <input
              type="tel"
              value={receiverDetails.contactNo}
              onChange={(e) => handleInputChange("receiver", "contactNo", e.target.value)}
            />
          </div>
        </Col>

        {/* Sender Details */}
        <Col span={12}>
          <div className="details-block">
            <h4>Sender Details</h4>
            <label>Company Name:</label>
            <input
              type="text"
              value={senderDetails.companyName}
              onChange={(e) => handleInputChange("sender", "companyName", e.target.value)}
            />
            <label>Company Address:</label>
            <input
              type="text"
              value={senderDetails.companyAddress}
              onChange={(e) => handleInputChange("sender", "companyAddress", e.target.value)}
            />
            <label>EORI No:</label>
            <input
              type="text"
              value={senderDetails.eoriNo}
              onChange={(e) => handleInputChange("sender", "eoriNo", e.target.value)}
            />
            <label>VAT No:</label>
            <input
              type="text"
              value={senderDetails.vatNo}
              onChange={(e) => handleInputChange("sender", "vatNo", e.target.value)}
            />
            <label>Contact Email:</label>
            <input
              type="email"
              value={senderDetails.contactEmail}
              onChange={(e) => handleInputChange("sender", "contactEmail", e.target.value)}
            />
            <label>Contact No:</label>
            <input
              type="tel"
              value={senderDetails.contactNo}
              onChange={(e) => handleInputChange("sender", "contactNo", e.target.value)}
            />
          </div>
        </Col>
      </Row>

      {/* Second Row with Buyer and Seller Details */}
      <Row gutter={16}>
        {/* Buyer Details */}
        <Col span={12}>
          <div className="details-block">
            <h4>Buyer Details (if different from Reciever)</h4>
            <Button onClick={() => setShowBuyer(!showBuyer)}>
              {showBuyer ? "Hide" : "Show"} Buyer Form
            </Button>
            {showBuyer && (
              <>
                <label>Company Name:</label>
                <input
                  type="text"
                  value={buyerDetails.companyName}
                  onChange={(e) => handleInputChange("buyer", "companyName", e.target.value)}
                />
                <label>Company Address:</label>
                <input
                  type="text"
                  value={buyerDetails.companyAddress}
                  onChange={(e) => handleInputChange("buyer", "companyAddress", e.target.value)}
                />
                <label>EORI No:</label>
                <input
                  type="text"
                  value={buyerDetails.eoriNo}
                  onChange={(e) => handleInputChange("buyer", "eoriNo", e.target.value)}
                />
                <label>VAT No:</label>
                <input
                  type="text"
                  value={buyerDetails.vatNo}
                  onChange={(e) => handleInputChange("buyer", "vatNo", e.target.value)}
                />
                <label>Contact Email:</label>
                <input
                  type="email"
                  value={buyerDetails.contactEmail}
                  onChange={(e) => handleInputChange("buyer", "contactEmail", e.target.value)}
                />
                <label>Contact No:</label>
                <input
                  type="tel"
                  value={buyerDetails.contactNo}
                  onChange={(e) => handleInputChange("buyer", "contactNo", e.target.value)}
                />
              </>
            )}
          </div>
        </Col>

        {/* Seller Details */}
        <Col span={12}>
          <div className="details-block">
            <h4>Seller Details (if different from Sender)</h4>
            <Button onClick={() => setShowSeller(!showSeller)}>
              {showSeller ? "Hide" : "Show"} Seller Form
            </Button>
            {showSeller && (
              <>
                <label>Company Name:</label>
                <input
                  type="text"
                  value={sellerDetails.companyName}
                  onChange={(e) => handleInputChange("seller", "companyName", e.target.value)}
                />
                <label>Company Address:</label>
                <input
                  type="text"
                  value={sellerDetails.companyAddress}
                  onChange={(e) => handleInputChange("seller", "companyAddress", e.target.value)}
                />
                <label>EORI No:</label>
                <input
                  type="text"
                  value={sellerDetails.eoriNo}
                  onChange={(e) => handleInputChange("seller", "eoriNo", e.target.value)}
                />
                <label>VAT No:</label>
                <input
                  type="text"
                  value={sellerDetails.vatNo}
                  onChange={(e) => handleInputChange("seller", "vatNo", e.target.value)}
                />
                <label>Contact Email:</label>
                <input
                  type="email"
                  value={sellerDetails.contactEmail}
                  onChange={(e) => handleInputChange("seller", "contactEmail", e.target.value)}
                />
                <label>Contact No:</label>
                <input
                  type="tel"
                  value={sellerDetails.contactNo}
                  onChange={(e) => handleInputChange("seller", "contactNo", e.target.value)}
                />
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ReceiverSenderForm;
