import './global.css'
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ successLoginRegister, token }) {
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);
  
  const login = async () => {
    try {
      const res = await axios.post('https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/users/login', {
        username: loginName,
        password: loginPassword
      });

      if (res.data.statusCode !== 200) {
        alert(res.data.body || "Login failed");
        return;
      }

      const token = res.data.token;
      successLoginRegister(token, loginName);

      alert('Loged in!');
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  return (
    <>
    <div style={{backgroundColor: '#1a1a2e', minHeight: '100vh', padding: '100px'}}>
      <Container className="text-center mb-5">
        <h1 style={{fontSize: '4rem', color: '#f1fafb'}}><strong>IOS Despatch Advice</strong></h1>
      </Container>

      <Row className="justify-content-center">
        <Card style={{ width: '18rem', margin: '2rem' }}>
        <Card.Body>
          <Card.Title className="text-center" style={{margin: '2rem'}}><strong>Log in!</strong></Card.Title>
          <br />
          <Form.Group className="mb-3">
            <Form.Label htmlFor="loginName">Name</Form.Label>
            <Form.Control
              type="text"
              id="loginName"
              value={loginName}
              placeholder='Enter name'
              onChange={e => setLoginName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="loginPassword">Password</Form.Label>
            <Form.Control
              type="password"
              id="loginPassword"
              value={loginPassword}
              placeholder='Password'
              onChange={e => setLoginPassword(e.target.value)}
            />
          </Form.Group>
          <br />
          <div className="d-flex justify-content-center">
              <Button className='btn-custom' onClick={login}>Submit</Button>
          </div>
          <div className="mt-3">
              <span>Dont have an account? </span>
              <Link to="/register">Register here!</Link>
          </div>
        </Card.Body>
        </Card>
      </Row>
    </div>
    </>
  )
}

export default Login;