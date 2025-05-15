import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import customsIcon from "../../assets/img/icons/common/customs-icon.svg";
import arrowIcon from "../../assets/img/icons/common/arrow-icon.svg";
import shipmentIcon from "../../assets/img/icons/common/shipping-icon.svg";
import CardComponent from "../../components/cards/CardComponent"; // Adjusted path for CardComponent
import ShipmentDetails from "User/UserShipmentRequest/ShipmentDetails"; // Ensure the path to the component is correct

const UserHeader = () => {
  // Define the paths for navigation
  const shipmentPagePath = "/User/UserShipmentRequest/ShipmentDetails"; // Correct path to shipment details form
  const customsPagePath = "/User/UserShipmentRequest/UserShipmentForm"; // Set this to your desired path for customs

  return (
    <div
      className="header pb-8 pt-5 pt-md-8"
      style={{ backgroundColor: "#233E93" }}
    >
      <Container fluid>
        <div className="header-body">
          {/* Cards */}
          <Row className="g-3"> {/* Add the g-3 to reduce the gap between columns */}
            <Col lg="6" xl="4"> {/* You can adjust lg or xl size for smaller card spacing */}
              <Link to={shipmentPagePath}> {/* Corrected Link path */}
                <CardComponent
                  heading="Shipment"
                  subheading="Track your shipments"
                  iconPath={shipmentIcon} // Path to your custom icon
                  arrowIconPath={arrowIcon} // Path to your arrow icon
                />
              </Link>
            </Col>
            <Col lg="6" xl="4">
              <Link to={customsPagePath}> {/* Wrap the second card with Link */}
                <CardComponent
                  heading="Customs Clearance"
                  subheading="Delivery status"
                  iconPath={customsIcon} // Path to your custom icon
                  arrowIconPath={arrowIcon} // Path to your arrow icon
                />
              </Link>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default UserHeader;
