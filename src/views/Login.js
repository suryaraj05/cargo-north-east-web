import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { BASE_URL, headers, handleResponse } from "utils/api";
import { useAuth } from "context/AuthContext";

const MinimalSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/sigin`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(response);
      if (data.token) {
        login(data);
        if (data.role === 'admin') {
          navigate("/admin/index");
        } else {
          navigate("/user/home");
        }
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
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
      <div style={{ width: 320 }}>
        <Form onSubmit={handleSubmit}>
          {error && <Alert color="danger">{error}</Alert>}
          <FormGroup className="mb-3">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: '#fff', fontSize: 14 }}>
            Don't have an account?{' '}
            <a
              href="#pablo"
              style={{ color: '#5e72e4' }}
              onClick={e => {
                e.preventDefault();
                navigate("/auth/register");
              }}
            >
              Sign up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimalSignin; 