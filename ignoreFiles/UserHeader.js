// import { Button, Container, Row, Col } from "reactstrap";

// const UserHeader = () => {
//   return (
//     <>
//       <div
//         className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
//         style={{
//           minHeight: "600px",
//           backgroundImage:
//             "url(" + require("../../assets/img/theme/profile-cover.jpg") + ")",
//           backgroundSize: "cover",
//           backgroundPosition: "center top",
//         }}
//       >
//         {/* Mask */}
//         <span className="mask bg-gradient-default opacity-8" />
//         {/* Header container */}
//         <Container className="d-flex align-items-center" fluid>
//           <Row>
//             <Col lg="7" md="10">
//               <h1 className="display-2 text-white">Hello Jesse</h1>
//               <p className="text-white mt-0 mb-5">
//                 This is your profile page. You can see the progress you've made
//                 with your work and manage your projects or assigned tasks
//               </p>
//               <Button
//                 color="info"
//                 href="#pablo"
//                 onClick={(e) => e.preventDefault()}
//               >
//                 Edit profile
//               </Button>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default UserHeader;


import React from "react";
import { Container, Row, Col } from "reactstrap";
import customsIcon from "../../assets/img/icons/common/customs-icon.svg";
import arrowIcon from "../../assets/img/icons/common/arrow-icon.svg";
import shipmentIcon from "../../assets/img/icons/common/shipping-icon.svg";
import CardComponent from "../src/components/cards/CardComponent"; // Adjusted path for CardComponent

const UserHeader = () => {
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

export default UserHeader;

