import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyIcon from "@mui/icons-material/Key";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/characters");
    } catch {
      setError("Failed to sign in");
    }
    setLoading(false);
  }

  return (
    <>
      {" "}
      <div className="signup section--style ">
        <Card className="signup__card">
          <Card.Body className="signup__card--body">
            <h2 className="signup__card--heading">Log in</h2>
            {error && <Alert className="signup__alert">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="signup__form">
              <Form.Group id="email" className="signup__form--group">
                <Form.Label className="signup__form--label">
                  <MailOutlineIcon></MailOutlineIcon> Email
                </Form.Label>
                <Form.Control
                  type="email"
                  className="signup__control"
                  ref={emailRef}
                  required
                  placeholder="Enter your e-mail"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="signup__form--group" id="password">
                <Form.Label className="signup__form--label">
                  <KeyIcon></KeyIcon> Password
                </Form.Label>
                <Form.Control
                  type="password"
                  className="signup__control"
                  ref={passwordRef}
                  required
                  placeholder="Enter your password"
                ></Form.Control>
              </Form.Group>

              <Button
                disabled={loading}
                className="signup__button"
                type="submit"
              >
                Log in
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="signup__text">
          Need an account? &nbsp;{" "}
          <Link className="signup__link" to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}
