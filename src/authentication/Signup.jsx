import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyIcon from "@mui/icons-material/Key";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/characters");
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <>
      {" "}
      <div className="signup section--style ">
        <Card className="signup__card">
          <Card.Body className="signup__card--body">
            <h2 className="signup__card--heading">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="signup__form">
              <Form.Group id="email" className="signup__form--group">
                <Form.Label className="signup__form--label">
                  <MailOutlineIcon></MailOutlineIcon> Email
                </Form.Label>
                <Form.Control
                  className="signup__control"
                  type="email"
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
                  className="signup__control"
                  type="password"
                  ref={passwordRef}
                  required
                  placeholder="Create a password"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="signup__form--group" id="password-confirm">
                <Form.Label className="signup__form--label">
                  <KeyIcon></KeyIcon> Password Confirmation
                </Form.Label>
                <Form.Control
                  className="signup__control"
                  type="password"
                  ref={passwordConfirmRef}
                  required
                  placeholder="Confirm your password"
                ></Form.Control>
              </Form.Group>
              <Button
                disabled={loading}
                className="signup__button"
                type="submit"
              >
                Sign Up
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="signup__text">
          Already have an account? &nbsp;{" "}
          <Link className="signup__link" to="/login">
            Log In
          </Link>
        </div>
      </div>
    </>
  );
}
