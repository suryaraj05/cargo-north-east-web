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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#172b4d',
    }}>
      <div style={{ width: 320, background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: '#22336b' }}>Sign Up</h2>
        </div>
        <Form onSubmit={handleSubmit}>
          {error && <Alert color="danger">{error}</Alert>}
          <FormGroup className="mb-3">
            <Input
              placeholder="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Input
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button
            color="primary"
            type="submit"
            block
            disabled={loading}
            style={{ background: '#22336b', border: 'none', fontWeight: 600 }}
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: '#000', fontSize: 14 }}>
            Already have an account?{' '}
            <a
              href="#pablo"
              style={{ color: '#5e72e4' }}
              onClick={e => {
                e.preventDefault();
                navigate("/auth/login");
              }}
            >
              Sign in
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register; 