import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { BASE_URL, headers, handleResponse } from "utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/user/signup`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await handleResponse(response);
      navigate("/auth/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Card className="auth-card">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center mb-4">
              <h1 className="text-white">Create Account</h1>
              <p className="text-lead text-light">
                Sign up to get started
              </p>
            </div>
            
            <Form role="form" onSubmit={handleSubmit}>
              {error && <Alert color="danger">{error}</Alert>}
              
              <FormGroup className="mb-4">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              
              <FormGroup className="mb-4">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              
              <FormGroup className="mb-4">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              
              <FormGroup className="mb-4">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              
              <div className="text-center">
                <Button 
                  className="my-4 auth-button" 
                  color="primary" 
                  type="submit"
                  disabled={loading}
                  block
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </Form>
            
            <div className="text-center mt-4">
              <p className="text-light">
                Already have an account?{" "}
                <a
                  href="#pablo"
                  className="text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/auth/login");
                  }}
                >
                  Sign in
                </a>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(87deg, #172b4d 0, #1a174d 100%) !important;
          padding: 2rem;
        }
        
        .auth-container {
          width: 100%;
          max-width: 400px;
        }
        
        .auth-card {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 1rem;
        }
        
        .auth-button {
          background: #5e72e4 !important;
          border: none;
          padding: 0.75rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .auth-button:hover {
          background: #4a5cd1 !important;
          transform: translateY(-1px);
        }
        
        .input-group-alternative {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 0.5rem;
        }
        
        .input-group-alternative .form-control {
          background: transparent;
          color: white;
        }
        
        .input-group-alternative .input-group-text {
          background: transparent;
          border: none;
          color: #8898aa;
        }
        
        .input-group-alternative .form-control::placeholder {
          color: #8898aa;
        }
        
        .text-primary {
          color: #5e72e4 !important;
        }
      `}</style>
    </div>
  );
};

export default Register; 