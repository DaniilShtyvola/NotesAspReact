import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

import { Button, ListGroup, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserXmark, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface User {
    id: string;
    userName: string;
    email: string;
    roles: string[];
}

const Users: FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://localhost:44370/User', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch users. Please try again later.');
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://localhost:44370/User/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            console.error(err);
            setError('Failed to delete user. Please try again.');
        }
    };

    const handlePromote = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`https://localhost:44370/User/${id}/promote`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedUsers = users.map(user =>
                user.id === id ? { ...user, roles: [...user.roles, 'Admin'] } : user
            );
            setUsers(updatedUsers);
        } catch (err) {
            console.error(err);
            setError('Failed to promote user. Please try again.');
        }
    };

    const handleDemote = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`https://localhost:44370/User/${id}/demote`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedUsers = users.map(user =>
                user.id === id ? { ...user, roles: user.roles.filter(role => role !== 'Admin') } : user
            );
            setUsers(updatedUsers);
        } catch (err) {
            console.error(err);
            setError('Failed to demote user. Please try again.');
        }
    };

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            <ListGroup>
                {users.map(user => (
                    <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{user.userName}</strong> - {user.email} {user.roles.includes('Admin') && '- Admin'}
                        </div>
                        <div>
                            <Button
                                variant="danger"
                                onClick={() => handleDelete(user.id)}
                                className="me-2"
                            >
                                <FontAwesomeIcon icon={faUserXmark} />
                            </Button>
                            <Button
                                variant="warning"
                                onClick={() => user.roles.includes('Admin') ? handleDemote(user.id) : handlePromote(user.id)}
                            >
                                {user.roles.includes('Admin') ? <FontAwesomeIcon style={{ fontSize: "130%", position: "relative", top: "2px" }} icon={faCaretDown} /> : <FontAwesomeIcon style={{ fontSize: "130%", position: "relative", top: "2px" }} icon={faCaretUp} />}
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default Users;
