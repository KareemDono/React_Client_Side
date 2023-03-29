import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

const apiUrl = "http://localhost:54577/api/users/";

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
    city: "",
    userType: "",
    birthDate: "",
    phoneNumber: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      username: user.username,
      city: user.city,
      userType: user.userType,
      birthDate: user.birthDate,
      phoneNumber: user.phoneNumber,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: new Headers({
          "Content-type": "application/json; charset=UTF-8",
          Accept: "application/json; charset=UTF-8",
        }),
      });
      const { Id } = await res.json();
      const maxId = users.length > 0 ? Math.max(...users.map((u) => u.Id)) : 0;
      const newUser = { ...formData, Id: maxId + 1 };
      setUsers([...users, newUser]);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        username: "",
        city: "",
        userType: "",
        birthDate: "",
        phoneNumber: "",
      });
    } catch (err) {
      console.error(err);
      console.log(err.Message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl + selectedUser.Id, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: new Headers({
          "Content-type": "application/json; charset=UTF-8",
          Accept: "application/json; charset=UTF-8",
        }),
      });
      const data = await res.json();
      const updatedUser = { ...selectedUser, ...formData };
      setUsers(
        users.map((user) => (user.Id === updatedUser.Id ? updatedUser : user))
      );
      setSelectedUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        username: "",
        city: "",
        userType: "",
        birthDate: "",
        phoneNumber: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await fetch(apiUrl + user.Id, {
        method: "DELETE",
        headers: new Headers({
          Accept: "application/json; charset=UTF-8",
        }),
      });
      setUsers(users.filter((u) => u.Id !== user.Id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl + formData.Id, {
        headers: new Headers({
          Accept: "application.json; charset=UTF-8",
        }),
      });
      const data = await res.json();
      if (data) {
        setUsers([data]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(apiUrl, {
          headers: new Headers({
            Accept: "application/json; charset=UTF-8",
          }),
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2>Users</h2>
      <Form onSubmit={handleSearchUser}>
        <Form.Group controlId="formSearch">
          <Form.Label>Search by ID:</Form.Label>
          <Form.Control
            type="text"
            name="Id"
            value={formData.Id}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button type="submit">Search</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Username</th>
            <th>City</th>
            <th>User Type</th>
            <th>Birth Date</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.Id}>
              <td>{user.Id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.username}</td>
              <td>{user.city}</td>
              <td>{user.userType}</td>
              <td>{user.birthDate}</td>
              <td>{user.phoneNumber}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleSelectUser(user)}
                >
                  <i className="bi bi-pencil-fill">Update</i>
                </Button>{"|"}
                <Button variant="danger" onClick={() => handleDeleteUser(user)}>
                  <i className="bi bi-trash-fill">Delete</i>
                </Button>{""}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>{selectedUser ? "Edit User" : "Create User"}</h2>
      <Form onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name:</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formLastName">
          <Form.Label>Last Name:</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="text"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formCity">
          <Form.Label>City:</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formUserType">
          <Form.Label>User Type:</Form.Label>
          <Form.Control
            type="text"
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formBirthDate">
          <Form.Label>Birth Date:</Form.Label>
          <Form.Control
            type="text"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formPhoneNumber">
          <Form.Label>Phone Number:</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {selectedUser ? "Update" : "Create"}
        </Button>
      </Form>
    </div>
  );
}

export default Users;
