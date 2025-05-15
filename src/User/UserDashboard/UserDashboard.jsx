import { useState } from "react";
// node.js library that concatenates classes (strings)
// import classnames from "classnames";
// react plugin used to create charts
// import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
} from "reactstrap";

// core components
// import {
//   chartOptions,
//   parseOptions,
//   chartExample1,
//   chartExample2,
// } from "variables/charts.js";

// import Header from "components/Headers/Header.js";
import UserHeader from "User/UserHeader/UserHeader";

const UserDashboard = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  // Removed the Chart.js related code, including the parseOptions function
  // and chartExample1, chartExample2 imports

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col className="order-xl-1" xl="12">  {/* Set to xl="12" for full width */}
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Quick Enquiry</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Clear Form
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Enter your information
                  </h6>
                  <div className="px-4">  {/* Padding for the form */}
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-first-name">
                            First Name*
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            placeholder="First Name"
                            type="text"
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-last-name">
                            Last Name*
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-last-name"
                            placeholder="Last Name"
                            type="text"
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            Email Address*
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Email Address"
                            type="email"
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <h6 className="heading-small text-muted mb-4 mt-5">Shipment Details</h6>
                    <Row>
                      <Col md="3">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-city-departure">
                            City Departure
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-city-departure"
                            placeholder="From"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-delivery-city">
                            Delivery City
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-delivery-city"
                            placeholder="To"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-shipment-type">
                            Shipment Type
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-shipment-type"
                            type="select"
                          >
                            <option value="">Select Type</option>
                            <option>General</option>
                            <option>Food</option>
                            <option>Fragile</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-weight">
                            Weight (kg)
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-weight"
                            placeholder="Weight"
                            type="number"
                            min="0"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <h6 className="heading-small text-muted mb-4 mt-5">Additional Information</h6>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-control-label">Special Instructions</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Add any special instructions"
                            rows="4"
                            type="textarea"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-control-label mb-3">Service Type*</label>
                          <Row>
                            <Col md="6">
                              <div className="custom-control custom-checkbox mb-3">
                                <Input type="checkbox" className="custom-control-input" id="check1" />
                                <label className="custom-control-label" htmlFor="check1">Customs Clearance</label>
                              </div>
                              <div className="custom-control custom-checkbox mb-3">
                                <Input type="checkbox" className="custom-control-input" id="check2" />
                                <label className="custom-control-label" htmlFor="check2">Road Transportation</label>
                              </div>
                              <div className="custom-control custom-checkbox mb-3">
                                <Input type="checkbox" className="custom-control-input" id="check3" />
                                <label className="custom-control-label" htmlFor="check3">Air Transportation</label>
                              </div>
                            </Col>
                            <Col md="6">
                              <div className="custom-control custom-checkbox mb-3">
                                <Input type="checkbox" className="custom-control-input" id="check4" />
                                <label className="custom-control-label" htmlFor="check4">Sea Transportation</label>
                              </div>
                              <div className="custom-control custom-checkbox mb-3">
                                <Input type="checkbox" className="custom-control-input" id="check5" />
                                <label className="custom-control-label" htmlFor="check5">Logistics Planning</label>
                              </div>
                              <div className="custom-control custom-checkbox mb-3">
                                <Input type="checkbox" className="custom-control-input" id="check6" />
                                <label className="custom-control-label" htmlFor="check6">House Move</label>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mt-5">
                      <Col className="text-right">
                        <Button color="secondary" type="button" className="mr-3">
                          Cancel
                        </Button>
                        <Button color="primary" type="submit">
                          Submit Enquiry
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserDashboard;
