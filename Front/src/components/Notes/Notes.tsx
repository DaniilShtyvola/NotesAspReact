import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Card, Container, Row, Col, Button, Alert, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWrench, faRotateRight, faPlus } from '@fortawesome/free-solid-svg-icons';

interface Note {
    id: number;
    title: string;
    text: string;
    createdAt: string;
}

interface NotesProps {
    username: string | null;
}

const Notes: React.FC<NotesProps> = ({ username }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [editedText, setEditedText] = useState<string>("");

    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>("");
    const [newText, setNewText] = useState<string>("");

    const fetchNotes = async () => {
        const token = localStorage.getItem("token")!;

        try {
            const response = await axios.get("https://localhost:44370/notes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch notes. Please try again later.");
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleEditNote = (note: Note) => {
        setCurrentNote(note);
        setEditedTitle(note.title);
        setEditedText(note.text);
        setShowEditModal(true);
    };

    const handleSaveNote = async () => {
        const token = localStorage.getItem("token")!;

        if (!currentNote) {
            console.error("No note selected for updating.");
            return;
        }

        try {
            const updatedNote = {
                title: editedTitle,
                text: editedText,
            };

            await axios.put(`https://localhost:44370/notes/${currentNote.id}`, updatedNote, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            fetchNotes();
            setShowEditModal(false);
        } catch (error) {
            console.error("Failed to update note", error);
            setError("Failed to update note. Please try again.");
        }
    };

    const handleDeleteNote = async (id: number) => {
        const token = localStorage.getItem("token")!;
        try {
            await axios.delete(`https://localhost:44370/notes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            console.error("Failed to delete note", err);
            setError("Failed to delete note. Please try again later.");
        }
    };

    const handleAddNote = async () => {
        const token = localStorage.getItem("token")!;
        try {
            const newNote = {
                title: newTitle,
                text: newText,
            };

            await axios.post("https://localhost:44370/notes", newNote, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            fetchNotes();
            setNewTitle("");
            setNewText("");
            setShowAddModal(false);
        } catch (error) {
            console.error("Failed to add note", error);
            setError("Failed to add note. Please try again.");
        }
    };

    const handleClearNote = () => {
        setNewTitle("");
        setNewText("");
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{username}'s notes</h2>
                <div className="d-flex">
                    <Button variant="link" onClick={() => setShowAddModal(true)}>
                        <FontAwesomeIcon style={{ fontSize: "180%" }} icon={faPlus} />
                    </Button>
                    <Button variant="link" onClick={fetchNotes}>
                        <FontAwesomeIcon style={{ fontSize: "180%" }} icon={faRotateRight} />
                    </Button>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row xs={2} md={3} lg={5} className="g-4">
                {notes.map((note) => (
                    <Col key={note.id}>
                        <Card className="custom-card" style={{ height: "14rem" }}>
                            <Card.Body>
                                <Card.Title>{note.title}</Card.Title>
                                <Card.Text>{note.text}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between align-items-center">
                                <span className="text-muted">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                                <div>
                                    <Button
                                        variant="link"
                                        style={{
                                            padding: "0",
                                            color: "#6c757d",
                                        }}
                                        onClick={() => handleEditNote(note)}
                                    >
                                        <FontAwesomeIcon icon={faWrench} />
                                    </Button>
                                    <Button
                                        variant="link"
                                        style={{
                                            padding: "0",
                                            paddingLeft: "12px",
                                            color: "#6c757d",
                                        }}
                                        onClick={() => handleDeleteNote(note.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formNoteTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter note title"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formNoteText">
                            <Form.Label>Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter note text"
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSaveNote}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formNewNoteTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter note title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formNewNoteText">
                            <Form.Label>Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter note text"
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClearNote}>
                        Clear
                    </Button>
                    <Button variant="primary" onClick={handleAddNote}>
                        Add Note
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default Notes;