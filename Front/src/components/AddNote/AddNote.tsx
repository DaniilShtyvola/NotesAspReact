import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddNote = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [message, setMessage] = useState<{ text: string, variant: string } | null>(null);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newNote = {
            title: title,
            text: text,
        };

        try {
            const token = localStorage.getItem("token")!;
            await axios.post("https://localhost:44370/notes", newNote, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage({ text: "Note added successfully!", variant: "success" });
            setTitle("");
            setText("");
        } catch (error) {
            console.error(error);
            setMessage({ text: "Failed to add note.", variant: "danger" });
        }
    };

    const handleReset = () => {
        setTitle("");
        setText("");
        setMessage(null);
    };

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
                <h2>Add new note</h2>

                <Form.Group className="mb-3" controlId="formNoteTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group style={{ marginBottom: "1rem" }} className="mb3" controlId="formNoteText">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter note text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="me-2">
                    Add Note
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                    Reset
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

export default AddNote;
