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

function Register({ successLoginRegister, token }) {
  const navigate = useNavigate();
  const [registerName, setRegisterName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);
  
  const register = async () => {
    try {
      const res = await axios.post('https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/users/signUp', {
        username: registerName,
        password: registerPassword
      });

      if (res.data.statusCode !== 200) {
        alert(res.data.body || "Sign uup failed");
        return;
      }

      alert('Signed in!');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
    <div style={{backgroundColor: '#1a1a2e', minHeight: '100vh', padding: '100px'}}>
      <Container className="text-center mb-5">
        <h1 style={{fontSize: '4rem', color: '#f1fafb'}}><strong>Shiplink - Smart Despatch</strong></h1>
      </Container>
      <Row className="justify-content-center">
        <Card style={{ width: '18rem', margin: '2rem'}}>
        <Card.Body>
          <Card.Title className="text-center" style={{margin: '2rem'}}><strong>Sign Up!</strong></Card.Title>
          <br />
          <Form.Group className="mb-3">
            <Form.Label htmlFor="registerName">Name</Form.Label>
            <Form.Control
              type="text"
              id="registerName"
              value={registerName}
              placeholder='Enter name'
              onChange={e => setRegisterName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="registerPassword">Password</Form.Label>
            <Form.Control
              type="password"
              id="registerPassword"
              value={registerPassword}
              placeholder='Password'
              onChange={e => setRegisterPassword(e.target.value)}
            />
          </Form.Group>
            <br />
            <div className="d-flex justify-content-center">
              <Button className='btn-custom' onClick={register}>Submit</Button>
            </div>
              <div className="mt-3">
                  <span>Already registered? </span>
                  <Link to="/login">Login here!</Link>
              </div>
        </Card.Body>
        </Card>          
      </Row>
    </div>
    </>
  )
}

export default Register;