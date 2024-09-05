import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Tabs, Tab, Container, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from '../Register/Register.tsx';
import Notes from '../Notes/Notes.tsx';
import Users from '../Users/Users.tsx';

const App = () => {
   const [activeKey, setActiveKey] = useState<string>('login');
   const [message, setMessage] = useState<{ text: string, variant: string } | null>(null);
   const [isFadingOut, setIsFadingOut] = useState(false);

   const [showNotes, setShowNotes] = useState<boolean>(false);
   const [showUsers, setShowUsers] = useState<boolean>(false);

   const [login, setLogin] = useState("");
   const [pass, setPass] = useState("");

   const [username, setUsername] = useState<string | null>(null);

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

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const loginPayload = { Username: login, Password: pass };

      axios.post("https://localhost:44370/Authenticate/login", loginPayload)
         .then((response) => {
            localStorage.setItem("token", response.data.token);
            setUsername(login);
            setMessage({ text: "Login successful!", variant: "success" });
            setPass("");
            setLogin("");
            setShowNotes(true);

            const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
            const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            setShowUsers(roles && roles.includes('Admin'));

            console.log(decodedToken);
            console.log(roles);
         })
         .catch((error) => {
            console.error(error);
            setMessage({ text: "Login failed! The nickname or password is incorrect.", variant: "danger" });
         });
   }

   return (
      <Container className="mt-4">
         <Tabs
            id="auth-tabs"
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k || 'login')}
            className="mb-3"
         >
            <Tab eventKey="login" title="Login">
               <Container className="mt-4">
                  <Container className="d-flex justify-content-center align-items-center">
                     <Form onSubmit={handleSubmit} style={{ width: '300px' }}>
                        <h2 style={{ marginBottom: "0.5rem" }}>Login</h2>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                           <Form.Label>Enter nickname</Form.Label>
                           <Form.Control
                              type="text"
                              placeholder="Nickname"
                              value={login}
                              onChange={(e) => setLogin(e.target.value)}
                           />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                           <Form.Label>Enter password</Form.Label>
                           <Form.Control
                              type="password"
                              placeholder="Password"
                              value={pass}
                              onChange={(e) => setPass(e.target.value)}
                           />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                           Login
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
               </Container>
            </Tab>
            <Tab eventKey="register" title="Register">
               <Container className="mt-4">
                  <Register />
               </Container>
            </Tab>
            {showNotes && (
               <Tab eventKey="notes" title="Notes">
                  <Container className="mt-4">
                     <Notes username={username} />
                  </Container>
               </Tab>
            )}
            {showUsers && (
               <Tab eventKey="users" title="Users">
                  <Container className="mt-4">
                     <Users />
                  </Container>
               </Tab>
            )}
         </Tabs>
      </Container>
   );
};

export default App;
