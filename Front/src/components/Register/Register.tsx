import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const Register = () => {
   const [regEmail, setRegEmail] = useState("");
   const [regLogin, setRegLogin] = useState("");
   const [regPass, setRegPass] = useState("");
   const [confirmPass, setConfirmPass] = useState("");

   const [message, setMessage] = useState<{ text: string, variant: string } | null>(null);
   const [isFadingOut, setIsFadingOut] = useState(false);

   function handleSubmit(event) {
      event.preventDefault();
      const loginPayload = { Username: regLogin, Email: regEmail, Password: regPass };

      if (regPass !== confirmPass) {
         setMessage({ text: "Passwords do not match.", variant: "danger" });
         return;
      }

      if (!regEmail || !regLogin || !regPass || !confirmPass) {
         setMessage({ text: "All fields must be filled.", variant: "danger" });
         return;
     }

      axios.post("https://localhost:44370/Authenticate/register", loginPayload)
         .then((response) => {
            if (response.status === 200) {
               setMessage({ text: "Registration successful!", variant: "success" });
               setRegEmail("");
               setRegLogin("");
               setRegPass("");
               setConfirmPass("");
            } else {
               setMessage({ text: "Registration failed. Please try again.", variant: "danger" });
            }
         })
         .catch((e) => {
            setMessage({ text: "An error occurred. Please try again.", variant: "danger" });
            console.error(e);
         });
   }

   useEffect(() => {
      if (message) {
         const fadeOutTimer = setTimeout(() => {
            setIsFadingOut(true);
         }, 3000);

         const removeMessageTimer = setTimeout(() => {
            setMessage(null);
            setIsFadingOut(false);
         }, 4000);

         return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeMessageTimer);
         };
      }
   }, [message]);

   return (
      <Container className="d-flex justify-content-center align-items-center">
         <Form onSubmit={handleSubmit} style={{ width: '300px' }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Register</h2>

            <Form.Group className="mb-3" controlId="formEmail">
               <Form.Label>Email address</Form.Label>
               <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
               />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUsername">
               <Form.Label>Username</Form.Label>
               <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={regLogin}
                  onChange={(e) => setRegLogin(e.target.value)}
               />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
               <Form.Label>Password</Form.Label>
               <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
               />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
               <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
               />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
               Register
            </Button>

            {message && (
               <Alert
                  style={{
                     marginTop: "1rem",
                     opacity: isFadingOut ? 0 : 1,
                     transition: "opacity 1s ease-in-out",
                  }}
                  variant={message.variant}
               >
                  {message.text}
               </Alert>
            )}
         </Form>
      </Container>
   );
};

export default Register;
