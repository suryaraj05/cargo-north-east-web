import React from "react";
import { Container, Row, Col } from "reactstrap";
import customsIcon from "../../assets/img/icons/common/customs-icon.svg";
import arrowIcon from "../../assets/img/icons/common/arrow-icon.svg";
import shipmentIcon from "../../assets/img/icons/common/shipping-icon.svg";
import CardComponent from "../../components/cards/CardComponent"; // Adjusted path for CardComponent

const Header = () => {
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-md-8"
        style={{ backgroundColor: "#233E93" }}
      >
        <Container fluid>
          <div className="header-body">
            {/* Cards */}
            <Row>
              <Col lg="6" xl="4">
                <CardComponent
                  heading="Shipment"
                  subheading="Track your shipments"
                  iconPath={shipmentIcon} // Path to your custom icon
                  // iconPath="../../assets/img/icons/common/customs-icon.svg" // Path to your custom icon
                  arrowIconPath={arrowIcon} // Path to your arrow icon
                />
              </Col>
              <Col lg="6" xl="4">
                <CardComponent
                  heading="Customs Clearance"
                  subheading="Delivery status"
                  iconPath={customsIcon} // Path to your custom icon
                  arrowIconPath={arrowIcon} // Path to your arrow icon
                />
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
